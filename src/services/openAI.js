import OpenAI from 'openai';
import { OPENAI_API_KEY_GPT_4, OPENAI_MODEL } from '../../constants.js'

// Initialize OpenAI API configuration
const client = new OpenAI({apiKey: OPENAI_API_KEY_GPT_4});

export async function translateToTargetLanguage(jsonContent, targetLanguage) {
    const prompt = `Translate the following JSON object to the target locale: "${targetLanguage}". 
    Please provide the output as a JSON object with the same keys, but with values translated to the target locale. 
    Here is the JSON object:

    \`\`\`json
    ${JSON.stringify(jsonContent, null, 2)}
    \`\`\``;

    try {
      const completion = await client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const translatedText = completion.choices[0].message.content.trim();
      console.log(translatedText, 'translatedText.....')
      const translatedJson = extractJsonFromString(translatedText)
      console.log(translatedJson, 'translatedJson.....')
      return translatedJson;
    } catch (error) {
      console.error('Error during translation:', error);
      throw new Error('Translation failed');
    }
  }

  function extractJsonFromString(responseText) {
    const jsonStringMatch = responseText.match(/```json\n([\s\S]*?)\n```/);

    if (jsonStringMatch) {
      try {
        // Parse the JSON string
        const jsonObject = JSON.parse(jsonStringMatch[1]);
        return jsonObject;
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        return null;
      }
    } else {
      console.error('No JSON found in the response text');
      return null;
    }
  }
  