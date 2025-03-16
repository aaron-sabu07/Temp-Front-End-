import React, { useState, useEffect } from 'react';
import { translateText } from '../utils/translationService';
import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Component that dynamically translates text using the Sarvam API
 */
const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  sourceLanguage = 'en-IN',
  targetLanguage,
  className,
  as: Component = 'span'
}) => {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get the current language from i18next if not provided
    const currentTargetLanguage = targetLanguage || `${i18n.language}-IN`;
    
    // If source and target languages are the same, no need to translate
    if (sourceLanguage === currentTargetLanguage || !text.trim() || i18n.language === 'en') {
      setTranslatedText(text);
      return;
    }

    const translateContent = async () => {
      setIsLoading(true);
      try {
        const result = await translateText(text, sourceLanguage, currentTargetLanguage);
        setTranslatedText(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text); // Fallback to original text on error
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [text, sourceLanguage, targetLanguage, i18n.language]);

  return (
    <Component className={`${className || ''} ${isLoading ? 'opacity-70' : ''}`}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;
