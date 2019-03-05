const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins');

module.exports = {
  devtool: 'source-map',
  target: 'webworker',
  output: {
    filename: 'worker.js',
    publicPath: './',
  },
  plugins: [
    new BugsnagSourceMapUploaderPlugin({
      apiKey: 'YOUR-API-KEY-HERE',
      appVersion: version,
      overwrite: true,
    }),
  ],
};
