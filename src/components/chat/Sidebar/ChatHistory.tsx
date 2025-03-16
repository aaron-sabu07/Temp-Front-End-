import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChatHistoryProps {
  chatHistory: Array<{
    id: string;
    title: string;
    date: Date;
    active: boolean;
  }>;
  searchQuery: string;
  isSearchOpen: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  onSelectChat: (chatId: string) => void;
  onToggleSearch: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  searchQuery,
  isSearchOpen,
  searchInputRef,
  onSelectChat,
  onToggleSearch,
  onSearchChange,
}) => {
  const { t } = useTranslation();

  // Group chats by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  const groupedChats = chatHistory.reduce((groups, chat) => {
    const chatDate = chat.date.toDateString();
    let groupName = '';
    
    if (chatDate === today) {
      groupName = t('dates.today');
    } else if (chatDate === yesterday) {
      groupName = t('dates.yesterday');
    } else {
      groupName = chat.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    
    groups[groupName].push(chat);
    return groups;
  }, {} as Record<string, typeof chatHistory>);

  return (
    <div className="chat-history">
      {isSearchOpen && (
        <div className="search-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('chat.searchChats')}
            value={searchQuery}
            onChange={onSearchChange}
            className="search-input"
          />
          <button 
            onClick={onToggleSearch}
            className="search-close-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
      )}
      
      {Object.entries(groupedChats).map(([date, chats]) => (
        <div key={date} className="chat-group">
          <h3 className="chat-date-heading">{date}</h3>
          <div className="chat-list">
            {chats.map(chat => (
              <button
                key={chat.id}
                className={`chat-item ${chat.active ? 'active' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md">
                  <path d="M8.5 12h7M8.5 16h7M8.5 8h7M5 22V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="chat-title">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory; 