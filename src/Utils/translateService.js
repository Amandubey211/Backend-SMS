// src/translateService.js
import axios from "axios";

const MY_MEMORY_API_URL = "https://api.mymemory.translated.net/get";

async function translateText(text, targetLanguage) {
  try {
    const response = await axios.get(MY_MEMORY_API_URL, {
      params: {
        q: text, // The text to be translated
        langpair: `en|${targetLanguage}`, // Language pair (e.g., English to Spanish)
      },
    });

    return response.data.responseData.translatedText;
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    return text; // Return original text if translation fails
  }
}

export { translateText };
