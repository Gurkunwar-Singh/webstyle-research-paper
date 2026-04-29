const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Set the correct cache path for Render
  cacheDirectory: join('/opt/render/.cache', 'puppeteer'),
};