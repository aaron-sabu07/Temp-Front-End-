import React from 'react';
import { useTranslation } from 'react-i18next';

const SidebarFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="sidebar-footer">
      <div className="flex items-center gap-2 text-accent-light dark:text-accent-dark text-sm">
        <div className="w-2 h-2 rounded-full bg-highlight-light dark:bg-highlight-dark"></div>
        <span>{t('chat.connected')}</span>
      </div>
    </div>
  );
};

export default SidebarFooter; 