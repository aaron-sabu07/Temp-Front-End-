import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { translateText, mapLanguageCode } from '../utils/translationService';

interface TranslationContextType {
  translate: (text: string) => Promise<string>;
  translateBatch: (texts: string[]) => Promise<string[]>;
  isTranslating: boolean;
  currentLanguage: string;
  setLanguage: (langCode: string) => Promise<void>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { i18n } = useI18nTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Update current language when i18n language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Function to translate a single text string
  const translate = async (text: string): Promise<string> => {
    if (!text || currentLanguage === 'en') {
      return text;
    }

    try {
      const translatedText = await translateText(
        text,
        mapLanguageCode('en'),
        mapLanguageCode(currentLanguage)
      );
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  // Function to translate multiple text strings at once
  const translateBatch = async (texts: string[]): Promise<string[]> => {
    if (!texts.length || currentLanguage === 'en') {
      return texts;
    }

    try {
      const translatedTexts = await Promise.all(
        texts.map(text => translate(text))
      );
      return translatedTexts;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts;
    }
  };

  // Function to change the language
  const setLanguage = async (langCode: string): Promise<void> => {
    setIsTranslating(true);
    try {
      await i18n.changeLanguage(langCode);
      setCurrentLanguage(langCode);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const value = {
    translate,
    translateBatch,
    isTranslating,
    currentLanguage,
    setLanguage
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export default TranslationContext;
