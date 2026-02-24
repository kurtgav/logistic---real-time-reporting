import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import { geminiService } from '../../services/geminiService';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

export const SupportView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'chat'>('faq');
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: 1, sender: 'bot', text: 'Hello! I am the RVL Fleet Support Agent. How can I assist you with your operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text: input };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      // Context for the AI about the app capabilities
      const context = `
        The user is using the RVL Movers Fleet Command dashboard.
        Capabilities: Tracking vehicles, managing drivers, logging maintenance, dispatching jobs, viewing cost reports.
        Current operational status: 84 active units, 98% on-time rate.
      `;

      const reply = await geminiService.chatSupport(userMsg.text, context);
      
      setIsTyping(false);
      const botMsg: ChatMessage = { id: Date.now() + 1, sender: 'bot', text: reply };
      setMessages(prev => [...prev, botMsg]);
  };

  const renderFAQ = () => (
      <div className="space-y-6 animate-fade-in">
           <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-gray-800 mb-2">Help Center</h2>
               <div className="relative max-w-lg mx-auto">
                    <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for articles..." 
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
               </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
                   <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-100">
                       <Icon name="FileText" size={24} />
                   </div>
                   <h3 className="font-bold text-gray-800 mb-2">User Guides</h3>
                   <p className="text-sm text-gray-500">Step-by-step tutorials on fleet dispatching and tracking.</p>
               </div>
               
               <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group" onClick={() => setActiveTab('chat')}>
                   <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-100">
                       <Icon name="Activity" size={24} />
                   </div>
                   <h3 className="font-bold text-gray-800 mb-2">AI Agent Chat</h3>
                   <p className="text-sm text-gray-500">Ask our Gemini-powered agent for instant operational help.</p>
               </div>
           </div>

           <div className="mt-8">
               <h3 className="font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
               <div className="space-y-4">
                   {[
                       "How do I add a new vehicle to the fleet?",
                       "How is fuel consumption calculated?",
                       "Can I export trip logs to Excel?",
                       "What should I do if a GPS tracker goes offline?"
                   ].map((q, idx) => (
                       <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                           <span className="text-sm font-medium text-gray-700">{q}</span>
                           <Icon name="ChevronRight" size={16} className="text-gray-400" />
                       </div>
                   ))}
               </div>
           </div>
      </div>
  );

  const renderChat = () => (
      <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-md">
                      <Icon name="Activity" size={20} />
                  </div>
                  <div>
                      <h3 className="font-bold text-gray-800">RVL AI Agent</h3>
                      <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                      </div>
                  </div>
              </div>
              <button onClick={() => setActiveTab('faq')} className="text-gray-400 hover:text-gray-600">
                  <Icon name="X" size={20} />
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={scrollRef}>
              {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                          msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                      }`}>
                          {msg.text}
                      </div>
                  </div>
              ))}
              {isTyping && (
                  <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-full px-4 py-2 flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                      </div>
                  </div>
              )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about drivers, costs, or maintenance..." 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                  >
                      <Icon name="Navigation" size={20} className="rotate-90" />
                  </button>
              </form>
          </div>
      </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
        {activeTab === 'faq' ? renderFAQ() : renderChat()}
    </div>
  );
};