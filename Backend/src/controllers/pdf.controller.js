const pdfParse = require("pdf-parse");
const generatePodcastScript = require("../utils/generateScript");
const parseScriptToJSON =  require("../utils/parseScript")
const generateAudioForScript = require("../utils/sarvamTTS")

const pdfPodCast = async (req, res) => {
  try {
    const buffer = req.file.buffer; // access in-memory PDF
    const languageCode = req.body.languageCode || 'hi-IN'; // default if not set

    const data = await pdfParse(buffer); // parse text
    const extractedText = data.text;
    const script = await generatePodcastScript(extractedText , languageCode);
    const structuredScript = parseScriptToJSON(script);
    const audioResult = await generateAudioForScript(structuredScript, languageCode);

    // Flatten all audio files into one list
const allAudioPaths = audioResult.flatMap(line => line.audioUrls);

// 🧠 Optional: if you want to concatenate or play in parts, send the full array
res.status(200).json({
  script: structuredScript,
  paragraphs: audioResult,
  audioUrls: allAudioPaths,  // array of urls
  languageCode,
});

  } catch (err) {
    console.error("Error generating script:", err);
    res.status(500).json({ message: "Failed to generate podcast script" });
  }
};

module.exports = pdfPodCast;
