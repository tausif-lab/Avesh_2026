export type EventCategory = 
  | 'all'
  | 'coding'
  | 'robotics'
  | 'gaming'
  | 'creative'
  | 'cultural';

export interface TechEvent {
  id: string;
  title: string;
  category: EventCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  prizePool: string;
  teamSize: string;
  entryFee: string;
  venue: string;
  scheduleTime: string;
  day: 'Day 1' | 'Day 2' | 'Day 3' | 'Day 4';
  highlights: string[];
  rules: string[];
  featured?: boolean;
  registrationLink?: string;
  guidelinesLink?: string;
  cgitOnly?: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  category: string;
  venue: string;
  day: 1 | 2 | 3 | 4;
  speakerOrHost?: string;
}

export interface Sponsor {
  name: string;
  tier: 'Title Partner' | 'Powered By' | 'Associate Partner' | 'Community';
  domain: string;
  iconName: string;
}
