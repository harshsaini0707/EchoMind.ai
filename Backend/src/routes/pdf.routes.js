const express = require("express");
const router = express.Router();
const pdfPodCast = require("../controllers/pdf.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../utils/mutler"); 

router.post("/pdfAudio", upload.single("pdf"), pdfPodCast);

module.exports = router;
