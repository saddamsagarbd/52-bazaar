// server/index.js
const { app, handler } = require('./server');

// For Vercel deployment
module.exports = handler;

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/health`);
  });
}