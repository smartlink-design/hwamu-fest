import React, { useState, useContext } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { EventContext } from '../context/EventContext';
import type { AppEvent } from '../types';

const CalendarPage: React.FC = () => {
  const { events } = useContext(EventContext);
  const [currentDate, setCurrentDate] = useState(new Date()); 

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const emptyDaysAtStart = new Date(year, month, 1).getDay(); 
  const totalDays = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((emptyDaysAtStart + totalDays) / 7) * 7;

  const monthStartMs = new Date(year, month, 1).getTime();
  const monthEndMs = new Date(year, month + 1, 0, 23, 59, 59).getTime();

  const processedEvents = events.map(evt => {
    const start = new Date(evt.startDate);
    const end = new Date(evt.endDate);
    end.setHours(23, 59, 59);

    if (end.getTime() < monthStartMs || start.getTime() > monthEndMs) return null;

    const gridStartDay = start.getTime() < monthStartMs ? 1 : start.getDate();
    const gridEndDay = end.getTime() > monthEndMs ? totalDays : end.getDate();

    return {
      ...evt,
      startIdx: gridStartDay + emptyDaysAtStart - 1,
      endIdx: gridEndDay + emptyDaysAtStart - 1,
      slot: 0,
    };
  }).filter(Boolean) as (AppEvent & { startIdx: number; endIdx: number; slot: number })[];

  const cellSlots: boolean[][] = Array(totalCells).fill(null).map(() => []);
  processedEvents.forEach(evt => {
    let slot = 0;
    while (true) {
      let isAvailable = true;
      for (let i = evt.startIdx; i <= evt.endIdx; i++) {
        if (cellSlots[i][slot]) {
          isAvailable = false;
          break;
        }
      }
      if (isAvailable) break;
      slot++;
    }
    for (let i = evt.startIdx; i <= evt.endIdx; i++) {
      cellSlots[i][slot] = true;
    }
    evt.slot = slot;
  });

  const totalWeeks = totalCells / 7;
  const weeks = [];
  for (let w = 0; w < totalWeeks; w++) {
    const weekStartIdx = w * 7;
    const weekEndIdx = weekStartIdx + 6;

    const days: (number | null)[] = [];
    for (let i = weekStartIdx; i <= weekEndIdx; i++) {
      const dayNum = i - emptyDaysAtStart + 1;
      days.push((dayNum > 0 && dayNum <= totalDays) ? dayNum : null);
    }

    const weekEvents = processedEvents.filter(
      evt => evt.startIdx <= weekEndIdx && evt.endIdx >= weekStartIdx
    );

    weeks.push({ days, events: weekEvents, weekStartIdx, weekEndIdx });
  }

  const formattedMonth = `${year}. ${String(month + 1).padStart(2, '0')}`;

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-6">
          <button onClick={handlePrevMonth} className="w-12 h-12 bg-white border-4 border-black brutal-shadow-sm flex items-center justify-center hover:bg-yellow-300">
            <ChevronLeft className="w-8 h-8 text-black" strokeWidth={3} />
          </button>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-lime-400 border-4 border-black transform translate-x-2 translate-y-2"></div>
            <h1 className="relative bg-white border-4 border-black px-8 py-3 text-4xl font-black text-black tracking-tighter w-48 text-center">
              {formattedMonth}
            </h1>
          </div>
          <button onClick={handleNextMonth} className="w-12 h-12 bg-white border-4 border-black brutal-shadow-sm flex items-center justify-center hover:bg-yellow-300">
            <ChevronRight className="w-8 h-8 text-black" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="w-full bg-black border-4 border-black brutal-shadow flex flex-col gap-1 p-1">
        
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map((day, idx) => (
            <div key={day} className={`bg-white text-center py-2 font-black text-xl border-2 border-black ${idx === 0 ? 'text-pink-600' : idx === 6 ? 'text-cyan-600' : 'text-black'}`}>
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7 gap-1 relative min-h-[140px] bg-black">
            
            {week.days.map((day, dIdx) => (
              <div
                key={dIdx}
                className={`border-2 border-black flex flex-col p-2 group transition-colors duration-200 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-200 opacity-50'}`}
                style={{ gridColumnStart: dIdx + 1, gridRowStart: 1 }}
              >
                {day && (
                  <div className={`font-black text-xl flex justify-between items-start z-10 ${dIdx === 0 ? 'text-pink-600' : dIdx === 6 ? 'text-cyan-600' : 'text-black'}`}>
                    <span>{day}</span>
                  </div>
                )}
              </div>
            ))}

            {week.events.map((evt) => {
              const colStart = Math.max(0, evt.startIdx - week.weekStartIdx) + 1;
              const colEnd = Math.min(6, evt.endIdx - week.weekStartIdx) + 1;
              const isStart = evt.startIdx >= week.weekStartIdx;
              const isEnd = evt.endIdx <= week.weekEndIdx;

              let extraClasses = '';
              if (isStart && isEnd) {
                extraClasses = 'mx-1 border-x-2 rounded-md';
              } else if (!isStart && isEnd) {
                extraClasses = 'ml-0 mr-1 border-l-0 border-r-2 rounded-l-none rounded-r-md';
              } else if (isStart && !isEnd) {
                extraClasses = 'ml-1 mr-0 border-r-0 border-l-2 rounded-l-md rounded-r-none';
              } else {
                extraClasses = 'mx-0 border-x-0 rounded-none';
              }

              return (
                <div
                  key={evt.id}
                  onClick={() => { if (evt.linkUrl) window.open(evt.linkUrl, '_blank'); }}
                  className={`z-20 h-7 flex items-center px-2 text-xs md:text-sm font-black text-black border-y-2 border-black cursor-pointer hover:opacity-90 transition-opacity truncate ${evt.tagColor} ${extraClasses}`}
                  style={{ gridColumnStart: colStart, gridColumnEnd: colEnd + 1, gridRowStart: 1, marginTop: `${40 + evt.slot * 34}px`, marginBottom: '10px', alignSelf: 'start', boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
                  title={evt.title}
                >
                  <span className="truncate">{isStart || colStart === 1 ? evt.title : ''}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;