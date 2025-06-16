const fs = require('fs');
const pdfParse = require('pdf-parse');
const { fromPath } = require('pdf2pic');
const Tesseract = require('tesseract.js');

async function extractTextFromPDF(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

   
    if (data.text && data.text.trim().length > 30) {
      console.log(' Extracted text directly (pdf-parse)');
      return data.text;
    }

    
    console.log('Fallback to OCR: converting PDF to images');

    const convert = fromPath(filePath, {
      density: 150,
      saveFilename: 'ocr-image',
      savePath: './uploads/images',
      format: 'png',
      width: 1200,
      height: 1600
    });

    let fullText = '';
    for (let page = 1; page <= data.numpages; page++) {
      const image = await convert(page);
      const result = await Tesseract.recognize(
        image.path,
        'eng+hin', 
        { logger: m => console.log(m) }
      );
      fullText += '\n' + result.data.text;
    }

    return fullText.trim();
  } catch (error) {
    console.error(' Error extracting text from PDF:', error);
    throw error;
  }
}

module.exports = { extractTextFromPDF };
