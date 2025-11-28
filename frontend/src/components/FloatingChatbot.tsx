import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotService } from '../services/api';
import { ChatMessage } from '../types';
import { useChatbot } from '../contexts/ChatbotContext';
import { useAuth } from '../contexts/AuthContext';

const FloatingChatbot: React.FC = () => {
  const { isOpen: contextIsOpen, openChatbot, closeChatbot } = useChatbot();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(contextIsOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasLoadedHistory = useRef(false);

  // Load chat history when opened for the first time
  useEffect(() => {
    if (isOpen && !isMinimized && !hasLoadedHistory.current && isAuthenticated) {
      const loadHistory = async () => {
        try {
          setLoadingHistory(true);
          const history = await chatbotService.getChatHistory();
          setMessages(history);
          hasLoadedHistory.current = true;
        } catch (err: any) {
          console.error('Chatbot load history error:', {
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            message: err.message,
            code: err.code
          });
          
          if (err.response?.status === 403 || err.response?.status === 401) {
            setError('Vui lòng đăng nhập để sử dụng chatbot');
          } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
            setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
          } else {
            setError('Không thể tải lịch sử chat');
          }
        } finally {
          setLoadingHistory(false);
        }
      };

      loadHistory();
    }
  }, [isOpen, isMinimized, isAuthenticated]);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để sử dụng chatbot');
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Add user message to UI immediately
    const tempUserMessage: ChatMessage = {
      id: Date.now(),
      messageContent: userMessage,
      sender: 'USER',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    setLoading(true);

    try {
      const response = await chatbotService.sendMessage({ userMessage });
      
      // Add bot response
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        messageContent: response.botReply,
        sender: 'BOT',
        timestamp: new Date().toISOString()
      };
      const actualUserMessage: ChatMessage = {
        id: tempUserMessage.id,
        messageContent: userMessage,
        sender: 'USER',
        timestamp: new Date().toISOString()
      };
      
      // Replace temp message with actual messages from server
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMessage.id);
        return [...withoutTemp, actualUserMessage, botMessage];
      });
    } catch (err: any) {
      // Parse error message from backend
      let errorMessage = 'Không thể gửi tin nhắn. Vui lòng thử lại.';
      
      console.error('Chatbot send message error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        code: err.code
      });
      
      if (err.response?.status === 403 || err.response?.status === 401) {
        errorMessage = 'Vui lòng đăng nhập để sử dụng chatbot';
      } else if (err.response?.status === 500) {
        // Backend trả về lỗi 500 - có thể là lỗi từ Gemini API
        if (err.response?.data?.botReply) {
          errorMessage = err.response.data.botReply;
        } else {
          errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
        }
      } else if (err.response?.data?.botReply) {
        // Backend trả về message lỗi chi tiết
        errorMessage = err.response.data.botReply;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      }
      
      // Add error as bot message để hiển thị trong chat
      const errorMessageObj: ChatMessage = {
        id: Date.now() + 1,
        messageContent: errorMessage,
        sender: 'BOT',
        timestamp: new Date().toISOString()
      };
      
      // Replace temp message with actual user message and error
      setMessages(prev => {
        const withoutTemp = prev.filter(m => m.id !== tempUserMessage.id);
        // Add actual user message
        const actualUserMessage: ChatMessage = {
          id: tempUserMessage.id,
          messageContent: userMessage,
          sender: 'USER',
          timestamp: new Date().toISOString()
        };
        return [...withoutTemp, actualUserMessage, errorMessageObj];
      });
      
      setError('');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Sync với context
  useEffect(() => {
    setIsOpen(contextIsOpen);
    if (!contextIsOpen) {
      setIsMinimized(false);
      setIsMaximized(false);
    }
  }, [contextIsOpen]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      openChatbot();
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    closeChatbot();
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Button - Only visible when closed (not when minimized) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-[70] w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
            aria-label="Mở chatbot"
          >
            <motion.div
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </motion.div>
            {/* Notification badge if there are unread messages */}
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                {messages.length > 9 ? '9+' : messages.length}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: isMinimized ? 0.3 : 1, 
              y: isMinimized ? 200 : 0,
              height: isMinimized ? 'auto' : isMaximized ? 'calc(100vh - 2rem)' : '600px',
              width: isMinimized ? 'auto' : isMaximized ? 'calc(100vw - 2rem)' : '400px',
              x: isMaximized ? 0 : undefined,
              bottom: isMaximized ? '1rem' : undefined,
              right: isMaximized ? '1rem' : undefined,
              left: isMaximized ? '1rem' : undefined,
              top: isMaximized ? '1rem' : undefined
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className={`fixed ${isMaximized ? 'inset-4' : 'bottom-6 right-6'} z-[70] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${
              isMinimized ? 'w-16 h-16' : isMaximized ? 'w-auto h-auto' : 'w-[400px] h-[600px]'
            }`}
            style={isMaximized ? { maxHeight: 'calc(100vh - 2rem)', maxWidth: 'calc(100vw - 2rem)' } : { maxHeight: 'calc(100vh - 3rem)' }}
          >
            {!isMinimized ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">ELS-Bot</h3>
                      <p className="text-xs text-blue-100">Trợ lý AI học tiếng Anh</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                      title={isMaximized ? "Thu nhỏ" : "Mở rộng"}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMaximized ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                      title="Thu nhỏ"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <button
                      onClick={closeChat}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                      title="Đóng"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {loadingHistory ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-sm text-slate-600">Đang tải lịch sử chat...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      {!isAuthenticated ? (
                        <>
                          <div className="text-5xl mb-4">🔒</div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Vui lòng đăng nhập
                          </h3>
                          <p className="text-sm text-slate-600 max-w-xs mb-4">
                            Bạn cần đăng nhập để sử dụng chatbot ELS-Bot
                          </p>
                          <a
                            href="/login"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                          >
                            Đăng nhập ngay
                          </a>
                        </>
                      ) : (
                        <>
                          <div className="text-5xl mb-4">👋</div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            Chào mừng đến với ELS-Bot!
                          </h3>
                          <p className="text-sm text-slate-600 max-w-xs mb-4">
                            Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì về tiếng Anh!
                          </p>
                          <div className="grid grid-cols-2 gap-2 max-w-xs">
                            <button
                              onClick={() => setInputMessage('Bạn là ai?')}
                              className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs font-medium"
                            >
                              Bạn là ai?
                            </button>
                            <button
                              onClick={() => setInputMessage('Giải thích thì hiện tại đơn')}
                              className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs font-medium"
                            >
                              Thì hiện tại đơn
                            </button>
                            <button
                              onClick={() => setInputMessage('Từ vựng về gia đình')}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                            >
                              Từ vựng gia đình
                            </button>
                            <button
                              onClick={() => setInputMessage('Cách sử dụng website?')}
                              className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-xs font-medium"
                            >
                              Cách sử dụng?
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                              message.sender === 'USER'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                : 'bg-white text-slate-900 border border-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {message.sender === 'BOT' && (
                                <div className="text-lg flex-shrink-0">🤖</div>
                              )}
                              <div className="flex-1">
                                <div className="whitespace-pre-wrap break-words text-sm">
                                  {message.messageContent.split('\n').map((line, idx) => {
                                    // Format markdown-like text
                                    if (line.startsWith('**') && line.endsWith('**')) {
                                      return (
                                        <p key={idx} className="font-bold text-base mb-2">
                                          {line.replace(/\*\*/g, '')}
                                        </p>
                                      );
                                    } else if (line.startsWith('1.') || line.startsWith('-')) {
                                      return (
                                        <p key={idx} className="ml-2 mb-1">
                                          {line}
                                        </p>
                                      );
                                    } else if (line.trim() === '') {
                                      return <br key={idx} />;
                                    } else {
                                      return (
                                        <p key={idx} className="mb-1">
                                          {line}
                                        </p>
                                      );
                                    }
                                  })}
                                </div>
                                <p
                                  className={`text-xs mt-1 ${
                                    message.sender === 'USER'
                                      ? 'text-blue-100'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                              {message.sender === 'USER' && (
                                <div className="text-lg flex-shrink-0">👤</div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                  
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white rounded-2xl px-3 py-2 border border-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="text-lg">🤖</div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="px-4 py-2 bg-red-50 border-t border-red-200">
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-3 bg-white">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => {
                          setInputMessage(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Nhập tin nhắn..."
                        className="w-full px-3 py-2 pr-8 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none max-h-[80px] text-sm"
                        rows={1}
                        disabled={loading}
                      />
                      {inputMessage && (
                        <button
                          type="button"
                          onClick={() => {
                            setInputMessage('');
                            if (inputRef.current) {
                              inputRef.current.style.height = 'auto';
                            }
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                          title="Xóa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || loading}
                      className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                        inputMessage.trim() && !loading
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // Minimized state - just show icon
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                <button
                  onClick={() => setIsMinimized(false)}
                  className="text-white text-2xl"
                  title="Mở rộng"
                >
                  🤖
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;

