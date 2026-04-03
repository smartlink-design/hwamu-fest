import React, { useState, useContext, useEffect } from 'react';
import { EventContext } from '../context/EventContext';
import { supabase } from '../supabase';
import type { AppEvent, EventCategory, HeroBanner } from '../types';

const AdminPage: React.FC = () => {
  const { events, addEvent, deleteEvent, banners, addBanner, deleteBanner } = useContext(EventContext);
  
  const [user, setUser] = useState<any>(null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [activeTab, setActiveTab] = useState<'banner' | 'event'>('banner');

  const [eventForm, setEventForm] = useState({
    title: '', category: 'subculture' as EventCategory, location: '',
    startDate: '', endDate: '', image: '', tagColor: 'bg-yellow-300', linkUrl: ''
  });

  const [bannerForm, setBannerForm] = useState({
    title: '', subtitle: '', date: '', image: '', tag: '', bgColor: 'bg-lime-300', linkUrl: ''
  });

  // Supabase 세션 확인 (로그인 유지)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });
    if (error) alert('로그인 실패! 이메일이나 비밀번호를 확인해주세요.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: AppEvent = { id: Date.now().toString(), ...eventForm };
    await addEvent(newEvent);
    alert('행사가 DB에 등록되었습니다!');
    setEventForm({ title: '', category: 'subculture', location: '', startDate: '', endDate: '', image: '', tagColor: 'bg-yellow-300', linkUrl: '' });
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBanner: HeroBanner = { id: Date.now().toString(), ...bannerForm };
    await addBanner(newBanner);
    alert('새 배너가 DB에 등록되었습니다!');
    setBannerForm({ title: '', subtitle: '', date: '', image: '', tag: '', bgColor: 'bg-lime-300', linkUrl: '' });
  };

  if (!user) {
    return (
      <div className="pt-32 pb-20 max-w-md mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-black text-white px-8 py-4 border-4 border-black brutal-shadow mb-8 transform -rotate-2">
          <h1 className="text-2xl font-black">🔒 SmartLink Admin</h1>
        </div>
        <form onSubmit={handleLogin} className="bg-white border-4 border-black p-8 brutal-shadow flex flex-col gap-4 w-full">
          <label className="font-black text-lg text-center mb-2">관리자 계정으로 로그인하세요</label>
          <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="border-4 border-black p-3 font-bold focus:bg-cyan-50 outline-none text-center" placeholder="Email" required />
          <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="border-4 border-black p-3 font-bold focus:bg-cyan-50 outline-none text-center" placeholder="Password" required />
          <button type="submit" className="bg-cyan-400 text-black border-4 border-black py-3 font-black text-lg brutal-shadow-sm hover:bg-cyan-500 transition-all mt-2">접속하기</button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 min-h-screen">
      <div className="bg-black text-white px-8 py-4 border-4 border-black brutal-shadow mb-8 transform -rotate-1 w-fit flex items-center gap-4">
        <h1 className="text-3xl font-black">⚙️ 관리자 대시보드</h1>
        <button onClick={handleLogout} className="text-sm font-bold bg-white text-black px-2 py-1 border-2 border-black ml-4 hover:bg-gray-200">로그아웃</button>
      </div>

      <div className="flex space-x-2 md:space-x-4 mb-10">
        <button onClick={() => setActiveTab('banner')} className={`px-6 py-3 font-black text-xl border-4 border-black transition-all ${activeTab === 'banner' ? 'bg-black text-white brutal-shadow-sm' : 'bg-white text-black hover:bg-gray-200'}`}>배너 관리</button>
        <button onClick={() => setActiveTab('event')} className={`px-6 py-3 font-black text-xl border-4 border-black transition-all ${activeTab === 'event' ? 'bg-black text-white brutal-shadow-sm' : 'bg-white text-black hover:bg-gray-200'}`}>일정 관리</button>
      </div>

      {activeTab === 'banner' && (
        <section className="animate-fade-in">
          <h2 className="text-2xl font-black mb-6 bg-white border-4 border-black inline-block px-4 py-2 transform rotate-1">📺 메인 배너 등록</h2>
          <form onSubmit={handleBannerSubmit} className="bg-white border-4 border-black p-6 md:p-10 brutal-shadow flex flex-col gap-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2"><label className="font-black text-lg">배너 제목</label><input type="text" required value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">서브 타이틀</label><input type="text" required value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">날짜 표시 (텍스트)</label><input type="text" required value={bannerForm.date} onChange={e => setBannerForm({...bannerForm, date: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">태그 문구</label><input type="text" required value={bannerForm.tag} onChange={e => setBannerForm({...bannerForm, tag: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">이미지 URL</label><input type="url" required value={bannerForm.image} onChange={e => setBannerForm({...bannerForm, image: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">연결 링크 (URL)</label><input type="url" required value={bannerForm.linkUrl} onChange={e => setBannerForm({...bannerForm, linkUrl: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2">
                <label className="font-black text-lg">배경 색상</label>
                <select value={bannerForm.bgColor} onChange={e => setBannerForm({...bannerForm, bgColor: e.target.value})} className="border-4 border-black p-3 font-bold outline-none cursor-pointer">
                  <option value="bg-lime-300">연두색 (Lime)</option><option value="bg-cyan-300">하늘색 (Cyan)</option><option value="bg-pink-300">핑크색 (Pink)</option><option value="bg-yellow-300">노란색 (Yellow)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="bg-lime-400 text-black border-4 border-black py-4 font-black text-xl brutal-shadow-sm hover:bg-lime-500 transition-all mt-4">배너 추가하기 📺</button>
          </form>

          <h2 className="text-xl font-black mb-4">등록된 배너 목록 ({banners.length}개)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.length === 0 ? <p className="font-bold text-gray-500">등록된 배너가 없습니다.</p> : banners.map(banner => (
              <div key={banner.id} className={`${banner.bgColor} border-4 border-black p-4 flex justify-between items-center brutal-shadow-sm`}>
                <div><p className="font-black text-lg">{banner.title}</p><p className="text-sm font-bold opacity-70">{banner.date}</p></div>
                <button onClick={() => deleteBanner(banner.id)} className="bg-red-500 text-white font-black px-4 py-2 border-4 border-black hover:bg-red-600 transition-colors">삭제</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'event' && (
        <section className="animate-fade-in">
          <h2 className="text-2xl font-black mb-6 bg-white border-4 border-black inline-block px-4 py-2 transform rotate-1">🗓️ 행사 일정 등록</h2>
          <form onSubmit={handleEventSubmit} className="bg-white border-4 border-black p-6 md:p-10 brutal-shadow flex flex-col gap-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2"><label className="font-black text-lg">행사명</label><input type="text" required value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2">
                <label className="font-black text-lg">카테고리</label>
                <select value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value as EventCategory})} className="border-4 border-black p-3 font-bold outline-none cursor-pointer">
                  <option value="subculture">서브컬처 행사</option><option value="game">게임 오프라인</option><option value="jpop">J-POP 내한</option>
                </select>
              </div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">장소</label><input type="text" required value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">이미지 URL</label><input type="url" required value={eventForm.image} onChange={e => setEventForm({...eventForm, image: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">연결 링크 (URL)</label><input type="url" required value={eventForm.linkUrl} onChange={e => setEventForm({...eventForm, linkUrl: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">시작 날짜</label><input type="date" required value={eventForm.startDate} onChange={e => setEventForm({...eventForm, startDate: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2"><label className="font-black text-lg">종료 날짜</label><input type="date" required value={eventForm.endDate} onChange={e => setEventForm({...eventForm, endDate: e.target.value})} className="border-4 border-black p-3 font-bold outline-none" /></div>
              <div className="flex flex-col gap-2">
                <label className="font-black text-lg">태그 색상</label>
                <select value={eventForm.tagColor} onChange={e => setEventForm({...eventForm, tagColor: e.target.value})} className="border-4 border-black p-3 font-bold outline-none cursor-pointer">
                  <option value="bg-yellow-300">노란색 (Yellow)</option><option value="bg-pink-300">핑크색 (Pink)</option><option value="bg-cyan-300">하늘색 (Cyan)</option><option value="bg-lime-300">연두색 (Lime)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="bg-pink-400 text-black border-4 border-black py-4 font-black text-xl brutal-shadow-sm hover:bg-pink-500 transition-all mt-4">행사 등록하기 🚀</button>
          </form>

          <h2 className="text-xl font-black mb-4">등록된 행사 목록 ({events.length}개)</h2>
          <div className="mt-4 flex flex-col gap-4">
            {events.length === 0 ? <p className="font-bold text-gray-500">등록된 행사가 없습니다.</p> : events.map(event => (
              <div key={event.id} className="bg-white border-4 border-black p-4 flex justify-between items-center brutal-shadow-sm">
                <div><span className={`px-2 py-1 border-2 border-black font-bold text-sm ${event.tagColor} mr-3`}>{event.category}</span><span className="font-black text-lg">{event.title}</span><span className="ml-4 font-bold text-gray-600 hidden md:inline-block">{event.startDate} ~ {event.endDate}</span></div>
                <button onClick={() => deleteEvent(event.id)} className="bg-red-500 text-white font-black px-4 py-2 border-4 border-black hover:bg-red-600 transition-colors">삭제</button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default AdminPage;