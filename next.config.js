const nextTranslate = require('next-translate');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  reactStrictMode: true,
  basePath: '',
  distDir: 'build',
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    // loader: 'imgix',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ['b71-backend.sslwireless.com', 'b71-backend-stage.sslwireless.com'],
  },
  ...nextTranslate()
}
