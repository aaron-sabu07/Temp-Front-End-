import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onKeyPress,
  onSend,
}) => {
  const { t } = useTranslation();

  return (
    <div className="chat-input-area">
      <div className="chat-container">
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <div className="chat-bot">
              <textarea
                id="chat_bot"
                name="chat_bot"
                placeholder={t('chat.placeholder')}
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyPress}
                className="chat-textarea"
                style={{ height: '40px' }}
              />
            </div>
            <div className="chat-options">
              <div className="chat-buttons">
                <button className="chat-button" title={t('chat.attachFile')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8"
                    />
                  </svg>
                </button>
                <button className="chat-button" title={t('chat.addImage')}>
                  <svg
                    viewBox="0 0 24 24"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                    />
                  </svg>
                </button>
              </div>
              <button 
                className="send-button" 
                onClick={onSend} 
                disabled={isLoading || !input.trim()}
                title={t('chat.send')}
              >
                <div className="send-button-inner">
                  <svg viewBox="0 0 512 512" width="100%" height="100%">
                    <path
                      fill="currentColor"
                      d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="tag-container">
          <span className="tag">Create An Image</span>
          <span className="tag">Analyse Data</span>
          <span className="tag">More</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 