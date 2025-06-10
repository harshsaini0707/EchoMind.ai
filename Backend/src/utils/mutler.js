const multer = require("multer");
const storage = multer.memoryStorage(); // buffer for cloud upload
const upload = multer({ storage });
module.exports = upload;
