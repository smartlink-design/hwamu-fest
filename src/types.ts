export type EventCategory = 'subculture' | 'game' | 'jpop';

export interface AppEvent {
  id: string;
  title: string;
  category: EventCategory;
  location: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
  image: string;
  tagColor: string;
  linkUrl: string;   // 행사를 눌렀을 때 이동할 링크 추가
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  tag: string;
  bgColor: string;
  linkUrl: string;   // 배너를 눌렀을 때 이동할 링크 추가
}