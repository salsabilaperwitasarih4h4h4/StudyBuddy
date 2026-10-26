import React from 'react';
import { PageType } from '../types';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

interface MainMenuPageProps {
  onNavigate: (page: PageType) => void;
}

interface MenuCardItem {
  id: PageType;
  pillsLabel: string;
  emoji: string;
  title: string;
  subheading: string;
  desc: string;
}

const MENU_ITEMS: MenuCardItem[] = [
  {
    id: 'pomodoro',
    pillsLabel: 'PILIHAN 1',
    emoji: '🍅',
    title: 'Fokus Pomodoro',
    subheading: 'Waktu Belajar 25 Menit & Break 5 Menit',
    desc: 'Atur ritme fokus teratur dengan hitungan mundur 25:00 dan istirahat 5:00 / 10:00, dilengkapi audio musik instrumen suasana relaksasi.'
  },
  {
    id: 'alarm',
    pillsLabel: 'PILIHAN 2',
    emoji: '⏰',
    title: 'Alarm Tugas',
    subheading: 'Pengingat Tugas dengan Bunyi Alarm Nyata',
    desc: 'Pasang judul alarm dan waktu tenggat. Alarm bersuara nyata akan otomatis berdering nyaring saat jadwal tiba.'
  },
  {
    id: 'calendar',
    pillsLabel: 'PILIHAN 3',
    emoji: '📅',
    title: 'Kalender Tugas',
    subheading: 'Pantau Tugas Apa Dikumpulkan Hari Apa',
    desc: 'Kalender interaktif untuk mencatat tenggat tugas mata kuliah agar jadwal pengumpulan selalu terorganisir rapi.'
  },
  {
    id: 'notes',
    pillsLabel: 'PILIHAN 4',
    emoji: '📝',
    title: 'Catatan Materi',
    subheading: 'Catat Poin Dosen & Unggah Hingga 5 Berkas',
    desc: 'Simpan ringkasan kuliah penting dari dosen dan lampirkan hingga 5 file materi (PDF, slide, gambar) dalam sekali unggah.'
  },
  {
    id: 'dashboard',
    pillsLabel: 'PILIHAN 5',
    emoji: '📊',
    title: 'Dashboard Belajar',
    subheading: 'Pantau Kegiatan & Ritme Belajar Tiap Bulan',
    desc: 'Lacak total menit fokus, sesi selesai, keaktifan hari, serta grafik batang ritme belajar harian dan bulanan.'
  },
  {
    id: 'achievements',
    pillsLabel: 'PILIHAN 6',
    emoji: '🌱',
    title: 'Pencapaian & Tanaman',
    subheading: 'Apresiasi Motivasi & Rawat Tanaman Virtual',
    desc: 'Dapatkan apresiasi friendly dan rawat tanaman belajarmu: hijau tumbuh jika konsisten, layu jika jarang, dan mati jika tidak belajar.'
  }
];

export const MainMenuPage: React.FC<MainMenuPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
            HALAMAN MENU UTAMA
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162B20] tracking-tight">
            Pilih Ruang Belajarmu Hari Ini
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Klik salah satu elemen di bawah untuk masuk ke halaman khusus
          </p>
        </div>

        <button
          onClick={() => onNavigate('guide')}
          className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#DFD7CB] text-xs font-semibold text-[#1E3F2B] hover:bg-stone-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Lihat Buku Panduan</span>
        </button>
      </div>

      {/* 6 Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3DDD2] hover:border-[#1E3F2B]/60 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between active:scale-[0.99] relative"
          >
            <div>
              {/* Header inside card */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl select-none group-hover:scale-110 transition-transform inline-block">
                  {item.emoji}
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#F0EDE4] text-stone-600">
                  {item.pillsLabel}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#1A2820] group-hover:text-[#1E3F2B] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                {item.subheading}
              </p>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>

            {/* Bottom button */}
            <div className="pt-4 mt-4 border-t border-[#F3EFE7] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1E3F2B]">
                Buka Halaman Khusus
              </span>
              <div className="w-7 h-7 rounded-full bg-[#1E3F2B] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Banner */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-4 text-center text-xs text-[#44554B] italic flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>"Tidak perlu terburu-buru. Fokus pada satu sesi kecil saat ini, dan biarkan kebiasaan baikmu bertumbuh alami."</span>
      </div>
    </div>
  );
};
