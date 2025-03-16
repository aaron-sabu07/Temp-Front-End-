import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { translateText, mapLanguageCode } from '../utils/translationService';

/**
 * Custom hook that extends the i18next useTranslation hook with Sarvam API translation
 * @returns Enhanced translation functions and state
 */
export const useTranslation = () => {
  // Get the base i18next translation functions
  const { t: baseT, i18n } = useI18nTranslation();
  
  // State to store translations
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Enhanced translate function that uses Sarvam API when needed
  const t = useCallback((key: string, options?: any) => {
    // First, get the translation from i18next
    const baseTranslation = baseT(key, options);
    
    // If we have a cached Sarvam translation for this key, use it
    if (translations[key]) {
      return translations[key];
    }
    
    // Otherwise, return the base translation
    return baseTranslation;
  }, [baseT, translations]);

  // Function to change language and translate all text
  const changeLanguage = useCallback(async (langCode: string) => {
    // First, change the language in i18next
    await i18n.changeLanguage(langCode);
    
    // If the language is English, we don't need to translate
    if (langCode === 'en') {
      setTranslations({});
      return;
    }
    
    // Start translating
    setIsTranslating(true);
    
    try {
      // Get all translation keys
      const keys = Object.keys(i18n.getDataByLanguage('en')?.translation || {});
      
      // Create a new translations object
      const newTranslations: Record<string, string> = {};
      
      // Translate each key
      for (const key of keys) {
        const baseTranslation = baseT(key, { lng: 'en' });
        
        // Skip empty translations
        if (!baseTranslation || baseTranslation === key) {
          continue;
        }
        
        // Translate the text
        const translatedText = await translateText(
          baseTranslation,
          mapLanguageCode('en'),
          mapLanguageCode(langCode)
        );
        
        // Store the translation
        newTranslations[key] = translatedText;
      }
      
      // Update the translations state
      setTranslations(newTranslations);
    } catch (error) {
      console.error('Error translating UI:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [baseT, i18n]);

  // When the language changes, translate all text
  useEffect(() => {
    const currentLang = i18n.language;
    if (currentLang && currentLang !== 'en') {
      changeLanguage(currentLang);
    }
  }, [i18n.language, changeLanguage]);

  return {
    t,
    i18n: {
      ...i18n,
      changeLanguage
    },
    isTranslating
  };
};

export default useTranslation;
