import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, BookOpen, X, Feather } from 'lucide-react';

const timelineEvents = [
  { year: 1216, title: "The Murder of Buondelmonte", description: "The murder of Buondelmonte de' Buondelmonti at the Ponte Vecchio marks the definitive split between Guelfs and Ghibellines in Florence." },
  { year: 1250, title: "Primo Popolo", description: "The death of Emperor Frederick II allows the Guelfs to return. The 'Primo Popolo' government is established, prioritizing the merchant class over the nobility." },
  { year: 1260, title: "Montaperti", description: "The Ghibelline forces, allied with Siena, inflict a devastating defeat on the Florentine Guelfs. The Arbia river runs red with blood, and Guelfs are exiled en masse." },
  { year: 1266, title: "Benevento", description: "The defeat and death of King Manfred of Sicily. In Florence, this led to the overthrow of the Ghibelline regime and the triumphant return of the Guelph exiles." },
  { year: 1282, title: "The Priors", description: "The major guilds (Arti Maggiori) consolidate power, establishing the Priorate as the supreme executive body of the city." },
  { year: 1293, title: "Ordinances of Justice", description: "Giano della Bella enacts strict laws against the magnates (nobility), barring them from political office and forcing them to reduce the height of their towers." },
  { year: 1300, title: "White & Black Split", description: "Internal strife fractures the Guelf party into Black (Donati) and White (Cerchi) factions, leading to street fighting and chaos." },
  { year: 1302, title: "White's Exile", description: "The Black Guelfs seize control with Papal support. Dante Alighieri and other White Guelfs are condemned to exile, never to return." }
];

const TimelineControl = ({ currentYear, onYearChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentEvent = timelineEvents.find(e => e.year === currentYear) || timelineEvents[0];
  const currentIndex = timelineEvents.findIndex(e => e.year === currentYear);

  const firstLetter = currentEvent.description.charAt(0);
  const restOfText = currentEvent.description.slice(1);

  const handleStep = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= timelineEvents.length) newIndex = timelineEvents.length - 1;
    onYearChange(timelineEvents[newIndex].year);
  };

  // חישוב אחוז ההתקדמות לצביעת הקו
  const progressPercent = (currentIndex / (timelineEvents.length - 1)) * 100;

  return (
    <div className="w-full flex flex-col gap-1 select-none">
      
      {/* --- אזור המידע (כותרת ושנה) --- */}
      <div className="text-center mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300" key={currentYear}>
          <span className="block text-3xl font-display font-bold text-[#c27646]">
            {currentEvent.year}
          </span>
          <span className="text-xs uppercase tracking-[0.15em] font-bold text-[#4a453d]">
            {currentEvent.title}
          </span>
      </div>

      {/* --- ציר הזמן הגרפי (נקי מטקסט) --- */}
      <div className="flex items-center gap-2">
        
        {/* כפתור אחורה */}
        <button 
          onClick={() => handleStep(-1)} 
          disabled={currentIndex === 0}
          className="p-1 text-[#8c857b] hover:text-[#c27646] disabled:opacity-20 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {/* הקו והנקודות */}
        <div className="relative flex-1 h-8 flex items-center">
            
            {/* קו רקע אפור */}
            <div className="absolute left-0 right-0 h-[2px] bg-[#dcdcdc] rounded-full"></div>
            
            {/* קו התקדמות צבעוני (עד הנקודה הנוכחית) */}
            <div 
                className="absolute left-0 h-[2px] bg-[#c27646]/50 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
            ></div>

            {/* הנקודות עצמן */}
            <div className="absolute left-0 right-0 flex justify-between items-center px-[2px]">
                {timelineEvents.map((event, idx) => {
                    const isActive = event.year === currentYear;
                    const isPast = idx < currentIndex;

                    return (
                        <div 
                            key={event.year}
          onClick={() => {
            console.log("TimelineControl: calling onYearChange with year:", event.year);
            onYearChange(event.year);
          }}
                            className="relative cursor-pointer group p-2" // Padding גדל כדי להקל על הלחיצה
                        >
                            {/* הנקודה הויזואלית */}
                            <div className={`
                                transition-all duration-300 border box-content
                                ${isActive ? 'w-3 h-3 bg-[#fcfaf5] border-[#c27646] border-[3px] scale-125 rounded-full shadow-sm z-10' : ''} 
                                ${!isActive && isPast ? 'w-2 h-2 bg-[#c27646] border-[#c27646] rotate-45' : ''}
                                ${!isActive && !isPast ? 'w-2 h-2 bg-[#dcdcdc] border-[#dcdcdc] rotate-45 hover:border-[#c27646] hover:bg-[#c27646]/50' : ''}
                            `}></div>

                            {/* Tooltip קטן שמופיע רק בעכבר (לא תופס מקום קבוע) */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-[#2c241b] text-[#fcfaf5] text-[9px] px-1.5 py-0.5 rounded shadow-lg z-20">
                                {event.year}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* כפתור קדימה */}
        <button 
          onClick={() => handleStep(1)} 
          disabled={currentIndex === timelineEvents.length - 1}
          className="p-1 text-[#8c857b] hover:text-[#c27646] disabled:opacity-20 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* --- כפתור פתיחת הכרוניקה --- */}
      <div className="flex justify-center mt-1 border-t border-[#000]/5 pt-2">
          <button 
             onClick={() => setIsModalOpen(true)}
             className="text-[10px] uppercase font-bold tracking-widest text-[#8c857b] flex items-center gap-1.5 hover:text-[#c27646] transition-colors"
          >
             <BookOpen size={12} />
             Read Chronicle
          </button>
      </div>

      {/* --- Modal (ללא שינוי, רק מוודא שהוא קיים) --- */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#1a1510]/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-[#fcfaf5] w-full max-w-lg shadow-2xl relative border border-[#dcdcdc] rounded-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
             <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white bg-[#8b1e1e] hover:bg-[#6b1616] rounded-full p-1 transition-colors shadow-md z-10 cursor-pointer">
               <X size={16} />
             </button>
             <div className="p-10 text-center relative">
                <div className="flex justify-center mb-4 text-[#8c857b]"><BookOpen size={24} strokeWidth={1.5} /></div>
                <h2 className="font-serif text-3xl font-bold text-[#2c241b] mb-1">{currentEvent.title}</h2>
                <div className="flex items-center justify-center gap-3 mb-8">
                   <div className="h-px w-12 bg-[#c27646]/50"></div>
                   <span className="font-serif text-[#c27646] font-bold tracking-widest text-sm">{currentEvent.year} A.D.</span>
                   <div className="h-px w-12 bg-[#c27646]/50"></div>
                </div>
                <div className="text-left font-serif text-[#4a453d] text-lg leading-relaxed mb-8">
                   <span className="float-left text-6xl font-bold text-[#8b1e1e] leading-[0.8] mr-3 mt-[-4px] font-serif">{firstLetter}</span>
                   {restOfText}
                </div>
                <div className="border-t border-[#e5e5e5] pt-4 mt-8 text-left">
                   <div className="flex items-center gap-2 mb-2">
                      <Feather size={14} className="text-[#8c857b]" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c857b]">Historical Sources</span>
                   </div>
                   <p className="text-xs text-[#8c857b] italic font-serif">* Based on Giovanni Villani's "Nuova Cronica".</p>
                </div>
             </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TimelineControl;