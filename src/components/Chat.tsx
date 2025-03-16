import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Message, ChatState, LanguageOption } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { useSarvamTranslation } from '../components/TranslationProvider';

// Mock data for chat history
const MOCK_CHAT_HISTORY = [
  { id: '1', title: 'General Conversation', date: new Date(), active: true },
  { id: '2', title: 'Travel Planning', date: new Date(Date.now() - 86400000), active: false },
  { id: '3', title: 'Technical Support', date: new Date(Date.now() - 172800000), active: false },
];

const Chat = () => {
  const { i18n } = useTranslation();
  const { batchTranslate } = useSarvamTranslation();
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedLanguage: 'en',
  });
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState(MOCK_CHAT_HISTORY);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'od', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle window resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Focus search input when sidebar is opened
  useEffect(() => {
    if (isSidebarOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSidebarOpen]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isLanguageDialogOpen) {
        setIsLanguageDialogOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isLanguageDialogOpen]);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const newMessage: Message = {
      id: uuidv4(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: true,
    }));

    setInput('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        text: 'This is a sample response. Replace with actual API integration.',
        isUser: false,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiResponse],
        isLoading: false,
      }));
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLanguageMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to avoid triggering page-wide dropdown
    e.preventDefault(); // Prevent default behavior
    setIsLanguageDialogOpen(!isLanguageDialogOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const selectLanguage = async (code: string) => {
    setChatState((prev) => ({
      ...prev,
      selectedLanguage: code,
      isLoading: true // Show loading state while translating
    }));

    try {
      // First change the language in i18next
      await i18n.changeLanguage(code);

      // If we have chat messages, translate them
      if (chatState.messages.length > 0) {
        const messagesToTranslate = chatState.messages.map((message) => message.text);

        // Use batch translate for better performance
        const translatedTexts = await batchTranslate(messagesToTranslate);

        // Update messages with translated text
        const translatedMessages = chatState.messages.map((message, index) => ({
          ...message,
          text: translatedTexts[index] || message.text
        }));

        setChatState((prev) => ({
          ...prev,
          messages: translatedMessages,
          isLoading: false
        }));
      } else {
        setChatState((prev) => ({
          ...prev,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error translating content:', error);
      setChatState((prev) => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const selectLanguageAndClose = async (code: string) => {
    await selectLanguage(code);
    setIsLanguageDialogOpen(false);
  };

  const startNewChat = () => {
    // Create a new chat in history
    const newChatId = uuidv4();
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      date: new Date(),
      active: true
    };

    // Update chat history, setting the new chat as active
    setChatHistory((prev) =>
      prev.map((chat) => ({ ...chat, active: false })).concat([newChat])
    );

    // Clear messages
    setChatState((prev) => ({
      ...prev,
      messages: [],
      isLoading: false,
    }));

    // Close sidebar on mobile after selecting
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const selectChat = (chatId: string) => {
    // Update chat history, setting the selected chat as active
    setChatHistory((prev) =>
      prev.map((chat) => ({
        ...chat,
        active: chat.id === chatId,
      }))
    );

    // In a real application, you would load the chat messages for the selected chat here
    // For this demo, we'll just clear the messages
    setChatState((prev) => ({
      ...prev,
      messages: [],
      isLoading: false,
    }));

    // Close sidebar on mobile after selecting
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-resize textarea as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const getSelectedLanguage = () => {
    return languages.find((lang) => lang.code === chatState.selectedLanguage) || languages[0];
  };

  // Function to format date headers for chat history
  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`;
    }
  };

  // Group chat history by date
  const groupedChatHistory = chatHistory.reduce((groups, chat) => {
    const dateStr = formatDateHeader(chat.date);
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(chat);
    return groups;
  }, {} as Record<string, typeof chatHistory>);

  // Define action buttons
  const actionButtons = [
    {
      id: 'create-image',
      label: 'Create An Image',
      onClick: () => console.log('Create image clicked'),
      icon: null
    },
    {
      id: 'analyze-data',
      label: 'Analyze Data',
      onClick: () => console.log('Analyze data clicked'),
      icon: null
    },
    {
      id: 'more',
      label: 'More',
      onClick: () => console.log('More clicked'),
      icon: null
    }
  ];

  // Empty state elements
  const renderEmptyState = () => {
    return (
      <div className="welcome-container">
        <h1 className="title">Speak Any Language</h1>
        <p className="subtitle">Your AI assistant that speaks your language</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>100+ Languages</h3>
            <p>Communicate seamlessly in any language</p>
          </div>
          <div className="feature-card">
            <h3>File Support</h3>
            <p>Share and discuss documents in any language</p>
          </div>
          <div className="feature-card">
            <h3>Smart Responses</h3>
            <p>Get intelligent, context-aware responses</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-container">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
        {/* New Chat Button */}
        <button className="new-chat-button" onClick={startNewChat}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New chat
        </button>
        
        {/* Search Input */}
        <div className="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search chats" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            ref={searchInputRef}
          />
        </div>
        
        {/* Chat History */}
        <div className="chat-history">
          {Object.entries(groupedChatHistory).map(([dateStr, chats]) => (
            <div key={dateStr} className="date-group">
              <div className="date-header">{dateStr}</div>
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  className={`chat-item ${chat.active ? 'active' : ''}`}
                  onClick={() => selectChat(chat.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {chat.title}
                </button>
              ))}
            </div>
          ))}
        </div>
        
        {/* Connected Status */}
        <div className="connection-status">
          <div className="status-indicator connected"></div>
          Connected
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          {/* Sidebar Toggle Button */}
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {/* Language Selector */}
          <div className="language-selector">
            <button className="language-button" onClick={toggleLanguageMenu}>
              {getSelectedLanguage().flag} {getSelectedLanguage().nativeName}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {isLanguageDialogOpen && (
              <div className="language-dialog">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`language-option ${
                      lang.code === chatState.selectedLanguage ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectLanguageAndClose(lang.code);
                    }}
                  >
                    {lang.flag} {lang.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Dark Mode Toggle */}
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="chat-area">
          {chatState.messages.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="messages-container">
              {chatState.messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.isUser ? 'user-message' : 'ai-message'
                  }`}
                >
                  {!message.isUser && (
                    <div className="message-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                        <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                        <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                        <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                        <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                      </svg>
                    </div>
                  )}
                  <div className="message-content">{message.text}</div>
                </div>
              ))}
              {chatState.isLoading && (
                <div className="message ai-message">
                  <div className="message-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="4"></circle>
                      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                      <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                    </svg>
                  </div>
                  <div className="loading-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        {chatState.messages.length > 0 && (
          <div className="action-buttons">
            {actionButtons.map((button) => (
              <button
                key={button.id}
                className="action-button"
                onClick={button.onClick}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <button className="attach-button" onClick={triggerFileInput}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder="Imagine Something...✨"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              rows={1}
            />
            <button
              className="send-button"
              onClick={handleSend}
              disabled={!input.trim() && !selectedFile}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          
          {/* File Preview */}
          {selectedFile && (
            <div className="file-preview">
              <div className="file-info">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </div>
              <button className="remove-file" onClick={removeFile}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;