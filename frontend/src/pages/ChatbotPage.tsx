import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotService } from '../services/api';
import { ChatMessage } from '../types';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';
import AnimatedMascot from '../components/AnimatedMascot';

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        const history = await chatbotService.getChatHistory();
        setMessages(history);
      } catch (err: any) {
        setError('Không thể tải lịch sử chat');
        console.error(err);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

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
      setError('Không thể gửi tin nhắn. Vui lòng thử lại.');
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMessage.id));
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

  if (loadingHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ScenicBackground />
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-700">Đang tải lịch sử chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <ScenicBackground />
      <SiteHeader />
      
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <AnimatedMascot mood="idle" size="md" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                🤖 ELS-Bot
              </h1>
              <p className="text-slate-600 mt-1">
                Trợ lý AI học tiếng Anh của bạn
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Chào mừng đến với ELS-Bot!
                </h3>
                <p className="text-slate-600 max-w-md">
                  Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì về tiếng Anh, 
                  ngữ pháp, từ vựng, hoặc cách sử dụng website này nhé!
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                  <button
                    onClick={() => setInputMessage('Bạn là ai?')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Bạn là ai?
                  </button>
                  <button
                    onClick={() => setInputMessage('Giải thích thì hiện tại đơn')}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    Giải thích thì hiện tại đơn
                  </button>
                  <button
                    onClick={() => setInputMessage('Từ vựng về gia đình')}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    Từ vựng về gia đình
                  </button>
                  <button
                    onClick={() => setInputMessage('Cách sử dụng website này?')}
                    className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors text-sm font-medium"
                  >
                    Cách sử dụng website?
                  </button>
                </div>
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
                      className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.sender === 'USER'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {message.sender === 'BOT' && (
                          <div className="text-2xl flex-shrink-0">🤖</div>
                        )}
                        <div className="flex-1">
                          <p className="whitespace-pre-wrap break-words">
                            {message.messageContent}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === 'USER'
                                ? 'text-blue-100'
                                : 'text-slate-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        {message.sender === 'USER' && (
                          <div className="text-2xl flex-shrink-0">👤</div>
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
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">🤖</div>
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
            <div className="px-4 md:px-6 py-2 bg-red-50 border-t border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-4 md:p-6 bg-slate-50">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    // Auto resize
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Nhập tin nhắn của bạn... (Enter để gửi, Shift+Enter để xuống dòng)"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none max-h-[120px] transition-all"
                  rows={1}
                  disabled={loading}
                />
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  inputMessage.trim() && !loading
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              ELS-Bot có thể giúp bạn học tiếng Anh, giải thích ngữ pháp, và trả lời câu hỏi về website
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

