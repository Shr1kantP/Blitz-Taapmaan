import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from '../shared/Icons';

interface AIChatScreenProps {
  score: number;
  level: string;
  city: string;
  persona: string;
}

const AIChatScreen: React.FC<AIChatScreenProps> = ({ score, level, city, persona }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I'm your Heat Safety Pilot. Based on your profile and the current ${score}°C heat index in ${city}, I'm here to answer any health or safety questions.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          context: { score, level, city, persona }
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the safety advisor. Please check your network." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] p-6 animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Safety Pilot</h2>
        <p className="text-slate-500 font-medium italic">"Expert AI advice on surviving urban heat waves."</p>
      </div>

      <div className="flex-1 glass glass--rounded-xl overflow-hidden flex flex-col shadow-2xl border border-white/40">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-3xl border border-slate-100 animate-pulse text-slate-400">
                Thinking...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent px-2 text-sm font-medium outline-none"
            />
            <button 
                onClick={handleSend}
                className="w-10 h-10 bg-brand-orange text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all"
            >
                <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatScreen;
