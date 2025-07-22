const express = require("express");
const router = express.Router();

const { transcribeAudio, getUserHistory ,summarizeAudio, transcribeAudioToAudio } = require("../controllers/transcription.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const upload = require("../utils/mutler");

router.post("/upload", authMiddleware, upload.single("audio"), transcribeAudio);

router.get("/history", authMiddleware, getUserHistory);
router.post("/summary",authMiddleware, upload.single("audio"), summarizeAudio);

router.post("/audio-to-audio",authMiddleware, upload.single("audio"), transcribeAudioToAudio);

module.exports = router;
