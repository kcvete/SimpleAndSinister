import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createChatSession, sendMessageToCoach } from '../services/geminiService';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { Chat } from '@google/genai';

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Comrade! I am your S&S Coach. How can I assist your training today? Ask about form, progression, or recovery.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session once
  useEffect(() => {
    if (!process.env.API_KEY) {
      // Handle missing API key gracefully
      return;
    }
    chatSession.current = createChatSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!process.env.API_KEY) {
       setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() },
        { id: (Date.now() + 1).toString(), role: 'model', text: "API Key is missing. Please configure the API_KEY environment variable to use the Coach feature.", timestamp: Date.now() }
      ]);
      setInput('');
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSession.current) {
         chatSession.current = createChatSession();
      }

      if (chatSession.current) {
        const responseText = await sendMessageToCoach(chatSession.current, userMsg.text);
        
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
         id: (Date.now() + 1).toString(),
         role: 'model',
         text: "I encountered an error connecting to headquarters. Please try again later.",
         timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4 shadow-lg">
         <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-red-500" />
            Comrade Coach
         </h2>
         <p className="text-xs text-slate-400 mt-1">Powered by Gemini. Ask about S&S protocols.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`min-w-8 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-red-600'
              }`}
            >
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600/20 text-blue-100 rounded-tr-sm border border-blue-500/20'
                  : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0">
               <Bot size={16} />
            </div>
             <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm border border-slate-700 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-slate-400" />
                <span className="text-slate-400 text-xs">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex items-center gap-2 shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about technique, pain, or schedule..."
          className="flex-1 bg-transparent text-white px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
      
      {!process.env.API_KEY && (
         <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1 justify-center opacity-70">
            <AlertTriangle size={10} /> API Key not detected. Chat is in demo mode.
         </div>
      )}
    </div>
  );
};

export default AICoach;
