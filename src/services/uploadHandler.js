import { promises as fs } from 'fs';
import OpenAI from 'openai';

// Initialize OpenAI API configuration
const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export async function handleFileUpload(req, res) {
  try {
    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath, 'utf8');

    const keys = extractKeysFromFile(fileContent);

    const translatedStrings = await translateKeysToChinese(keys);

    res.json({ translatedStrings });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during the translation process.');
  }
}

// Helper function to extract keys from file content (example for JSON)
function extractKeysFromFile(content) {
  const data = JSON.parse(content);
  return Object.keys(data);
}

// Helper function to translate keys using OpenAI API
async function translateKeysToChinese(keys) {
  const translations = {};

  for (const key of keys) {
    const completion = await client.chat.completions.create({
      model: process.env['OPENAI_MODEL'],
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Translate the following to Chinese: "${key}"` }
      ]
    });

    const translatedText = completion.data.choices[0].message.content.trim();
    translations[key] = translatedText;
  }

  return translations;
}
