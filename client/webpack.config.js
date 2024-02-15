const { createWebpackConfig } = require('@rails/webpacker');
const config = createWebpackConfig();

config.devServer.allowedHosts = config.devServer.allowedHosts.filter(
  (host) => host !== 'all'
);

module.exports = config;
