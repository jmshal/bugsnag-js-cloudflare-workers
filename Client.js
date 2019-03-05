const Client = require('@bugsnag/core/client');

class CustomClient extends Client {
  constructor(...args) {
    super(...args);

    // Any tasks (Promise objects) that are pending completion.
    this._tasks = [];

    // Overwrite so when the client is cloned, we get our custom client.
    this.BugsnagClient = CustomClient;
  }

  _waitForTasks() {
    const tasks = this._tasks.slice();
    this._tasks.length = 0;
    if (tasks.length) {
      return Promise.all(tasks);
    }
    return Promise.resolve();
  }

  notify(error, options, callback = () => {}) {
    this._tasks.push(new Promise((resolve) => {
      super.notify(error, options, (...args) => {
        callback(...args);
        resolve();
      });
    }));
  }
}

module.exports = CustomClient;
