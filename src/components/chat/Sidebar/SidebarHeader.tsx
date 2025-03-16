import React from 'react';
import { useTranslation } from 'react-i18next';

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
  onNewChat: () => void;
  onToggleSidebar: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isSidebarOpen,
  onNewChat,
  onToggleSidebar,
}) => {
  const { t } = useTranslation();

  return (
    <div className="sidebar-header">
      <button 
        onClick={onNewChat}
        className="new-chat-button"
        title={t('chat.newChat')}
      >
        {isSidebarOpen ? (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md">
              <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span>{t('chat.newChat')}</span>
          </>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md">
            <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        )}
      </button>
      
      <button 
        onClick={onToggleSidebar}
        className="toggle-sidebar-button"
        title={isSidebarOpen ? t('chat.closeSidebar') : t('chat.openSidebar')}
      >
        {isSidebarOpen ? (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span>{t('chat.closeSidebar')}</span>
          </>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default SidebarHeader; 