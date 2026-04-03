import React, { useState, useEffect, useContext } from 'react';
import { Calendar as CalendarIcon, MapPin, Gamepad2, Mic2, Flame } from 'lucide-react';
import { EventContext } from '../context/EventContext';
import type { AppEvent } from '../types';

const HeroSection: React.FC = () => {
  const { banners } = useContext(EventContext);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full h-[55vh] bg-gray-200 mt-20 flex flex-col items-center justify-center border-b-4 border-black text-center px-4">
        <p className="text-2xl font-black text-gray-500">등록된 배너가 없습니다.</p>
        <p className="text-lg font-bold text-gray-400">관리자 페이지에서 배너를 추가해 주세요!</p>
      </div>
    );
  }

  const banner = banners[currentSlide];

  return (
    <div 
      className={`relative w-full h-[55vh] min-h-[500px] border-b-4 border-black overflow-hidden transition-colors duration-500 mt-20 cursor-pointer group ${banner.bgColor}`}
      onClick={() => { if (banner.linkUrl) window.open(banner.linkUrl, '_blank'); }}
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-10 pb-12">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-block bg-black text-white px-4 py-2 font-black text-lg border-2 border-black transform -rotate-2 brutal-shadow-sm">{banner.tag}</div>
            <h1 className="text-5xl md:text-7xl font-black text-black leading-tight tracking-tighter" style={{ textShadow: '4px 4px 0 #fff' }}>{banner.title}</h1>
            <p className="text-xl md:text-2xl text-black font-bold bg-white inline-block px-3 py-1 border-2 border-black">{banner.subtitle}</p>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black text-lg brutal-shadow-sm">
                <CalendarIcon className="w-6 h-6 text-black" strokeWidth={3} />
                <span>{banner.date}</span>
              </div>
            </div>
            {/* 예매 하러가기 버튼 삭제됨 */}
          </div>
          <div className="flex-1 hidden md:flex justify-end relative">
            <div className="relative w-[90%] aspect-[4/3] bg-white border-4 border-black brutal-shadow z-10 transform rotate-2 group-hover:scale-105 transition-transform duration-300">
              <img src={banner.image} alt="banner" className="w-full h-full object-cover border-b-4 border-black" />
            </div>
            <div className="absolute top-8 -left-4 w-full h-full bg-pink-400 border-4 border-black z-0 transform -rotate-3" />
          </div>
        </div>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {banners.map((_, idx) => (
            <button 
              key={idx} 
              onClick={(e) => {
                e.stopPropagation(); // 버튼 누를 때는 새 창 안 열리게 방지
                setCurrentSlide(idx);
              }} 
              className={`h-4 border-2 border-black transition-all duration-300 brutal-shadow-sm ${idx === currentSlide ? "w-12 bg-black" : "w-4 bg-white hover:bg-gray-200"}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EventCard: React.FC<{ event: AppEvent }> = ({ event }) => {
  const formattedDate = `${event.startDate.slice(5).replace('-','.')} - ${event.endDate.slice(5).replace('-','.')}`;
  
  return (
    <div 
      className="group cursor-pointer bg-white border-4 border-black brutal-shadow brutal-shadow-hover transition-all duration-200 flex flex-col h-full"
      onClick={() => { if (event.linkUrl) window.open(event.linkUrl, '_blank'); }}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b-4 border-black bg-gray-100">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
        <div className={`absolute top-3 left-3 ${event.tagColor} border-2 border-black px-3 py-1 font-black text-black brutal-shadow-sm flex items-center gap-1.5 transform -rotate-2`}>
          <CalendarIcon className="w-4 h-4" strokeWidth={3} />
          <span className="text-sm">{formattedDate}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        <h3 className="text-xl font-black text-black group-hover:text-pink-600 transition-colors line-clamp-2 leading-tight">{event.title}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-black font-bold bg-gray-100 border-2 border-black px-2 py-1 w-fit">
            <MapPin className="w-4 h-4" strokeWidth={3} />
            <span className="text-sm truncate max-w-[150px]">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

const Section: React.FC<{ title: string, icon: React.ElementType, data: AppEvent[], titleBg: string }> = ({ title, icon: Icon, data, titleBg }) => {
  if (data.length === 0) return null; 
  return (
    <section className="py-16 relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div className="relative inline-block">
          <div className={`absolute inset-0 ${titleBg} border-4 border-black transform translate-x-2 translate-y-2`} />
          <div className="relative bg-white border-4 border-black px-6 py-4 flex items-center gap-3">
            <Icon className="w-8 h-8 text-black" strokeWidth={3} />
            <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">{title}</h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.map(event => <EventCard key={event.id} event={event} />)}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  const { events } = useContext(EventContext);

  const subcultureEvents = events.filter(e => e.category === 'subculture');
  const gameEvents = events.filter(e => e.category === 'game');
  const jpopEvents = events.filter(e => e.category === 'jpop');

  return (
    <>
      <HeroSection />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-[400px]">
        {events.length === 0 && (
          <div className="text-center py-20 border-4 border-dashed border-gray-400">
            <p className="text-2xl font-black text-gray-500 mb-4">앗! 등록된 행사가 없어요.</p>
            <p className="text-lg font-bold text-gray-400">우측 상단 '관리자' 아이콘을 눌러 행사를 추가해 보세요!</p>
          </div>
        )}
        <Section title="이번 주말, 덕력을 채울 시간 🎨" icon={Flame} data={subcultureEvents} titleBg="bg-pink-400" />
        <Section title="오프라인에서 만나는 최애 게임 🎮" icon={Gamepad2} data={gameEvents} titleBg="bg-cyan-400" />
        <Section title="고막을 녹일 J-POP 내한 일정 🎤" icon={Mic2} data={jpopEvents} titleBg="bg-lime-400" />
      </main>
    </>
  );
};

export default HomePage;