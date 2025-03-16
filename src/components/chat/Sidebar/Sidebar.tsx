import React from 'react';
import SidebarHeader from './SidebarHeader';
import ChatHistory from './ChatHistory';
import SidebarFooter from './SidebarFooter';

interface SidebarProps {
  isSidebarOpen: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
  searchInputRef: React.RefObject<HTMLInputElement>;
  chatHistory: Array<{
    id: string;
    title: string;
    date: Date;
    active: boolean;
  }>;
  onNewChat: () => void;
  onToggleSidebar: () => void;
  onSelectChat: (chatId: string) => void;
  onToggleSearch: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  searchQuery,
  isSearchOpen,
  searchInputRef,
  chatHistory,
  onNewChat,
  onToggleSidebar,
  onSelectChat,
  onToggleSearch,
  onSearchChange,
}) => {
  return (
    <div className={`chatgpt-sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      <SidebarHeader
        isSidebarOpen={isSidebarOpen}
        onNewChat={onNewChat}
        onToggleSidebar={onToggleSidebar}
      />
      
      {isSidebarOpen && (
        <>
          <div className="sidebar-actions">
            <button 
              onClick={onToggleSearch}
              className="search-button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-md">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span>Search chats</span>
            </button>
          </div>

          <ChatHistory
            chatHistory={chatHistory}
            searchQuery={searchQuery}
            isSearchOpen={isSearchOpen}
            searchInputRef={searchInputRef}
            onSelectChat={onSelectChat}
            onToggleSearch={onToggleSearch}
            onSearchChange={onSearchChange}
          />

          <SidebarFooter />
        </>
      )}
    </div>
  );
};

export default Sidebar; 