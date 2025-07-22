function parseScriptToJSON(scriptText) {
  const lines = scriptText.split('\n').map(l => l.trim()).filter(Boolean);
  const parsed = [];

  let id = 1;

  for (const line of lines) {
    const match = line.match(/^\**\*?(Host|Expert|होस्ट|विशेषज्ञ)\**\*?\s*[:\-–—]\s*(.+)$/i);

    if (match) {
      const speaker = match[1].trim();
      const text = match[2].trim();

      if (text.length > 0) {
        parsed.push({ id: id++, speaker, text });
      }
    }
  }

 // console.log("Parsed Script Lines:", parsed);
  return parsed;
}


module.exports = parseScriptToJSON;
