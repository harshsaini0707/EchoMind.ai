const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.Gemini_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const translateToLanguage = async (text, languageCode) => {
  try {
 const prompt = `
You are an expert translator and storyteller.

Translate the following transcription into ${languageCode} in a natural, warm, and emotional way. Make it sound like a real conversation, full of feelings such as excitement, nervousness, happiness, or surprise, depending on the context.

 Important instructions:
- If name us mention than that is good but if name is not mention take any indian name
- Output the result only.
- Mention the name is each paragraph of persons who are taken part in conversation and don't add emotions in result .
- Do NOT translate any names of people mentioned (e.g., John, Amy, Harsh). Keep all names exactly as they are.
- Use casual, natural language that a person would actually say.
- Add subtle emotional expressions or pauses where appropriate to make the text feel alive and engaging.
- Keep the meaning accurate but enhance the emotional and conversational tone.

Here is the original transcription:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translated = response.text().trim();
    return translated;
  } catch (err) {
    console.error("Gemini translation error:", err);
    return text; // fallback if Gemini fails
  }
};

module.exports = translateToLanguage;
