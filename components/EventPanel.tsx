import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '../types';
import { getDateInsight } from '../services/geminiService';

interface EventPanelProps {
  selectedDate: Date | null;
  event?: CalendarEvent;
}

const EventPanel: React.FC<EventPanelProps> = ({ selectedDate, event }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getDateInsight(`Datum: ${selectedDate.toLocaleDateString('de-DE')}. Bitte antworte kurz auf Deutsch.`)
        .then(res => setInsight(res))
        .finally(() => setLoading(false));
    }
  }, [selectedDate]);

  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#135a54] py-8 opacity-40">
        <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Tag wählen</p>
      </div>
    );
  }

  const typeStyles = {
    meeting: 'bg-[#135a54] text-white',
    holiday: 'bg-white text-[#135a54]',
    social: 'bg-[#9bdbbf] text-[#135a54]',
    deadline: 'bg-[#545454] text-white'
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-6 flex flex-col">
        <p className="text-[10px] font-bold text-[#135a54] uppercase tracking-[0.2em] mb-1 opacity-70">
          {selectedDate.toLocaleDateString('de-DE', { weekday: 'long' })}
        </p>
        <h2 className="text-3xl font-bold text-[#135a54] font-header leading-tight tracking-tight">
          {selectedDate.toLocaleDateString('de-DE', { month: 'long', day: 'numeric' })}
        </h2>
      </div>

      {event ? (
        <div className="space-y-3">
          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-[#135a54]/10 shadow-sm relative overflow-hidden group hover:bg-white transition-all">
            <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3 relative z-10 ${typeStyles[event.type]}`}>
              {event.type}
            </span>
            
            <h3 className="text-xl font-bold text-[#135a54] leading-tight mb-3 relative z-10 font-header">
              {event.title}
            </h3>
            
            <p className="text-sm text-[#135a54] leading-relaxed relative z-10 font-medium opacity-90">
              {event.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8 px-6 border-2 border-dashed border-[#135a54]/20 rounded-[2rem] text-center bg-white/40">
          <p className="text-[10px] text-[#135a54] font-bold uppercase tracking-[0.2em] opacity-60">Frei</p>
          <p className="text-base text-[#135a54] mt-2 italic font-semibold">Schönen Tag!</p>
        </div>
      )}

      <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-[1.5rem] p-5 border border-[#135a54]/10 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#135a54]"></div>
          <span className="text-[10px] font-bold text-[#135a54] uppercase tracking-[0.2em] opacity-70">AI Insight</span>
        </div>
        {loading ? (
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-[#135a54]/10 animate-pulse rounded-full"></div>
            <div className="h-1.5 w-3/4 bg-[#135a54]/10 animate-pulse rounded-full"></div>
          </div>
        ) : (
          <p className="text-xs text-[#135a54] italic font-semibold leading-relaxed">
            {insight}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventPanel;