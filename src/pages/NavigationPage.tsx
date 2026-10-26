import React from 'react';
import { PageType, UserProfile } from '../types';
import { LayoutGrid, BookOpen, ArrowRight, Sparkles, UserX, Clock, Bell, Sprout } from 'lucide-react';

interface NavigationPageProps {
  user: UserProfile;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
}

export const NavigationPage: React.FC<NavigationPageProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Welcome Banner Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1E3F2B] text-white flex items-center justify-center text-2xl shadow-xs shrink-0">
              {user.avatar || '🎓'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  SELAMAT DATANG • Aktif
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A2820]">
                {user.name}
              </h2>
              <div className="text-xs text-stone-500 mt-0.5 flex flex-wrap items-center gap-x-2">
                <span>NIM/NISN: <strong className="text-stone-700">{user.nim || '-'}</strong></span>
                <span>•</span>
                <span>Universitas/sekolah: <strong className="text-stone-700">{user.university || '-'}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all cursor-pointer"
          >
            <UserX className="w-3.5 h-3.5" />
            <span>Ganti Akun</span>
          </button>
        </div>

        {/* Motivational quote strip */}
        <div className="mt-5 pt-4 border-t border-[#F0EBE1] flex items-center gap-2.5 text-xs text-stone-600 italic">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>"Setiap 25 menit fokus adalah hadiah berharga untuk masa depan belajamu. Mulai pelan-pelan hari ini."</span>
        </div>
      </div>

      {/* Two main navigation choices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Choice 1: Menu Utama */}
        <div
          onClick={() => onNavigate('menu')}
          className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E3DDD2] hover:border-[#1E3F2B]/60 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden active:scale-[0.99]"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] text-[#1E3F2B] flex items-center justify-center group-hover:scale-105 transition-transform">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#1E3F2B] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800">
                PILIHAN UTAMA
              </span>
              <h3 className="text-2xl font-bold text-[#1A2820] mt-1 group-hover:text-[#1E3F2B] transition-colors">
                Menu Utama
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
                Fokus Pomodoro, Alarm Tugas dengan audio, Kalender Tenggat, Catatan, Dashboard Bulanan, dan Pencapaian Belajar.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#F0EBE1] flex items-center text-xs sm:text-sm font-semibold text-[#1E3F2B] group-hover:translate-x-1 transition-transform">
            <span>Masuk ke Ruang Belajar</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Choice 2: Buku Panduan */}
        <div
          onClick={() => onNavigate('guide')}
          className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E3DDD2] hover:border-[#1E3F2B]/60 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden active:scale-[0.99]"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#1E3F2B] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800">
                PETUNJUK ALUR
              </span>
              <h3 className="text-2xl font-bold text-[#1A2820] mt-1 group-hover:text-[#1E3F2B] transition-colors">
                Buku Panduan
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
                panduan penggunaan fitur yang dilengkapi tanda panah penunjuk alur. Pelajari cara memanfaatkan teknik Pomodoro dan merawat tanaman belajamu.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#F0EBE1] flex items-center text-xs sm:text-sm font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">
            <span>Buka Visual Panduan</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      {/* Bottom feature pill badges */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-3.5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#4A5950] font-medium">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span>25m Belajar • 5m Break atau 10m</span>
        </div>
        <span className="text-stone-300 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-amber-700" />
          <span>Alarm Berbunyi Nyata</span>
        </div>
        <span className="text-stone-300 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tanaman Virtual Konsistensi</span>
        </div>
      </div>
    </div>
  );
};
