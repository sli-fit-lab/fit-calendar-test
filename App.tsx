import React, { useState, useMemo } from 'react';
import CalendarHeader from './components/CalendarHeader';
import EventPanel from './components/EventPanel';
import { CURRENT_YEAR, WEEKDAYS, DEFAULT_EVENTS } from './constants';
import { CalendarEvent, DayInfo } from './types';

const App: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const eventsMap = useMemo(() => {
    const map = new Map<string, CalendarEvent>();
    DEFAULT_EVENTS.forEach(event => map.set(event.date, event));
    return map;
  }, []);

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const daysInMonth = useMemo((): DayInfo[] => {
    const days: DayInfo[] = [];
    const firstDay = new Date(CURRENT_YEAR, currentMonth, 1);
    const lastDay = new Date(CURRENT_YEAR, currentMonth + 1, 0);
    const today = new Date();
    
    // Start padding (Monday as first day)
    let startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(CURRENT_YEAR, currentMonth, -i);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(CURRENT_YEAR, currentMonth, i);
      const isoStr = date.toISOString().split('T')[0];
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        event: eventsMap.get(isoStr)
      });
    }

    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(CURRENT_YEAR, currentMonth + 1, i);
      days.push({ date, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [currentMonth, eventsMap]);

  const selectedEvent = selectedDate ? eventsMap.get(selectedDate.toISOString().split('T')[0]) : undefined;

  return (
    <div className="w-[850px] h-[600px] bg-[#FAFAF9] flex items-center justify-center overflow-hidden mx-auto">
      <div className="w-[800px] h-[540px] bg-white rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(19,90,84,0.12)] border border-[#dddddd] flex flex-row overflow-hidden ring-1 ring-[#135a54]/5">
        
        {/* Kalender-Hauptbereich */}
        <div className="flex-1 flex flex-col p-8 bg-white relative min-w-0">
          <CalendarHeader 
            currentMonth={currentMonth} 
            onPrevMonth={() => currentMonth > 0 && setCurrentMonth(m => m - 1)} 
            onNextMonth={() => currentMonth < 11 && setCurrentMonth(m => m + 1)}
            onToday={() => {
              const now = new Date();
              setCurrentMonth(now.getMonth());
              setSelectedDate(now);
            }}
            canGoPrev={currentMonth > 0}
            canGoNext={currentMonth < 11}
          />

          <div className="mt-6 flex-1">
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center text-[9px] font-bold text-[#6f817f] opacity-60 uppercase tracking-[0.3em] py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day, idx) => {
                const isSelected = selectedDate ? isSameDay(selectedDate, day.date) : false;
                const hasEvent = !!day.event;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      relative aspect-square flex items-center justify-center transition-all duration-300
                      ${day.isCurrentMonth ? 'text-[#545454]' : 'text-[#dddddd]'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 flex flex-col items-center justify-center rounded-full transition-all duration-300
                      ${isSelected ? 'bg-[#135a54] text-white shadow-lg shadow-[#135a54]/20 z-10 font-bold' : 'hover:bg-[#d5f2e3]/60'}
                      ${day.isToday && !isSelected ? 'ring-2 ring-[#9bdbbf] bg-[#d5f2e3]/40 text-[#135a54] font-bold' : ''}
                      ${hasEvent && !isSelected && !day.isToday ? 'bg-[#9bdbbf]/10' : ''}
                    `}>
                      <span className="text-sm font-semibold tracking-tight">
                        {day.date.getDate()}
                      </span>
                      
                      {hasEvent && (
                        <span className={`
                          absolute bottom-1.5 w-[3px] h-[3px] rounded-full
                          ${isSelected ? 'bg-white' : 'bg-[#135a54]'}
                        `} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[280px] bg-[#d5f2e3] border-l border-[#135a54]/10 flex flex-col p-8 overflow-y-auto shrink-0">
          <div className="flex-1">
            <EventPanel 
              selectedDate={selectedDate} 
              event={selectedEvent} 
            />
          </div>
          
          <div className="mt-6 pt-6 border-t border-[#135a54]/10 text-center">
             <span className="text-[9px] font-bold text-[#135a54] uppercase tracking-[0.3em] opacity-40">Fit Reisen Kalender</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
