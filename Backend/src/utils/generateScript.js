const { GoogleGenerativeAI } = require('@google/generative-ai');
const Gemini_KEY = process.env.Gemini_KEY;

const genAI = new GoogleGenerativeAI(Gemini_KEY);

function buildPrompt(text, languageCode) {
  return `
You are a professional podcast script writer. Write the podcast in the language code: "${languageCode}".


Task:
Generate a full, detailed podcast script from the following document.

Use ONLY TWO speakers:
- Host: welcomes the audience, introduces topics, asks relevant and insightful questions
- Expert: explains, elaborates, gives examples, and breaks down key concepts

Important Instructions:
- The script should be in ${languageCode}, but **do not translate technical terms** like "AGI", "AI", "machine learning", "GPT", etc.
- Do **not** translate author names, model names, acronyms, or citations. Keep them in their original form.
- Avoid unnecessary over-translation of scientific terms.

Podcast Style Guidelines:
- Translate the text to the given language code (${languageCode}) while keeping technical terms (e.g. AGI, AI, GPT) in English.
- Make the conversation natural, friendly, and informative.
- Keep each exchange short but clear — like a real podcast dialogue.
- Avoid or simplify technical jargon unless it’s explained clearly.
- Build the podcast in a way that helps listeners understand the document’s content step-by-step.
- Cover all major sections and insights of the document.
- Make it engaging with a beginning, middle, and end (including a brief conclusion).

Script Format:
Host: [Intro or question]
Expert: [Response or explanation]

Document:
"""
${text}
"""
`;
}




async function generatePodcastScript(text , languageCode) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = buildPrompt(text, languageCode);
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const script = response.text();
  //console.log(script);
  
  return script;
}

module.exports = generatePodcastScript;
