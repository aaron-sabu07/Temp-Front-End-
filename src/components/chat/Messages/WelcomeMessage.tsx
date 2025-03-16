import React from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeMessage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="welcome-message">
      <div className="welcome-header">
        <h1 className="title-shadow">LoanWise</h1>
        <p className="subtitle">Loans, simplified in any language</p>
      </div>
      <div className="feature-grid">
        <div className="feature-card">
          <h3>Check Eligibility</h3>
          <p>Instantly see which loans you qualify for</p>
        </div>
        <div className="feature-card">
          <h3>Guided Applications</h3>
          <p>Step-by-step help with loan forms</p>
        </div>
        <div className="feature-card">
          <h3>Financial Tips</h3>
          <p>Strategies to manage and grow finances</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage; 