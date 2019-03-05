const createReportFromErr = require('@bugsnag/core/lib/report-from-error');
const clone = require('@bugsnag/core/lib/clone-client');

const handledState = {
  severity: 'error',
  unhandled: true,
  severityReason: {
    type: 'unhandledFetchEvent',
    attributes: { framework: 'Cloudflare Workers' },
  },
};

function assignMetaData(bugsnagClient, request) {
  const url = new URL(request.url);
  const headers = {};
  for (const [name, value] of request.headers) {
    headers[name] = value;
  }
  const query = {};
  for (const [name, value] of url.searchParams) {
    query[name] = value;
  }
  const ipAddress = request.headers.get('cf-connecting-ip');
  bugsnagClient.request = {
    clientIp: ipAddress,
    headers: headers,
    httpMethod: request.method,
    path: url.pathname,
    url: request.url,
    query: query,
    referer: request.headers.get('referer') || undefined,
  };
  bugsnagClient.user = {
    id: ipAddress,
  };
}

module.exports = {
  name: 'cloudflare-workers',
  init: (client) => {
    return {
      addEventListener(event, handler, ...args) {
        if (event === 'fetch') {
          return addEventListener('fetch', (event) => {
            const bugsnagClient = clone(client);
            assignMetaData(bugsnagClient, event.request);
            try {
              const customEvent = {
                bugsnag: bugsnagClient,
                respondWith: (promise) => {
                  event.respondWith((async () => {
                    try {
                      return await promise;
                    } catch (err) {
                      bugsnagClient.notify(createReportFromErr(err, handledState));
                      throw err;
                    } finally {
                      await bugsnagClient._waitForTasks();
                    }
                  })());
                },
              };
              Object.keys(event).forEach((eventKey) => {
                customEvent[eventKey] = event[eventKey];
              });
              Object.setPrototypeOf(customEvent, event);
              handler(customEvent);
            } catch (err) {
              bugsnagClient.notify(createReportFromErr(err, handledState));
              event.waitUntil(bugsnagClient._waitForTasks());
              throw err;
            }
          });
        } else {
          return addEventListener(event, handler, ...args);
        }
      },
    };
  },
};
