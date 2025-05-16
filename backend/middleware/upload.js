const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage temporarily

const upload = multer({ storage });

module.exports = upload;
