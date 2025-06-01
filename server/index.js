const { handler } = require('./server');

module.exports = handler;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  require('./server').app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}