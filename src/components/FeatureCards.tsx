import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/FeatureCards.css';

const FeatureCards: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="feature-section">
      <div className="heading-container">
        <h1>{t('Speak Any Language')}</h1>
        <p>{t('Your AI assistant that speaks your language')}</p>
      </div>
      
      <div className="cards-container">
        <div className="card">
          <h3>{t('100+ Languages')}</h3>
          <p>{t('Communicate seamlessly in any language')}</p>
        </div>
        
        <div className="card">
          <h3>{t('File Support')}</h3>
          <p>{t('Share and discuss documents in any language')}</p>
        </div>
        
        <div className="card">
          <h3>{t('Smart Responses')}</h3>
          <p>{t('Get intelligent, context-aware responses')}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
