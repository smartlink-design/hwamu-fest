import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppEvent, HeroBanner } from '../types';
import { supabase } from '../supabase';

interface EventContextType {
  events: AppEvent[];
  addEvent: (event: AppEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  banners: HeroBanner[];
  addBanner: (banner: HeroBanner) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
}

export const EventContext = createContext<EventContextType>({
  events: [], addEvent: async () => {}, deleteEvent: async () => {},
  banners: [], addBanner: async () => {}, deleteBanner: async () => {},
});

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);

  const fetchEvents = async () => {
    const { data } = await supabase.from('events').select('*');
    if (data) setEvents(data as AppEvent[]);
  };

  const fetchBanners = async () => {
    const { data } = await supabase.from('banners').select('*');
    if (data) setBanners(data as HeroBanner[]);
  };

  useEffect(() => {
    fetchEvents();
    fetchBanners();
  }, []);

  const addEvent = async (event: AppEvent) => {
    await supabase.from('events').insert([event]);
    fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id);
    fetchEvents();
  };

  const addBanner = async (banner: HeroBanner) => {
    // 바로 이 부분 대문자 S를 소문자 s로 고쳤습니다!
    await supabase.from('banners').insert([banner]);
    fetchBanners();
  };

  const deleteBanner = async (id: string) => {
    await supabase.from('banners').delete().eq('id', id);
    fetchBanners();
  };

  return (
    <EventContext.Provider value={{ events, addEvent, deleteEvent, banners, addBanner, deleteBanner }}>
      {children}
    </EventContext.Provider>
  );
};