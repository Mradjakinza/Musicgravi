
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Song, AdminSection, AppConfig, UserProfile, View, Playlist } from './types';
import { mockSongs } from './services/mockData';

interface AdminStore {
  activeSection: AdminSection;
  queue: Song[];
  users: UserProfile[];
  config: AppConfig;
  logs: string[];
  
  setActiveSection: (section: AdminSection) => void;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateUserStatus: (id: string, status: UserProfile['status']) => void;
  addLog: (entry: string) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      activeSection: 'dashboard',
      queue: mockSongs,
      users: [
        { id: 'u1', name: 'John Doe', email: 'john@example.com', tier: 'Premium', status: 'Active', lastSeen: '2 mins ago' },
        { id: 'u2', name: 'Alice Smith', email: 'alice@web.com', tier: 'Free', status: 'Active', lastSeen: '1 hour ago' },
        { id: 'u3', name: 'Hacker X', email: 'x@shadow.net', tier: 'Free', status: 'Flagged', lastSeen: 'Just now' },
      ],
      config: {
        platformName: 'GRAVICORE',
        primaryColor: '#2dd4bf',
        secondaryColor: '#8b5cf6',
        maintenanceMode: false,
        logRetentionDays: 30,
        maxUploadSizeMb: 50,
        enableKaraoke: true
      },
      logs: [
        '[SYSTEM] Boot sequence initialized.',
        '[AUTH] Admin login successful from 192.168.1.1',
        '[NETWORK] Load balancer distributed 4k requests.'
      ],

      setActiveSection: (activeSection) => set({ activeSection }),
      updateSong: (id, updates) => set((state) => ({
        queue: state.queue.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteSong: (id) => set((state) => ({
        queue: state.queue.filter(s => s.id !== id)
      })),
      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates }
      })),
      updateUserStatus: (id, status) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, status } : u)
      })),
      addLog: (entry) => set((state) => ({
        logs: [`[${new Date().toLocaleTimeString()}] ${entry}`, ...state.logs].slice(0, 50)
      })),
    }),
    {
      name: 'gravicore-admin-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface MusicStore {
  activeView: View;
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isHiRes: boolean;
  isSpatial: boolean;
  playbackSpeed: number;
  progress: number;
  showLyrics: boolean;
  energyFilter: { x: number; y: number };
  queue: Song[];
  playlists: Playlist[];
  config: AppConfig;
  currentLyricIndex: number;

  setActiveView: (view: View) => void;
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  toggleHiRes: () => void;
  toggleSpatial: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setProgress: (progress: number) => void;
  toggleLyrics: () => void;
  setEnergyFilter: (filter: { x: number; y: number }) => void;
  nextSong: () => void;
  prevSong: () => void;
  addSong: (song: Song) => void;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  updateConfig: (updates: Partial<AppConfig>) => void;
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      activeView: 'discovery',
      currentSong: mockSongs[0],
      isPlaying: false,
      volume: 0.8,
      isHiRes: false,
      isSpatial: false,
      playbackSpeed: 1.0,
      progress: 0,
      showLyrics: false,
      energyFilter: { x: 0.5, y: 0.5 },
      queue: mockSongs,
      playlists: [
        { id: 'p1', name: 'Late Night Vibes', isCollaborative: true, collaborators: ['u1', 'u2'] }
      ],
      config: {
        platformName: 'GRAVICORE',
        primaryColor: '#2dd4bf',
        secondaryColor: '#8b5cf6',
        maintenanceMode: false,
        logRetentionDays: 30,
        maxUploadSizeMb: 50,
        enableKaraoke: true
      },
      currentLyricIndex: -1,

      setActiveView: (activeView) => set({ activeView }),
      setCurrentSong: (currentSong) => set({ currentSong, progress: 0, currentLyricIndex: -1 }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      toggleHiRes: () => set((state) => ({ isHiRes: !state.isHiRes })),
      toggleSpatial: () => set((state) => ({ isSpatial: !state.isSpatial })),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setProgress: (progress) => {
        const { currentSong } = get();
        let index = -1;
        if (currentSong?.lyrics) {
          index = currentSong.lyrics.findLastIndex(l => l.time <= progress);
        }
        set({ progress, currentLyricIndex: index });
      },
      toggleLyrics: () => set((state) => ({ showLyrics: !state.showLyrics })),
      setEnergyFilter: (energyFilter) => set({ energyFilter }),
      nextSong: () => {
        const { queue, currentSong } = get();
        const index = queue.findIndex(s => s.id === currentSong?.id);
        const next = queue[(index + 1) % queue.length];
        set({ currentSong: next, progress: 0, currentLyricIndex: -1 });
      },
      prevSong: () => {
        const { queue, currentSong } = get();
        const index = queue.findIndex(s => s.id === currentSong?.id);
        const prev = queue[(index - 1 + queue.length) % queue.length];
        set({ currentSong: prev, progress: 0, currentLyricIndex: -1 });
      },
      addSong: (song) => set((state) => ({ queue: [...state.queue, song] })),
      updateSong: (id, updates) => set((state) => ({
        queue: state.queue.map(s => s.id === id ? { ...s, ...updates } : s),
        currentSong: state.currentSong?.id === id ? { ...state.currentSong, ...updates } : state.currentSong
      })),
      deleteSong: (id) => set((state) => ({
        queue: state.queue.filter(s => s.id !== id)
      })),
      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates }
      })),
    }),
    {
      name: 'gravicore-music-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
