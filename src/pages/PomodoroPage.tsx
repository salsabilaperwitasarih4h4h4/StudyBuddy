import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Eye, Sparkles, Droplets } from 'lucide-react';

interface PomodoroPageProps {
  mode: 'focus25' | 'break5' | 'break10';
  timeLeft: number;
  isRunning: boolean;
  activeInstrument: string | null;
  volume: number;
  sensorEnabled: boolean;
  flowerCount: number;
  showCelebration: boolean;
  onModeChange: (newMode: 'focus25' | 'break5' | 'break10') => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onInstrumentToggle: (id: 'piano' | 'guitar' | 'lofi' | 'cello') => void;
  onVolumeChange: (vol: number) => void;
  onToggleSensor: () => void;
  onCloseCelebration: () => void;
}

interface InstrumentOption {
  id: 'piano' | 'guitar' | 'lofi' | 'cello';
  title: string;
  desc: string;
  icon: string;
}

const INSTRUMENTS: InstrumentOption[] = [
  {
    id: 'piano',
    title: 'Piano Klasik Belajar',
    desc: 'Melodi tuts piano lembut yang menenangkan',
    icon: '🎹'
  },
  {
    id: 'guitar',
    title: 'Petikan Gitar Akustik',
    desc: 'Fingerstyle santai penunjang konsentrasi',
    icon: '🎸'
  },
  {
    id: 'lofi',
    title: 'Lofi Chill Study',
    desc: 'Rhodes hangat dengan tempo santai',
    icon: '🎧'
  },
  {
    id: 'cello',
    title: 'Cello & Biola Lembut',
    desc: 'Harmoni gesekan senar string damai',
    icon: '🎻'
  }
];

export const PomodoroPage: React.FC<PomodoroPageProps> = ({
  mode,
  timeLeft,
  isRunning,
  activeInstrument,
  volume,
  sensorEnabled,
  flowerCount,
  showCelebration,
  onModeChange,
  onToggleTimer,
  onResetTimer,
  onInstrumentToggle,
  onVolumeChange,
  onToggleSensor,
  onCloseCelebration
}) => {
  const getInitialSeconds = (m: 'focus25' | 'break5' | 'break10'): number => {
    switch (m) {
      case 'focus25':
        return 25 * 60;
      case 'break5':
        return 5 * 60;
      case 'break10':
        return 10 * 60;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Circular progress calculation
  const totalSeconds = getInitialSeconds(mode);
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Main Focus Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">
              MODE FOKUS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162B20] mt-0.5">
              Pelan-pelan, tapi selesai.
            </h2>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-[#F2EFE8] p-1.5 rounded-2xl self-start sm:self-center">
            <button
              onClick={() => onModeChange('focus25')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'focus25'
                  ? 'bg-[#162B20] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Fokus 25m
            </button>
            <button
              onClick={() => onModeChange('break5')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'break5'
                  ? 'bg-[#162B20] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Break 5m
            </button>
            <button
              onClick={() => onModeChange('break10')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'break10'
                  ? 'bg-[#162B20] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Break 10m
            </button>
          </div>
        </div>

        {/* Real-time plant watering notice when timer is running */}
        {isRunning && mode === 'focus25' && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span className="font-semibold">
                Tanaman Sedang Disiram Otomatis:
              </span>
              <span className="hidden sm:inline">Setiap detik fokusmu menjaga tanaman tetap segar dan menumbuhkan bunga!</span>
            </div>
            <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-300">
              🌸 {flowerCount} Bunga Mekar
            </span>
          </div>
        )}

        {/* Circular Timer Display */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
              {/* Background track circle */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                className="text-[#EFECE4]"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                className="text-[#1E3F2B] transition-all duration-500 ease-linear"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Center Time Details */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-1">
                {mode === 'focus25' ? 'FOKUS' : 'ISTIRAHAT'}
              </span>
              <span className="text-5xl sm:text-6xl font-black text-[#162B20] tracking-tight tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs text-stone-400 mt-2 font-medium flex items-center gap-1.5">
                {isRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Timer Aktif Berjalan di Latar</span>
                  </>
                ) : (
                  <span>○ Dijeda</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onToggleTimer}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#1E3F2B] hover:bg-[#163323] text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Jeda Fokus</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Mulai fokus</span>
                </>
              )}
            </button>

            <button
              onClick={onResetTimer}
              className="px-4 py-3.5 rounded-2xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Reset ke waktu awal"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sensor Deteksi Keluar Web Card */}
      <div className="bg-[#162B20] text-white rounded-3xl p-5 sm:p-6 border border-[#234232] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#234232] flex items-center justify-center text-emerald-400 shrink-0">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Sensor Deteksi Keluar Web</span>
            </h3>
            <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
              Saat kamu keluar atau ganti tab, sensor akan berbunyi terus sampai dimatikan sendiri.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleSensor}
          className={`self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            sensorEnabled
              ? 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-xs'
              : 'bg-stone-700 hover:bg-stone-600 text-stone-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${sensorEnabled ? 'bg-black animate-ping' : 'bg-stone-400'}`} />
          <span>{sensorEnabled ? 'Sensor Aktif •' : 'Sensor Mati'}</span>
        </button>
      </div>

      {/* Instrumen Musik Belajar Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#162B20]">
              Instrumen Musik Belajar
            </h3>
            <p className="text-xs text-stone-500">
              Instrumen tenang pengiring konsentrasi belajar Pomodoro (Piano, Gitar Akustik, Lofi, Cello).
            </p>
          </div>

          {/* Volume slider */}
          {activeInstrument && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#DFD7CB] shadow-2xs self-start">
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-800" />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-[#1E3F2B] cursor-pointer"
              />
              <span className="text-[11px] font-bold text-stone-600 w-7">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INSTRUMENTS.map((inst) => {
            const isThisPlaying = activeInstrument === inst.id;
            return (
              <div
                key={inst.id}
                onClick={() => onInstrumentToggle(inst.id)}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer group flex items-start gap-4 select-none ${
                  isThisPlaying
                    ? 'bg-[#1E3F2B] text-white border-[#1E3F2B] shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-[#5C7E6C]/90 hover:bg-[#527361] text-white border-transparent'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {inst.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm sm:text-base font-bold truncate">
                      {inst.title}
                    </h4>
                    {isThisPlaying && (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        Main
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">
                    {inst.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Celebration Modal when finished */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 text-center shadow-2xl border-2 border-emerald-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
              🎉
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Sesi Fokus 25 Menit Selesai!
            </span>
            <h3 className="text-2xl font-bold text-[#162B20] mt-3 mb-2">
              Luar Biasa, Kamu Hebat! 🌟
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
              25 menit fokus penuh telah tercatat. Tanaman belajarmu otomatis tersiram dan makin berbunga hari ini!
            </p>
            <button
              onClick={onCloseCelebration}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1E3F2B] hover:bg-[#163323] text-white font-semibold shadow-md cursor-pointer"
            >
              Ambil Istirahat 5 Menit ☕
            </button>
          </div>
        </div>
      )}

      {/* Footer Quote */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-4 text-center text-xs text-[#44554B] italic flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>"Tidak perlu sempurna. Hadir dan mulai dulu saja."</span>
      </div>
    </div>
  );
};
