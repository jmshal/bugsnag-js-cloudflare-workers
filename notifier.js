require('./polyfill');

const name = 'Bugsnag JavaScript (Cloudflare Workers)';
const version = '1.0.0';
const url = 'https://github.com/jmshal/bugsnag-js-cloudflare-workers';

const Client = require('./Client');
const { schema } = require('@bugsnag/core/config');
const delivery = require('./delivery');
const plugin = require('./plugin');

module.exports = (options) => {
  if (typeof options === 'string') {
    options = { apiKey: options };
  }

  const bugsnag = new Client({ name, version, url });

  bugsnag.setOptions(options);
  bugsnag.delivery(delivery);
  bugsnag.configure(schema);
  bugsnag.use(plugin);

  return bugsnag;
};
