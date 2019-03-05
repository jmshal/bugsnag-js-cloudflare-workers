const bugsnag = require('@jmshal/bugsnag-js-cloudflare-workers');
const { version } = require('../package.json');

const bugsnagClient = bugsnag({
  apiKey: 'YOUR-API-KEY-HERE',
  appVersion: version,
});
const { addEventListener } = bugsnagClient.getPlugin('cloudflare-workers');

addEventListener('fetch', (event) => {
  event.respondWith(handler(event));
});

async function handler(event) {
  event.bugsnag.leaveBreadcrumb('Hello World');

  const url = new URL(event.request.url);
  switch (url.pathname) {
    case '/': {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <body>
          Hello World!
        </body>
        </html>
      `, {
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      });
    }
    case '/bad': {
      throw new Error('Uh oh!');
    }
    case '/bad-dependency': {
      let result;
      try {
        event.bugsnag.leaveBreadcrumb('Fetch httpbin.org');
        const response = await fetch('https://httpbin.org/status/500');
        if (!response.ok) {
          throw new Error('httpbin.org responded with ' + response.status);
        }
        result = await response.text();
      } catch (err) {
        event.bugsnag.notify(err);
      }
      return new Response('Result: ' + result);
    }
    default: {
      return new Response('Not Found', { status: 404 });
    }
  }
}
