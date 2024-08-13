import { promises as fs } from 'fs';
import { translateToTargetLanguage } from './services/openAI.js'

export async function handleFileUpload(req, res) {
  try {
    const filePath = req.file.path;
    const targetLanguage = req.body.target_language
    const fileContent = await fs.readFile(filePath, 'utf8');
    const jsonContent = JSON.parse(fileContent)

    const translatedStrings = await translateToTargetLanguage(jsonContent, targetLanguage);

    res.json({ translatedStrings });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during the translation process.');
  }
}
