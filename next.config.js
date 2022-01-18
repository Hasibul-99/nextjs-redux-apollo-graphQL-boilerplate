const nextTranslate = require('next-translate');
const path = require('path');

module.exports = {
  // reactStrictMode: true,
  basePath: '',
  distDir: 'build',
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
      domains: ['b71-backend.sslwireless.com', 'b71-backend-stage.sslwireless.com'],
  },
  ...nextTranslate()
}
