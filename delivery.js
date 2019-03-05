const payload = require('@bugsnag/core/lib/json-payload');
const { isoDate } = require('@bugsnag/core/lib/es-utils');

// This should really exist already (as @bugsnag/delivery-fetch).

module.exports = {
  sendReport: (logger, config, report, cb = () => {}) => {
    try {
      fetch(config.endpoints.notify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bugsnag-Api-Key': report.apiKey || config.apiKey,
          'Bugsnag-Payload-Version': '4',
          'Bugsnag-Sent-At': isoDate(),
        },
        body: payload.report(report, config.filters),
      }).then(
        () => cb(null),
        (err) => { logger.error(err); cb(err); }
      );
    } catch (err) {
      logger.error(err);
      cb(err);
    }
  },
};
