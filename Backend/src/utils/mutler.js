const multer = require("multer");
const storage = multer.memoryStorage(); // stores the file in RAM as a buffer
const upload = multer({ storage });
module.exports = upload;
