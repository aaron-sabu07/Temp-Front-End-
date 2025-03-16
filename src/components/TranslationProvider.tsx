import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { translateText, mapLanguageCode } from '../utils/translationService';

// Context for storing translated texts
interface TranslationContextType {
  translatedTexts: Record<string, string>;
  isTranslating: boolean;
  translateText: (text: string, forceUpdate?: boolean) => Promise<string>;
  batchTranslate: (texts: string[]) => Promise<string[]>;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

// Hook to use the translation context
export const useSarvamTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useSarvamTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { i18n } = useI18nTranslation();
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Function to translate text and store in state
  const translateTextAndStore = async (text: string, forceUpdate = false): Promise<string> => {
    if (!text.trim()) return text;
    
    // If we're using English, just return the original text
    if (i18n.language === 'en') return text;
    
    // If we already have a translation and don't need to force update, return it
    const cacheKey = `${text}_${i18n.language}`;
    if (!forceUpdate && translatedTexts[cacheKey]) {
      return translatedTexts[cacheKey];
    }
    
    try {
      setIsTranslating(true);
      const translated = await translateText(
        text,
        mapLanguageCode('en'),
        mapLanguageCode(i18n.language)
      );
      
      // Store the translation
      setTranslatedTexts(prev => ({
        ...prev,
        [cacheKey]: translated
      }));
      
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  // Function to batch translate multiple texts
  const batchTranslateTexts = async (texts: string[]): Promise<string[]> => {
    if (i18n.language === 'en' || texts.length === 0) {
      return texts;
    }

    setIsTranslating(true);
    try {
      const results: string[] = [];
      
      for (const text of texts) {
        if (!text.trim()) {
          results.push(text);
          continue;
        }
        
        const cacheKey = `${text}_${i18n.language}`;
        
        // Check cache first
        if (translatedTexts[cacheKey]) {
          results.push(translatedTexts[cacheKey]);
        } else {
          // Translate and cache
          const translated = await translateText(
            text,
            mapLanguageCode('en'),
            mapLanguageCode(i18n.language)
          );
          
          // Update cache
          setTranslatedTexts(prev => ({
            ...prev,
            [cacheKey]: translated
          }));
          
          results.push(translated);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Return original texts on error
    } finally {
      setIsTranslating(false);
    }
  };

  // Clear translations when language changes
  useEffect(() => {
    if (i18n.language === 'en') {
      setTranslatedTexts({});
    }
  }, [i18n.language]);

  // The context value
  const value: TranslationContextType = {
    translatedTexts,
    isTranslating,
    translateText: translateTextAndStore,
    batchTranslate: batchTranslateTexts
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationProvider;
