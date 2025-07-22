const cloudinary = require("../utils/cloudinary");
const Transcription = require("../models/Transcription.model");
const streamifier = require("streamifier");
require("dotenv").config()
const gTTS = require("gtts");
const translateToLanguage = require("../utils/gemini"); 
const { GoogleGenerativeAI } = require("@google/generative-ai");

const fs = require("fs");
const path = require("path");

const transcribeAudio = async (req, res) => {
  try {
    const { language } = req.body;
    const file = req.file; 
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized user!" });
    }
    if (!file) {
      return res.status(400).json({ message: "Audio file is required." });
    }
    if (!language) {
      return res.status(400).json({ message: "Target language for translation is required." });
    }
    //Cloudinary Upload
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video" }, 
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };

    const uploadResult = await streamUpload();
    const audioUrl = uploadResult.secure_url;

    //STT
    const genAI = new GoogleGenerativeAI(process.env.Gemini_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  
    const base64Audio = file.buffer.toString('base64');
    const mimeType = file.mimetype; 
    const parts = [
      { text: "Transcribe the following audio accurately:" }, 
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Audio,
        },
      },
    ];

    const geminiSTTResponse = await model.generateContent({
      contents: [{ parts: parts }],
    });

    

    let transcription = "";
    if (geminiSTTResponse.response && 
        geminiSTTResponse.response.candidates && 
        geminiSTTResponse.response.candidates.length > 0 &&
        geminiSTTResponse.response.candidates[0].content && 
        geminiSTTResponse.response.candidates[0].content.parts && 
        geminiSTTResponse.response.candidates[0].content.parts.length > 0) {
      transcription = geminiSTTResponse.response.candidates[0].content.parts[0].text;
    }

    if (!transcription || typeof transcription !== "string") {
      return res.status(502).json({ message: "Failed to get valid transcription from Gemini AI." });
    }


    const translatedText = await translateToLanguage(transcription, language);
    //console.log("Gemini Translate:", translatedText);

    const saved = await Transcription.create({
      user: user._id,
      audioUrl,
      language, 
    });

    return res.status(200).json({
      message: "Transcription and Translation successful",
      data: saved,
    });

  } catch (err) {
    console.error("Error during transcription and translation:", err);
 
    const errorMessage = err.response?.data || err.message || "An unknown error occurred.";
    return res.status(500).json({
      message: "Internal Server Error during AI processing.",
      error: errorMessage,
    });
  }
};


const summarizeAudio = async (req, res) => {
  try {
    const file = req.file;
    const {language} = req.body

    if(!req.user) return res.status(401).json({ message: "Unauthorized user!" });

    if (!file) {
      return res.status(400).json({ message: "Audio file is required." });
    }
    if(!language)  return res.status(400).json({ message: "Language is required." });

    const genAI = new GoogleGenerativeAI(process.env.Gemini_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Audio = file.buffer.toString("base64");

    const prompt = [
      { text: `Listen to the following audio and give a best summary: in ${language}.  Please respond ONLY in ${language}.` },
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64Audio,
        },
      },
    ];

    const result = await model.generateContent({
      contents: [{ parts: prompt }],
    });

    const summary =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!summary) {
      return res.status(502).json({ message: "Failed to summarize the audio." });
    }

    return res.status(200).json({
      message: "Summary generated successfully",
      summary,
    });
  } catch (err) {
    console.error("Summary error:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.response?.data || err.message,
    });
  }
};


const transcribeAudioToAudio = async (req, res) => {
  try {
    const { language } = req.body;
    const file = req.file;
    const user = req.user;

    if (!user) return res.status(401).json({ message: "Unauthorized user!" });
    if (!file) return res.status(400).json({ message: "Audio file is required." });
    if (!language) return res.status(400).json({ message: "Target language is required." });

    // --- Upload audio to Cloudinary ---
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    };
    const uploadResult = await streamUpload();
    const audioUrl = uploadResult.secure_url;

    // --- Gemini Transcription ---
    const genAI = new GoogleGenerativeAI(process.env.Gemini_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const base64Audio = file.buffer.toString("base64");

    const parts = [
    {
  text: "Transcribe the following audio accurately. Do not change the character names and character names should be indian, whether from the start or the end. Do not add conversation start indicators or any extra text in the script. Do not include newline characters, asterisks, commas, periods, question marks, or exclamation marks in the transcription. If the text contains two or more characters speaking, change the voice accordingly."
},

      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64Audio,
        },
      },
    ];

    console.log("Sending audio to Gemini for transcription...");
    const geminiSTTResponse = await model.generateContent({
      contents: [{ parts }],
    });

    let transcription = "";
    if (
      geminiSTTResponse.response?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      transcription =
        geminiSTTResponse.response.candidates[0].content.parts[0].text;
    }

    if (!transcription || typeof transcription !== "string") {
      return res
        .status(502)
        .json({ message: "Failed to get valid transcription from Gemini AI." });
    }

    console.log("Transcription:", transcription);

    // --- Translate using Gemini ---
    const translatedText = await translateToLanguage(transcription, language);
    console.log("Translated Text:", translatedText);

    // --- Generate TTS with gTTS ---
const fileName = `output-${Date.now()}.mp3`;
const publicDir = path.join(__dirname, "..", "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const audioPath = path.join(publicDir, fileName);
function cleanTextForTTS(text) {
  // Remove special characters *, \n, ., ,, ?, !
  return text.replace(/[\*\n\.,\?!]/g, '').trim();
}

const cleanedText = cleanTextForTTS(translatedText);
const tts = new gTTS(cleanedText, language);

await new Promise((resolve, reject) => {
  tts.save(audioPath, function (err) {
    if (err) {
      console.error("gTTS error:", err);
      return reject("Failed to generate audio using gTTS.");
    }
    console.log("Saved audio:", audioPath);
    resolve();
  });
});

    // --- Save to DB ---
    const saved = await Transcription.create({
      user: user._id,
      audioUrl,
      transcribedText: translatedText,
      language,
    });

    return res.status(200).json({
      message: "Audio-to-audio translation successful",
      transcription,
      translation: translatedText,
      translatedAudioUrl: `/public/${fileName}`,
      data: saved,
    });
  } catch (err) {
    console.error("Error in transcription flow:", err);
    return res.status(500).json({
      message: "Internal Server Error during audio processing",
      error: err.message || "Unknown error",
    });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const user = req.user;
    const history = await Transcription.find({ user: user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ data: history });
  } catch (err) {
    console.error("Error fetching user history:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { transcribeAudio, getUserHistory , summarizeAudio  , transcribeAudioToAudio};
