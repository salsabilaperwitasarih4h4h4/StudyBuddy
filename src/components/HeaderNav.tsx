import React from 'react';
import { PageType, UserProfile } from '../types';
import { BookOpen, Radio, ArrowLeft, Home, LogOut, Clock, Pause, Play, Music, VolumeX } from 'lucide-react';

interface HeaderNavProps {
  currentPage: PageType;
  user: UserProfile | null;
  sensorEnabled: boolean;
  onToggleSensor: () => void;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
  // Timer & Audio global state
  isTimerRunning?: boolean;
  timerSecondsLeft?: number;
  timerMode?: string;
  onToggleTimer?: () => void;
  isInstrumentPlaying?: boolean;
  activeInstrumentName?: string | null;
  onToggleInstrument?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentPage,
  user,
  sensorEnabled,
  onToggleSensor,
  onNavigate,
  onLogout,
  isTimerRunning = false,
  timerSecondsLeft = 25 * 60,
  timerMode = 'focus25',
  onToggleTimer,
  isInstrumentPlaying = false,
  activeInstrumentName = null,
  onToggleInstrument
}) => {
  const isSubPage = ['pomodoro', 'alarm', 'calendar', 'notes', 'dashboard', 'achievements'].includes(currentPage);

  const formatMinSec = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="w-full max-w-4xl mx-auto pt-4 px-4 sm:px-6">
      {/* Upper action bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 text-xs sm:text-sm">
        {/* Left navigation crumbs */}
        <div className="flex items-center gap-2">
          {currentPage !== 'login' && currentPage !== 'nav' && (
            <button
              onClick={() => onNavigate('nav')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#2B3E33] border border-[#E3DDD2] shadow-xs transition-all font-medium active:scale-95 cursor-pointer"
              title="Kembali ke Portal Halaman Awal"
            >
              <Home className="w-3.5 h-3.5 text-[#1E3F2B]" />
              <span>Portal</span>
            </button>
          )}

          {isSubPage && (
            <button
              onClick={() => onNavigate('menu')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E3F2B] text-white hover:bg-[#163323] border border-[#163323] shadow-xs transition-all font-medium active:scale-95 cursor-pointer"
              title="Kembali ke Menu Utama 6 Pilihan"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Menu Utama</span>
            </button>
          )}
        </div>

        {/* Right utility buttons: Sensor, Panduan, Profile */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Sensor button toggle */}
          <button
            onClick={onToggleSensor}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xs transition-all font-medium active:scale-95 cursor-pointer ${
              sensorEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}
            title="Deteksi jika tab ditinggalkan saat belajar"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                sensorEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
              }`}
            />
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sensor</span>
            <span>{sensorEnabled ? 'Aktif' : 'Mati'}</span>
          </button>

          {/* Buku Panduan button */}
          <button
            onClick={() => onNavigate('guide')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xs transition-all font-medium active:scale-95 cursor-pointer ${
              currentPage === 'guide'
                ? 'bg-[#1E3F2B] text-white border-[#1E3F2B]'
                : 'bg-white/90 text-[#2B3E33] border-[#E3DDD2] hover:bg-white'
            }`}
            title="Buka Buku Panduan Penggunaan"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Panduan</span>
          </button>

          {/* User profile / Logout */}
          {user && user.isLoggedIn && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[#2B3E33] border border-[#E3DDD2] shadow-xs hover:bg-stone-50 transition-all font-medium cursor-pointer"
              title="Klik untuk Keluar / Ganti Akun"
            >
              <span className="text-sm">{user.avatar || '🎓'}</span>
              <span className="max-w-[90px] sm:max-w-[120px] truncate text-xs sm:text-sm font-semibold">
                {user.name || 'Pengguna'}
              </span>
              <LogOut className="w-3 h-3 text-stone-400 hover:text-red-500 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Persistent Active Background Timer & Music Banner (when not on Pomodoro page) */}
      {(isTimerRunning || isInstrumentPlaying) && currentPage !== 'pomodoro' && (
        <div className="mb-3 w-full bg-[#1E3F2B] text-white rounded-2xl px-4 py-2.5 shadow-sm border border-emerald-800 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            {isTimerRunning && (
              <div 
                onClick={() => onNavigate('pomodoro')}
                className="flex items-center gap-2 cursor-pointer hover:underline"
                title="Buka halaman Pomodoro"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-700/80 flex items-center justify-center text-sm">
                  🍅
                </div>
                <div className="text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                    <span>Timer Nyala: {formatMinSec(timerSecondsLeft)}</span>
                  </div>
                  <span className="text-[10px] text-emerald-200">
                    {timerMode === 'focus25' ? 'Sesi Fokus 25m' : 'Istirahat'} (Klik untuk buka)
                  </span>
                </div>
              </div>
            )}

            {isInstrumentPlaying && (
              <div className="flex items-center gap-1.5 text-xs text-amber-200 border-l border-emerald-700/60 pl-3">
                <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="hidden sm:inline font-medium">Musik:</span>
                <span className="font-bold capitalize">{activeInstrumentName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {isTimerRunning && onToggleTimer && (
              <button
                onClick={onToggleTimer}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Pause className="w-3 h-3" />
                <span>Jeda</span>
              </button>
            )}

            {isInstrumentPlaying && onToggleInstrument && (
              <button
                onClick={onToggleInstrument}
                className="px-2.5 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Matikan musik"
              >
                <VolumeX className="w-3 h-3" />
                <span>Hening</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('pomodoro')}
              className="px-3 py-1 rounded-lg bg-white text-[#162B20] text-[11px] font-bold hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              Lihat Timer →
            </button>
          </div>
        </div>
      )}

      {/* Main StudyBuddy Brand Card Header */}
      <div className="w-full bg-[#162B20] text-white rounded-2xl sm:rounded-3xl px-5 sm:px-7 py-3 sm:py-4 shadow-sm flex items-center justify-between border border-[#213C2E]">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-emerald-300 uppercase block mb-0.5">
            R U A N G &nbsp; F O K U S M U
          </span>
          <h1
            onClick={() => onNavigate(user?.isLoggedIn ? 'nav' : 'login')}
            className="text-xl sm:text-2xl font-bold tracking-tight text-white cursor-pointer flex items-center gap-2 hover:opacity-90"
          >
            <span>StudyBuddy</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-200/90 bg-[#1F392B] px-3 py-1.5 rounded-full border border-emerald-900/40">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-medium">siap menemani</span>
        </div>
      </div>
    </header>
  );
};
