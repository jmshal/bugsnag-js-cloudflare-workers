# @jmshal/bugsnag-js-cloudflare-workers

An un-official Bugsnag notifier for Cloudflare Workers.

The notifier is injected into the `FetchEvent` object, and can be used to leave breadcrumbs or send error reports. Because of the nature of Cloudflare Workers, the response will wait until any Bugsnag errors have been reported. See the example below for more details.

## Example

```js
import bugsnag from '@jmshal/bugsnag-js-cloudflare-workers';

const bugsnagClient = bugsnag('API-KEY-HERE');
const { addEventListener } = bugsnagClient.getPlugin('cloudflare-workers');

addEventListener('fetch', (event) => {
  event.respondWith(handle());
});

async function handle(event) {
  const url = new URL(event.request.url);

  if (url.searchParams.has('leave-breadcrumb')) {
    // eg. ?leave-breadcrumb=Hello%20World
    event.bugsnag.leaveBreadcrumb(url.searchParams.get('leave-breadcrumb'));
  }

  switch (url.pathname) {
    case '/uncaught-error': {
      throw new Error('Uh oh! This error was not caught!');
    }
    case '/notify-error': {
      try {
        throw new Error('Catch me if you can!');
      } catch (err) {
        event.bugsnag.notify(err);
      }
      return new Response('There was an error, but I recovered.');
    }
    case '/': {
      return new Response('Hello World!');
    }
    default: {
      return new Response('Not Found', { status: 404 });
    }
  }
}
```

## License

MIT
