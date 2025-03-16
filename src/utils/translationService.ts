import axios from 'axios';

// Define the environment variable for the API key
// This should be set in a .env file or environment variables
const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || '';

// Define the API endpoint
const SARVAM_API_ENDPOINT = 'https://api.sarvam.ai/translate';

// Interface for translation request
interface TranslationRequest {
  input: string;
  source_language_code: string;
  target_language_code: string;
  enable_preprocessing?: boolean;
  mode?: 'formal' | 'modern-colloquial' | 'classic-colloquial' | 'code-mixed';
  speaker_gender?: 'Male' | 'Female';
  output_script?: 'roman' | 'fully-native' | 'spoken-form-in-native' | null;
  numerals_format?: 'international' | 'native';
}

// Interface for translation response
interface TranslationResponse {
  request_id: string;
  translated_text: string;
}

/**
 * Translates text using the Sarvam AI Translation API
 * @param text The text to translate
 * @param sourceLanguage The source language code (e.g., 'en-IN')
 * @param targetLanguage The target language code (e.g., 'hi-IN')
 * @returns The translated text
 */
export const translateText = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  // If source and target languages are the same, return the original text
  if (sourceLanguage === targetLanguage) {
    return text;
  }

  // If text is empty, return empty string
  if (!text.trim()) {
    return text;
  }

  try {
    // Check if API key is available
    if (!SARVAM_API_KEY) {
      console.error('Sarvam API key is not set. Please set the VITE_SARVAM_API_KEY environment variable.');
      throw new Error('Sarvam API key is missing. Translation cannot proceed.');
    }

    // Make the API call
    const response = await axios.post<TranslationResponse>(
      SARVAM_API_ENDPOINT,
      {
        input: text,
        source_language_code: sourceLanguage,
        target_language_code: targetLanguage,
        enable_preprocessing: true,
        mode: 'formal'
      } as TranslationRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_API_KEY
        }
      }
    );

    // Validate response data
    if (!response.data || !response.data.translated_text) {
      console.error('Invalid response from Sarvam API:', response.data);
      throw new Error('Invalid response from translation API');
    }

    // Return the translated text
    return response.data.translated_text;
  } catch (error: any) {
    // Enhanced error logging with more details
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Translation API error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Translation API no response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Translation error:', error.message);
    }
    
    // Always return the original text on error to maintain UI stability
    return text;
  }
};

/**
 * Batch translate multiple texts at once
 * @param texts Array of texts to translate
 * @param sourceLanguage The source language code
 * @param targetLanguage The target language code
 * @returns Array of translated texts
 */
export const batchTranslate = async (
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<string[]> => {
  // If source and target languages are the same, return the original texts
  if (sourceLanguage === targetLanguage) {
    return texts;
  }

  try {
    // Process translations in batches to avoid overwhelming the API
    const batchSize = 10;
    const results: string[] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const promises = batch.map(text => 
        translateText(text, sourceLanguage, targetLanguage)
      );
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }

    return results;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Return original texts on error
  }
};

/**
 * Map language codes from i18next format to Sarvam API format
 * @param code Language code in i18next format (e.g., 'en', 'hi')
 * @returns Language code in Sarvam API format (e.g., 'en-IN', 'hi-IN')
 */
export const mapLanguageCode = (code: string): string => {
  const languageMap: Record<string, string> = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'mr': 'mr-IN',
    'od': 'od-IN', // Odia is represented as 'od-IN' in Sarvam API
    'pa': 'pa-IN',
    'ta': 'ta-IN',
    'te': 'te-IN'
  };

  return languageMap[code] || 'en-IN'; // Default to English if code not found
};
