import React, { useState } from 'react';
import { PageType } from '../types';
import { 
  ArrowRight, ArrowDown, BookOpen, Clock, Bell, Calendar, 
  FileText, BarChart3, Sprout, ShieldCheck, CheckCircle2, 
  Sparkles, ExternalLink, Music, Radio
} from 'lucide-react';

interface GuideBookPageProps {
  onNavigate: (page: PageType) => void;
}

export const GuideBookPage: React.FC<GuideBookPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'pomodoro' | 'plant' | 'sensor'>('flow');

  const FLOW_STEPS = [
    {
      step: '01',
      emoji: '🎓',
      title: 'Masuk & Tetapkan Ruang Fokus',
      desc: 'Masukkan nama, email kampus, NIM, kampus, dan avatar belajarmu. Profil tersimpan aman di browser (Local Storage) tanpa perlu mendaftar ulang.',
      pageTarget: 'login' as PageType,
      actionText: 'Lihat Profil'
    },
    {
      step: '02',
      emoji: '🍅',
      title: 'Mulai Sesi Fokus Pomodoro 25 Menit',
      desc: 'Pilih waktu fokus 25 menit dan istirahat 5 atau 10 menit. Pilih instrumen musik yang menenangkan (Piano, Gitar, Lofi, Cello) untuk membantumu masuk ke deep work.',
      pageTarget: 'pomodoro' as PageType,
      actionText: 'Buka Pomodoro'
    },
    {
      step: '03',
      emoji: '📡',
      title: 'Aktifkan Sensor Deteksi Keluar Web',
      desc: 'Nyalakan sensor deteksi. Jika kamu tergoda membuka tab lain atau media sosial saat belajar, alarm sensor akan otomatis berbunyi sampai kamu kembali fokus.',
      pageTarget: 'pomodoro' as PageType,
      actionText: 'Atur Sensor'
    },
    {
      step: '04',
      emoji: '⏰',
      title: 'Pasang Alarm Pengingat Tugas Nyata',
      desc: 'Ketik judul tugas dan tentukan tanggal & jam tenggat. Pilih jenis nada dering (Lonceng Melodik, Digital Klasik, atau Nada Lembut) yang berbunyi nyata saat waktunya tiba.',
      pageTarget: 'alarm' as PageType,
      actionText: 'Pasang Alarm'
    },
    {
      step: '05',
      emoji: '📅',
      title: 'Pantau Jadwal Kalender & Catat Materi',
      desc: 'Cek tugas apa yang harus dikumpulkan hari apa. Tulis catatan penting dari dosen dan lampirkan maksimal 5 berkas materi kuliah dalam sekali simpan.',
      pageTarget: 'calendar' as PageType,
      actionText: 'Buka Kalender'
    },
    {
      step: '06',
      emoji: '🌱',
      title: 'Tanaman Tumbuh Otomatis & Cek Dashboard',
      desc: 'Jangan khawatir menumbuhkan tanaman secara manual! Tanamanmu otomatis disiram dan mekar subur setiap kali kamu menyelesaikan 25 menit fokus Pomodoro.',
      pageTarget: 'achievements' as PageType,
      actionText: 'Lihat Tanaman'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
              PETUNJUK ALUR LENGKAP
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162B20]">
              Buku Panduan StudyBuddy
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl leading-relaxed">
              Visualisasi alur langkah belajar cerdas: Pomodoro 25 menit, alarm berbunyi nyata, kalender tenggat, catatan dosen, hingga merawat tanaman konsistensi belajarmu.
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#1E3F2B] text-white text-xs font-bold hover:bg-[#163323] shadow-xs cursor-pointer"
          >
            <span>Masuk ke Menu Utama</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-[#F0ECE3]">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'flow'
                ? 'bg-[#162B20] text-white shadow-xs'
                : 'bg-[#F2EFE8] text-stone-600 hover:text-stone-900'
            }`}
          >
            Alur Langkah (Flowchart)
          </button>
          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pomodoro'
                ? 'bg-[#162B20] text-white shadow-xs'
                : 'bg-[#F2EFE8] text-stone-600 hover:text-stone-900'
            }`}
          >
            Teknik Pomodoro 25/5
          </button>
          <button
            onClick={() => setActiveTab('plant')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'plant'
                ? 'bg-[#162B20] text-white shadow-xs'
                : 'bg-[#F2EFE8] text-stone-600 hover:text-stone-900'
            }`}
          >
            Tanaman Konsistensi
          </button>
          <button
            onClick={() => setActiveTab('sensor')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sensor'
                ? 'bg-[#162B20] text-white shadow-xs'
                : 'bg-[#F2EFE8] text-stone-600 hover:text-stone-900'
            }`}
          >
            Sensor Keluar Tab
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'flow' && (
        <div className="space-y-4">
          {FLOW_STEPS.map((item, index) => {
            const isLast = index === FLOW_STEPS.length - 1;

            return (
              <div key={item.step} className="space-y-4">
                {/* Step Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#E3DDD2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#1E3F2B]/60 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF2EC] text-[#1E3F2B] flex items-center justify-center text-xl shrink-0 font-extrabold shadow-2xs">
                      {item.emoji}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          LANGKAH {item.step}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#162B20]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(item.pageTarget)}
                    className="self-end sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:bg-stone-100 text-xs font-semibold text-[#1E3F2B] transition-all cursor-pointer shrink-0"
                  >
                    <span>{item.actionText}</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </button>
                </div>

                {/* Directional Down Arrow between Steps */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center my-1">
                    <div className="w-0.5 h-3 bg-[#D6CEBF]" />
                    <div className="w-7 h-7 rounded-full bg-[#EFECE4] border border-[#DCD5C6] flex items-center justify-center text-stone-600 shadow-2xs">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-0.5 h-3 bg-[#D6CEBF]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'pomodoro' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl font-bold">
              🍅
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#162B20]">
                Mengapa Memilih Teknik Pomodoro 25 & 5 Menit?
              </h3>
              <p className="text-xs text-stone-500">
                Metode terbukti secara ilmiah untuk mengalahkan prokrastinasi kuliah.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-2">
              <h4 className="font-bold text-[#162B20] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>25 Menit Fokus Penuh</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Otak manusia bekerja optimal saat diberi rentang target singkat. 25 menit cukup pendek sehingga tidak terasa melelahkan, namun cukup panjang untuk menyelesaikan 1 bab atau 1 tugas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D6] space-y-2">
              <h4 className="font-bold text-[#162B20] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>5 / 10 Menit Istirahat</span>
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Istirahat memungkinkan otak mengkonsolidasikan memori materi dosen. Berdiri, minum air, atau regangkan otot sejenak tanpa scrolling berlebihan.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
            <Music className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5">Ditemani 4 Pilihan Instrumen Musik</strong>
              Pilih alunan Piano Klasik, Petikan Gitar Akustik, Lofi Chill Rhodes, atau Gesekan Cello String yang dirancang tanpa lirik sehingga tidak mendistraksi konsentrasi saat membaca.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'plant' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
              🌱
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#162B20]">
                Cara Kerja Tanaman Virtual Konsistensi
              </h3>
              <p className="text-xs text-stone-500">
                Tumbuh otomatis setiap kamu belajar Pomodoro secara teratur!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#EBF5EE] border border-emerald-200 flex items-start gap-3">
              <span className="text-2xl">🌿</span>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  Konsisten (Subur & Segar)
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  Ketika kamu rutin belajar dalam 24 jam terakhir atau menjaga streak berturut-turut, tanamanmu akan memiliki daun hijau lebat, tunas mekar, dan berbunga cantik.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="text-2xl">🍂</span>
              <div>
                <h4 className="text-sm font-bold text-amber-950">
                  Jarang Belajar (Layu)
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Jika kamu tidak menyalakan Pomodoro selama 2-3 hari berturut-turut, batang tanaman mulai menunduk dan daunnya menguning haus akan fokus belajarmu.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-start gap-3">
              <span className="text-2xl">🥀</span>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Tidak Belajar (Mati)
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  Bila lebih dari 4 hari tanpa belajar, tanaman akan menjadi ranting kering. Namun jangan khawatir, satu sesi 25 menit Pomodoro akan langsung menghidupkannya kembali!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sensor' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1E3F2B] flex items-center justify-center text-2xl font-bold">
              📡
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#162B20]">
                Fitur Sensor Deteksi Keluar Web
              </h3>
              <p className="text-xs text-stone-500">
                Pengingat disiplin saat tergoda scrolling sosmed di tab lain.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#162B20] text-white border border-[#234232] space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Sensor Nyata Berbasis Browser API</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Saat sensor ini diaktifkan di pojok kanan atas atau di halaman Pomodoro, aplikasi mendeteksi saat tab beralih (visibility change / window blur). Sensor akan membunyikan sinyal peringatan berulang hingga kamu kembali membuka tab StudyBuddy dan menekan tombol matikan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-[#E3DDD2] text-xs text-stone-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Fitur ini dapat dinonaktifkan kapan saja melalui tombol "Sensor Aktif" pada bilah atas.</span>
          </div>
        </div>
      )}

      {/* Motivational footer quote */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-4 text-center text-xs text-[#44554B] italic flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>"Belajar bukan tentang seberapa cepat kamu sampai, tetapi seberapa konsisten langkah kakimu."</span>
      </div>
    </div>
  );
};
