import React, { useState } from 'react';
import { PlantCondition, PlantState } from '../types';
import { PlantSvg } from '../components/PlantSvg';
import { Sparkles, RefreshCw, Flame, Heart, Sprout, Flower2, Droplets, CheckCircle2, Play } from 'lucide-react';

interface AchievementsPageProps {
  plant: PlantState;
  isTimerRunning?: boolean;
  onNavigateToPomodoro?: () => void;
  onUpdatePlantCondition: (condition: PlantCondition) => void;
  onUpdateFlowerCount?: (count: number) => void;
}

const FRIENDLY_QUOTES = [
  {
    title: 'Konsisten itu keren.',
    text: 'Tidak apa-apa kalau sempat berhenti. Mulai lagi dari 25 menit kecil hari ini—setiap langkah kecil bisa menghidupkan ritmemu kembali.'
  },
  {
    title: 'Kamu berproses setiap hari!',
    text: 'Menghabiskan satu sesi Pomodoro tanpa distraksi adalah kemenangan nyata. Jangan bandingkan dirimu dengan orang lain, rayakan setiap usahamu.'
  },
  {
    title: 'Pelan-pelan asal tuntas.',
    text: 'Skripsi dan tugas menumpuk diselesaikan kalimat demi kalimat. Istirahat sejenak, nikmati prosesnya, dan kembali dengan kepala jernih.'
  },
  {
    title: 'Bangga pada dirimu sendiri!',
    text: 'Duduk belajar ketika terasa berat butuh keberanian besar. Tanamamu menjadi saksi bahwa kamu tidak menyerah dengan impianmu.'
  },
  {
    title: 'Fokus adalah kekuatan supermu.',
    text: 'Dunia penuh notifikasi, tetapi kamu memilih untuk mengasah masa depanmu selama 25 menit. Itu bukti kedewasaan belajarmu!'
  }
];

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  plant,
  isTimerRunning = false,
  onNavigateToPomodoro,
  onUpdatePlantCondition,
  onUpdateFlowerCount
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % FRIENDLY_QUOTES.length);
  };

  const activeQuote = FRIENDLY_QUOTES[quoteIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Plant Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs text-center relative overflow-hidden">
        <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-3">
          T A N A M A N &nbsp; B E L A J A R M U
        </span>

        {/* Visual Plant Drawing with Flowers & Live Automated Watering */}
        <div className="my-3 flex flex-col items-center justify-center">
          <PlantSvg 
            condition={plant.condition} 
            flowerCount={plant.flowerCount || 0} 
            isWatering={isTimerRunning}
            size={200} 
          />

          {/* Plant status text */}
          <div className="mt-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#162B20] flex items-center justify-center gap-2">
              <span>
                {plant.condition === 'subur'
                  ? '🌿 Tumbuh subur & segar'
                  : plant.condition === 'layu'
                  ? '🍂 Daun mulai layu & menguning'
                  : '🥀 Tanaman kering & butuh belajar'}
              </span>
            </h3>

            {/* Flower Badge */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold">
              <Flower2 className="w-3.5 h-3.5" />
              <span>
                {plant.flowerCount === 0
                  ? 'Belum ada bunga mekar (Selesaikan 1 sesi Pomodoro untuk menumbuhkan bunga!)'
                  : `${plant.flowerCount} Bunga Mekar dari Konsistensi Belajar Pomodoro!`}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
              {plant.condition === 'subur'
                ? 'Tanamamu mekar berseri berkat rutinitas fokus Pomodoro! Tanaman ini tersiram dan tumbuh secara otomatis seiring kamu rajin belajar.'
                : plant.condition === 'layu'
                ? 'Tanamamu mulai haus karena jarang belajar Pomodoro. Nyalakan timer Pomodoro untuk menyiramnya kembali secara otomatis!'
                : 'Tanamamu layu karena sudah lama tidak belajar. Jangan berkecil hati, satu sesi Pomodoro akan langsung menghidupkannya kembali!'}
            </p>
          </div>
        </div>

        {/* 100% AUTOMATED POMODORO WATERING BANNER (NO MANUAL WATERING BUTTON) */}
        <div className="mt-6 pt-5 border-t border-[#F0ECE3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5] p-4.5 rounded-2xl border border-[#E8E2D6] text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
              <span className="text-sm font-extrabold text-[#162B20]">
                Streak Belajar: {plant.streakDays} Hari
              </span>
              <span className="text-xs text-emerald-800 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                {plant.totalPomodoros} Sesi Pomodoro
              </span>
            </div>
            <p className="text-xs text-stone-600 flex items-center gap-1.5 pt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                <strong>Tersiram & Tumbuh Otomatis:</strong> Tanaman dirawat murni melalui sesi belajar Pomodoro tanpa perlu disiram manual.
              </span>
            </p>
          </div>

          {/* Active status indicator / shortcut to Pomodoro */}
          {isTimerRunning ? (
            <div className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-2 shrink-0 animate-pulse">
              <Droplets className="w-4 h-4 text-emerald-700 animate-bounce" />
              <span>Sedang Disiram Otomatis...</span>
            </div>
          ) : (
            onNavigateToPomodoro && (
              <button
                onClick={onNavigateToPomodoro}
                className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#1E3F2B] hover:bg-[#163323] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Mulai Belajar Pomodoro</span>
              </button>
            )
          )}
        </div>

        {/* Plant Condition Simulation Switcher (as specified in Page 9) */}
        <div className="mt-6 pt-4 border-t border-[#F0ECE3] text-left">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-[#162B20] flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Simulasi Kondisi Tanaman:</span>
            </span>
            <span className="text-[11px] text-stone-400 font-medium">
              (Uji visual konsistensi)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => onUpdatePlantCondition('subur')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                plant.condition === 'subur'
                  ? 'bg-[#1E3F2B] text-white border-[#1E3F2B] shadow-xs'
                  : 'bg-white text-stone-700 border-[#DDD6C9] hover:bg-stone-50'
              }`}
            >
              <span>🌿 Konsisten (Subur)</span>
            </button>

            <button
              onClick={() => onUpdatePlantCondition('layu')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                plant.condition === 'layu'
                  ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                  : 'bg-white text-stone-700 border-[#DDD6C9] hover:bg-stone-50'
              }`}
            >
              <span>🍂 Jarang (Layu)</span>
            </button>

            <button
              onClick={() => onUpdatePlantCondition('mati')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                plant.condition === 'mati'
                  ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                  : 'bg-white text-stone-700 border-[#DDD6C9] hover:bg-stone-50'
              }`}
            >
              <span>🥀 Tidak Belajar (Mati)</span>
            </button>
          </div>

          {/* Test blooming flowers switcher */}
          {onUpdateFlowerCount && (
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-[11px] font-semibold text-stone-500">Uji Mekar Bunga:</span>
              {[0, 1, 2, 3, 5].map((cnt) => (
                <button
                  key={cnt}
                  onClick={() => onUpdateFlowerCount(cnt)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer transition-colors ${
                    plant.flowerCount === cnt
                      ? 'bg-pink-100 text-pink-800 border-pink-300 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  🌸 {cnt} Bunga
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rapatkan Barisan & Rayakan Proses Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
              RAYAIKAN PROSES
            </span>
            <h3 className="text-2xl font-bold text-[#162B20]">
              {activeQuote.title}
            </h3>
          </div>

          <button
            onClick={handleNextQuote}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#1E3F2B]" />
            <span>Kata Motivasi Lainnya</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-[#EEE8DC]">
          "{activeQuote.text}"
        </p>

        {/* 3 Highlight Cards matching Page 9 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold mb-2">
              🌟
            </div>
            <h4 className="text-xs font-bold text-amber-900">
              Mulai dulu
            </h4>
            <p className="text-[11px] text-amber-800/80 mt-1">
              Langkah pertama sudah kamu ambil
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold mb-2">
              🌱
            </div>
            <h4 className="text-xs font-bold text-emerald-900">
              Terus bertumbuh
            </h4>
            <p className="text-[11px] text-emerald-800/80 mt-1">
              Tanamamu mekar seiring ritmemu
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center text-sm font-bold mb-2">
              ⏳
            </div>
            <h4 className="text-xs font-bold text-orange-900">
              Jaga ritme
            </h4>
            <p className="text-[11px] text-orange-800/80 mt-1">
              Konsistensi lebih mulia dari kecepatan
            </p>
          </div>
        </div>
      </div>

      {/* pesan hangat */}
      <div className="bg-[#FAF8F5] border border-[#DDD6C8] rounded-3xl p-5 sm:p-6 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 fill-rose-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#162B20] mb-1">
            pesan hangat
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Tugas memang berat, tapi kamu tidak sendirian. Teman Belajar Pomodoro hadir untuk menemani setiap menit perjuanganmu. Beri dirimu apresiasi atas apa yang telah berhasil diselesaikan hari ini!
          </p>
        </div>
      </div>
    </div>
  );
};
