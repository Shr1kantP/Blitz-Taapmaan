import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from './Icons';
import { UserProfile, RiskLevel } from '../../types/weather';

interface AIChatPanelProps {
  score: number;
  level: RiskLevel;
  city: string;
  persona: UserProfile | null;
  duration: number;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ score, level, city, persona, duration }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          persona, 
          riskLevel: level, 
          heatIndexScore: score, 
          city,
          duration 
        }),
      });
      const data = await res.json();
      setResponse(data.content);
    } catch (error) {
      setResponse("Sorry, I couldn't reach the safety advisor. Stay hydrated!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-orange-50/30 p-6 rounded-[2.5rem] border border-orange-100/50 shadow-inner">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-brand-orange text-white p-1.5 rounded-lg">
          <Sparkles size={16} />
        </div>
        <h3 className="font-bold text-gray-800 tracking-tight">AI Safety Advisor</h3>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 min-h-[100px] mb-4 border border-white relative overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-brand-orange" />
          </div>
        ) : response ? (
          <div className="text-sm text-gray-700 leading-relaxed font-medium">
            {response}
          </div>
        ) : (
          <div className="text-sm text-gray-400 italic">
            "How can I stay safe while working today?"
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask TAAPMAAN advisor..."
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all"
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
        />
        <button 
          onClick={handleAsk}
          disabled={loading || !message.trim()}
          className="bg-brand-orange text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;
