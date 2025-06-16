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

   // res.status(200).json({ script: structuredScript, audio: audioResult });

    res.status(200).json({ 
  script: structuredScript,
  audio: audioResult,
  languageCode
});

  } catch (err) {
    console.error("Error generating script:", err);
    res.status(500).json({ message: "Failed to generate podcast script" });
  }
};

module.exports = pdfPodCast;
