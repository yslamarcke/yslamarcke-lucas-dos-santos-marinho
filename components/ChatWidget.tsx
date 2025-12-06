
import React, { useState, useRef, useEffect } from 'react';
import { chatWithBot } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
     { id: '1', sender: 'bot', text: 'Olá! Sou o ZelaBot. Como posso ajudar com sua solicitação hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!input.trim()) return;

     const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
     setMessages(p => [...p, userMsg]);
     setInput('');
     setIsTyping(true);

     const botReply = await chatWithBot(input);
     const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'bot', text: botReply };
     
     setMessages(p => [...p, botMsg]);
     setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
       {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl w-80 mb-4 overflow-hidden border border-gray-200 animate-scale-in flex flex-col h-96">
             <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                   <Bot className="w-5 h-5" />
                   <span className="font-bold">ZelaBot Online</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded">
                   <X className="w-4 h-4" />
                </button>
             </div>
             
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map(msg => (
                   <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                         msg.sender === 'user' 
                         ? 'bg-emerald-600 text-white rounded-br-none' 
                         : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                         {msg.text}
                      </div>
                   </div>
                ))}
                {isTyping && (
                   <div className="flex justify-start">
                      <div className="bg-gray-200 p-2 rounded-xl rounded-bl-none animate-pulse text-xs text-gray-500">
                         Digitando...
                      </div>
                   </div>
                )}
             </div>

             <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Digite sua dúvida..."
                  className="flex-1 text-sm border border-gray-300 rounded-full px-4 focus:outline-none focus:border-emerald-500"
                />
                <button type="submit" className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700">
                   <Send className="w-4 h-4" />
                </button>
             </form>
          </div>
       )}

       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
       >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
       </button>
    </div>
  );
};
