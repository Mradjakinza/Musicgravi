
import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VerticalPlayer from './components/VerticalPlayer';
import MainView from './components/MainView';
import GraviStudio from './components/GraviStudio';
import AudioEngine from './components/AudioEngine';
import LyricsView from './components/LyricsView';
import { useMusicStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';

const App: React.FC = () => {
  const { activeView, currentSong, showLyrics, config } = useMusicStore();

  useEffect(() => {
    // Dynamic Branding Injection
    document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
  }, [config]);

  const renderContent = () => {
    switch (activeView) {
      case 'discovery': return <MainView />;
      case 'studio': return <GraviStudio />;
      default: return <MainView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#011618] text-white">
      <AudioEngine />
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Global Mini-Player Footer Overlay (Mobile Optimized) */}
        {currentSong && (
          <div className="md:hidden glass-panel fixed bottom-0 left-0 right-0 p-4 border-t border-white/10 flex items-center gap-4 z-30">
             <img src={currentSong.coverUrl} className="w-12 h-12 rounded-xl" />
             <div className="flex-1 min-w-0">
               <p className="font-bold truncate text-sm">{currentSong.title}</p>
               <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
             </div>
             <div className="flex items-center gap-4">
                <button className="text-white"><Play size={24} fill="white" /></button>
             </div>
          </div>
        )}

        <AnimatePresence>
          {showLyrics && config.enableKaraoke && <LyricsView />}
        </AnimatePresence>
      </main>

      <VerticalPlayer />

      {/* Aesthetic Overlays */}
      <div 
        className="pointer-events-none fixed inset-0 transition-opacity duration-1000" 
        style={{ 
          background: `linear-gradient(135deg, transparent, ${config.primaryColor}11)` 
        }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  );
};

export default App;
