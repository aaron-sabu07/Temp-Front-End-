import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
import { translateText, mapLanguageCode } from '../utils/translationService';

/**
 * Custom hook that extends the i18next useTranslation hook with Sarvam API translation
 */
export const useSarvamTranslation = () => {
  const { t: i18nT, i18n } = useI18nTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});

  /**
   * Translate text directly using Sarvam API
   */
  const translateDirect = useCallback(async (text: string, targetLang?: string): Promise<string> => {
    if (!text.trim()) return text;
    
    const lang = targetLang || i18n.language;
    if (lang === 'en') return text;

    try {
      return await translateText(
        text,
        mapLanguageCode('en'),
        mapLanguageCode(lang)
      );
    } catch (error) {
      console.error('Direct translation error:', error);
      return text;
    }
  }, [i18n.language]);

  /**
   * Get translation for a key or text
   * - First tries to get from i18next
   * - If not found or same as key, tries dynamic translations
   * - Returns the original key/text if no translation found
   */
  const t = useCallback((key: string, options?: any): string => {
    // Get translation from i18next
    const i18nTranslation = i18nT(key, options);
    
    // If i18next has a valid translation (not the same as the key), use it
    if (i18nTranslation !== key) {
      return i18nTranslation as string;
    }
    
    // Otherwise, check if we have a dynamic translation
    return dynamicTranslations[key] || key;
  }, [i18nT, dynamicTranslations]);

  /**
   * Change language and translate dynamic content
   */
  const changeLanguage = useCallback(async (lang: string, textsToTranslate?: Record<string, string>) => {
    setIsTranslating(true);
    
    try {
      // Change language in i18next
      await i18n.changeLanguage(lang);
      
      // If switching to English, clear dynamic translations
      if (lang === 'en') {
        setDynamicTranslations({});
        return;
      }
      
      // If there are texts to translate dynamically
      if (textsToTranslate && Object.keys(textsToTranslate).length > 0) {
        const newTranslations: Record<string, string> = {};
        
        // Translate each text
        for (const [key, text] of Object.entries(textsToTranslate)) {
          const translatedText = await translateText(
            text,
            mapLanguageCode('en'),
            mapLanguageCode(lang)
          );
          
          newTranslations[key] = translatedText;
        }
        
        setDynamicTranslations(prev => ({
          ...prev,
          ...newTranslations
        }));
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [i18n]);

  /**
   * Add dynamic translations for texts not in i18next
   */
  const addDynamicTranslations = useCallback(async (texts: Record<string, string>) => {
    if (i18n.language === 'en') return;
    
    setIsTranslating(true);
    
    try {
      const newTranslations: Record<string, string> = {};
      
      for (const [key, text] of Object.entries(texts)) {
        const translatedText = await translateText(
          text,
          mapLanguageCode('en'),
          mapLanguageCode(i18n.language)
        );
        
        newTranslations[key] = translatedText;
      }
      
      setDynamicTranslations(prev => ({
        ...prev,
        ...newTranslations
      }));
    } catch (error) {
      console.error('Error adding dynamic translations:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [i18n.language]);

  return {
    t,
    i18n: {
      ...i18n,
      changeLanguage
    },
    isTranslating,
    translateDirect,
    addDynamicTranslations,
    dynamicTranslations
  };
};

export default useSarvamTranslation;
