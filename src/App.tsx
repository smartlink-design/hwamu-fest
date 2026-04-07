import { useState, useEffect } from 'react';
import { Flower } from 'lucide-react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import AdminPage from './pages/AdminPage';
import { EventProvider } from './context/EventContext';

const brutalStyle = `
  .brutal-shadow { box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); }
  .brutal-shadow-sm { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
  .brutal-shadow-hover:hover { box-shadow: 2px 2px 0px 0px rgba(0,0,0,1); transform: translate(4px, 4px); }
  ::-webkit-scrollbar { width: 12px; }
  ::-webkit-scrollbar-track { background: #f4f4f0; border-left: 4px solid black; }
  ::-webkit-scrollbar-thumb { background: #f472b6; border-left: 4px solid black; border-bottom: 4px solid black; }
`;

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'calendar' | 'admin'>('home'); 
  const [secretClickCount, setSecretClickCount] = useState(0);

  useEffect(() => {
    if (secretClickCount > 0) {
      const timer = setTimeout(() => setSecretClickCount(0), 500); 
      return () => clearTimeout(timer);
    }
  }, [secretClickCount]);

  const handleSecretClick = () => {
    const newCount = secretClickCount + 1;
    if (newCount >= 5) {
      setCurrentView('admin'); 
      setSecretClickCount(0);
    } else {
      setSecretClickCount(newCount);
    }
  };

  return (
    <EventProvider>
      <style>{brutalStyle}</style>
      <div className="min-h-screen bg-[#f4f4f0] text-black font-sans selection:bg-pink-400 selection:text-white pb-20"
           style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        
        {currentView === 'home' && <HomePage />}
        {currentView === 'calendar' && <CalendarPage />}
        {currentView === 'admin' && <AdminPage />}

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="bg-black text-white border-4 border-black p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8 brutal-shadow">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="relative w-16 h-16 cursor-pointer group mb-2" onClick={() => setCurrentView('home')}>
                <div className="absolute inset-0 bg-lime-400 border-4 border-black brutal-shadow-sm transform -rotate-12 group-hover:rotate-0 transition-all z-0"></div>
                <div className="absolute inset-0 bg-cyan-400 border-4 border-black brutal-shadow-sm transform rotate-6 group-hover:rotate-0 transition-all z-10"></div>
                <div className="absolute inset-0 bg-pink-500 border-4 border-black brutal-shadow-sm flex items-center justify-center transform group-hover:scale-110 transition-all z-20">
                  <Flower className="w-10 h-10 text-black fill-white" strokeWidth={2.5} />
                </div>
              </div>
              <p 
                className="text-gray-300 font-bold text-center md:text-left select-none cursor-default"
                onClick={handleSecretClick}
              >
                서브컬처 행사 종합 플랫폼<br/>
                © 2026 스마트링크. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex space-x-4">
                <button className="bg-pink-400 text-black border-2 border-black px-4 py-2 font-black hover:bg-white transition-colors">이용약관</button>
                <button className="bg-cyan-400 text-black border-2 border-black px-4 py-2 font-black hover:bg-white transition-colors">개인정보처리방침</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </EventProvider>
  );
}