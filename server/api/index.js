const serverless    = require('serverless-http');
const app = require('../server');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  // Export handler for Vercel
  module.exports.handler = serverless(app);
} else {
  // Start normal server for dev
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;