
export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  energy: number;
  mood: number;
  bitrate: '320kbps' | '1411kbps';
  lyrics?: LyricLine[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  tier: 'Free' | 'Premium' | 'Admin';
  status: 'Active' | 'Flagged' | 'Banned';
  lastSeen: string;
}

export interface SystemMetric {
  time: string;
  cpu: number;
  ram: number;
  network: number;
}

export interface AppConfig {
  platformName: string;
  primaryColor: string;
  secondaryColor: string;
  maintenanceMode: boolean;
  logRetentionDays: number;
  maxUploadSizeMb: number;
  enableKaraoke: boolean;
}

export interface AnalyticsData {
  timestamp: string;
  listens: number;
  engagement: number;
}

export interface Playlist {
  id: string;
  name: string;
  isCollaborative: boolean;
  collaborators: string[];
}

export type AdminSection = 'dashboard' | 'assets' | 'users' | 'security' | 'settings' | 'console';

export type View = 'discovery' | 'search' | 'library' | 'studio';
