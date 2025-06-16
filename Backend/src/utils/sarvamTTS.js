const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const speakerVoiceMap = {
  Host: "anushka",
  Expert: "karun"
};

function chunkText(text, maxLen = 1500) {
  const chunks = [];
  let current = "";
  const words = text.split(/\s+/);

  for (const word of words) {
    if ((current + " " + word).length > maxLen) {
      chunks.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}

async function generateAudioForScript(scriptLines, languageCode) {
  const results = [];

  // 🛡️ Ensure directory exists
  const audioDir = path.join(__dirname, "../public/audio");
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
    console.log(" Created /public/audio directory");
  }

  for (const line of scriptLines) {
    const { id, speaker, text } = line;
    const voice = speakerVoiceMap[speaker] || "anushka";

    const cleanText = text.replace(/\*\*/g, "").trim();
    const chunks = chunkText(cleanText, 1500);
    const audioUrls = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const res = await axios.post(
          "https://api.sarvam.ai/text-to-speech",
          {
            text: chunk,
            target_language_code: languageCode,
            speaker: voice,
            model: "bulbul:v2"
          },
          {
            headers: {
              "api-subscription-key": process.env.Sarvam_Subcription_Key,
              "Content-Type": "application/json"
            }
          }
        );

        const base64 = res?.data?.audios?.[0];
        if (!base64) {
          console.error(` Empty audio response for line ${id} chunk ${i}`);
          continue;
        }

        const buffer = Buffer.from(base64, "base64");
        const filename = `line-${id}-${i}-${uuidv4().slice(0, 6)}.mp3`;
        const filePath = path.join(audioDir, filename);

        fs.writeFileSync(filePath, buffer);
        console.log(` Saved: ${filePath}`);


        audioUrls.push(`/audio/${filename}`);

      } catch (err) {
        console.error(` TTS failed for line ${id} (${speaker}) chunk ${i}:`, err.response?.data || err.message);
      }
    }

    results.push({
      id,
      speaker,
      text: cleanText,
      voice,
      language: languageCode,
      audioUrls
    });
  }

  return results;
}

module.exports = generateAudioForScript;
