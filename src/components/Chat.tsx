import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Message, ChatState, LanguageOption } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { useSarvamTranslation } from '../components/TranslationProvider';
import FeatureCards from './FeatureCards';

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
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioMessages, setAudioMessages] = useState<{id: string, blob: Blob}[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
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
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
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

  const startRecording = async () => {
    // Don't allow recording if text is already entered
    if (input.trim()) {
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setIsRecording(false);
        
        // Stop all tracks of the stream
        const tracks = mediaRecorderRef.current?.stream?.getTracks() || [];
        tracks.forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access the microphone. Please check your permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };
  
  const removeAudio = () => {
    setAudioBlob(null);
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile && !audioBlob) return;

    let messageContent = input;
    setInput('');

    // Create new user message
    const newMessage: Message = {
      id: uuidv4(),
      text: messageContent,
      isUser: true,
      timestamp: new Date(),
    };

    // If there's audio, add it to audio messages collection
    if (audioBlob) {
      const audioId = uuidv4();
      setAudioMessages(prev => [...prev, {id: audioId, blob: audioBlob}]);
      // Add an audio marker to the message text
      newMessage.text = `${messageContent} [AUDIO:${audioId}]`;
      setAudioBlob(null);
    }

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      isLoading: true,
    }));

    // Simulate AI response
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
        <FeatureCards />
      </div>
    );
  };

  // Format seconds to a time string (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
  };

  const renderMessage = (message: Message) => {
    // Check if message contains audio marker and extract the ID
    const audioRegex = /\[AUDIO:([^\]]+)\]/;
    const audioMatch = message.text.match(audioRegex);
    
    // Text content without audio marker
    const cleanText = audioMatch ? message.text.replace(audioRegex, '').trim() : message.text;
    
    return (
      <div
        key={message.id}
        className={`message ${message.isUser ? 'user' : 'ai'}`}
        id={`message-${message.id}`}
      >
        <div className="message-bubble">
          {cleanText && <div className="message-text">{cleanText}</div>}
          
          {audioMatch && (
            <div className="message-audio">
              <AudioPlayer audioId={audioMatch[1]} />
            </div>
          )}
          
          <div className="message-timestamp">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const AudioPlayer = ({ audioId }: { audioId: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioFile = audioMessages.find(am => am.id === audioId);
    
    useEffect(() => {
      if (!audioFile) return;
      
      // Create object URL for the audio blob
      const audioUrl = URL.createObjectURL(audioFile.blob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.addEventListener('loadedmetadata', () => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        });
        
        // Update current time during playback
        audioRef.current.addEventListener('timeupdate', () => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        });
        
        // Reset playing state when audio ends
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
      
      // Clean up URL object on unmount
      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }, [audioFile]);
    
    const togglePlay = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
    
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (audioRef.current && duration > 0) {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audioRef.current.currentTime = pos * duration;
      }
    };
    
    if (!audioFile) return <div>Audio not found</div>;
    
    return (
      <div className="audio-controls">
        <audio ref={audioRef} style={{ display: 'none' }} />
        <button className="audio-play-button" onClick={togglePlay} aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        <div className="audio-progress" onClick={handleProgressClick}>
          <div 
            className="audio-progress-filled" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="audio-time">
          {formatTime(Math.floor(currentTime))}/{formatTime(Math.floor(duration))}
        </div>
      </div>
    );
  };

  return (
    <div className={`chat-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
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
            <line x1="3" y1="18" x2="21" y2="18"></line>
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
      <div className={`main-content ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
        {/* Top Bar */}
        <div className="top-bar">
          {/* Sidebar Toggle Button */}
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {/* Language Selector */}
          <div className="language-selector">
            <button className="language-button" onClick={toggleLanguageMenu}>
              {getSelectedLanguage().nativeName}
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
                    <span className="native-name">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Dark Mode Toggle */}
          <button className="dark-mode-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="chat-area">
          {chatState.messages.length === 0 ? (
            renderEmptyState()
          ) : (
            <div className="messages-container">
              {chatState.messages.map((message) => (
                renderMessage(message)
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
          
          {/* Audio Recording Modal */}
          {isRecording && (
            <div className="recording-modal">
              <div className="recording-status">
                {isPaused ? 'Recording Paused' : 'Recording...'}
              </div>
              <div className="recording-wave">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ 
                    animationPlayState: isPaused ? 'paused' : 'running',
                    height: isPaused ? '10px' : undefined
                  }}></div>
                ))}
              </div>
              <div className="recording-time">
                {formatTime(recordingTime)}
              </div>
              <div className="recording-controls">
                <button 
                  className="recording-button" 
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
                >
                  {isPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  )}
                </button>
                <button 
                  className="recording-button" 
                  onClick={stopRecording}
                  aria-label="Stop recording"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
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
          <div className="input-area">
            <div className="input-wrapper">
              <button className="attach-button" onClick={triggerFileInput}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              <button 
                className={`mic-button ${isRecording ? 'recording' : ''}`} 
                onClick={isRecording ? stopRecording : startRecording}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                disabled={input.trim().length > 0} // Disable microphone if text is entered
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
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
                disabled={isRecording}
              />
              <button
                className="send-button"
                onClick={handleSend}
                disabled={!input.trim() && !selectedFile && !audioBlob}
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
            
            {/* Audio Preview */}
            {audioBlob && (
              <div className="audio-preview">
                <button className="audio-play-button" onClick={() => {
                  const audio = document.getElementById('preview-audio') as HTMLAudioElement;
                  if (audio) {
                    if (audio.paused) {
                      audio.play();
                    } else {
                      audio.pause();
                    }
                  }
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
                <div className="audio-controls">
                  <audio id="preview-audio" controls style={{ width: '100%' }} src={URL.createObjectURL(audioBlob)}></audio>
                </div>
                <button className="audio-close-button" onClick={removeAudio}>
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
    </div>
  );
};

export default Chat;