import React, { useState } from 'react';
import { AlarmItem, AlarmTone } from '../types';
import { audioService } from '../services/audioService';
import { Bell, Clock, Trash2, Volume2, Sparkles, Plus, Check } from 'lucide-react';

interface AlarmPageProps {
  alarms: AlarmItem[];
  onSaveAlarm: (alarm: AlarmItem) => void;
  onDeleteAlarm: (id: string) => void;
  onToggleAlarm: (id: string) => void;
}

export const AlarmPage: React.FC<AlarmPageProps> = ({
  alarms,
  onSaveAlarm,
  onDeleteAlarm,
  onToggleAlarm
}) => {
  const [title, setTitle] = useState('');
  // Set default datetime to 1 hour from now formatted for datetime-local
  const getDefaultDateTime = () => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [datetime, setDatetime] = useState(getDefaultDateTime());
  const [tone, setTone] = useState<AlarmTone>('lonceng');
  const [previewingTone, setPreviewingTone] = useState<AlarmTone | null>(null);

  const handlePreviewTone = (t: AlarmTone) => {
    setPreviewingTone(t);
    audioService.playRingtone(t, false);
    setTimeout(() => {
      setPreviewingTone(null);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAlarm: AlarmItem = {
      id: 'alarm-' + Date.now(),
      title: title.trim(),
      datetime,
      tone,
      enabled: true,
      dismissed: false
    };

    onSaveAlarm(newAlarm);
    setTitle('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Alarm Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
            JANGAN SAMPAI LUPA
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162B20]">
            Alarm tugas
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Buat pengingat tugas. Alarm akan berbunyi selama aplikasi ini terbuka.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Judul alarm
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kumpulkan laporan"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Tanggal dan waktu
            </label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs cursor-pointer"
              required
            />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-2">
              Pilihan Nada Dering Alarm
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1 */}
              <div
                onClick={() => setTone('lonceng')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  tone === 'lonceng'
                    ? 'bg-[#162B20] text-white border-[#162B20] shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 border-[#DDD6C9] hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🔔</span>
                  <span className="text-xs font-semibold">Lonceng Melodik</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewTone('lonceng');
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    previewingTone === 'lonceng' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-600'
                  }`}
                  title="Tes nada dering"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option 2 */}
              <div
                onClick={() => setTone('digital')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  tone === 'digital'
                    ? 'bg-[#162B20] text-white border-[#162B20] shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 border-[#DDD6C9] hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>📟</span>
                  <span className="text-xs font-semibold">Digital Klasik</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewTone('digital');
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    previewingTone === 'digital' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-600'
                  }`}
                  title="Tes nada dering"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Option 3 */}
              <div
                onClick={() => setTone('lembut')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  tone === 'lembut'
                    ? 'bg-[#162B20] text-white border-[#162B20] shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 border-[#DDD6C9] hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🎵</span>
                  <span className="text-xs font-semibold">Nada Lembut</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewTone('lembut');
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    previewingTone === 'lembut' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-600'
                  }`}
                  title="Tes nada dering"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#B85D3B] hover:bg-[#A34E2F] text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>+ Simpan alarm</span>
          </button>
        </form>
      </div>

      {/* Alarms List Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
        <div className="text-xs text-stone-500 mb-4 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>Pastikan halaman tetap terbuka agar bunyi pengingat dapat terdengar.</span>
        </div>

        {alarms.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-sm">
            <Bell className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p>Belum ada alarm. Tenang, kamu bisa menambahkannya di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alarms.map((item) => {
              const dateObj = new Date(item.datetime);
              const formattedDate = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    item.enabled
                      ? 'bg-[#FBF9F5] border-[#E5DFD4]'
                      : 'bg-stone-50/60 border-stone-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        item.enabled ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {item.tone === 'lonceng' ? '🔔' : item.tone === 'digital' ? '📟' : '🎵'}
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#162B20]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {formattedDate} • Nada: {item.tone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handlePreviewTone(item.tone)}
                      className="px-2.5 py-1.5 rounded-lg text-xs bg-white border border-[#DFD7CB] text-stone-700 hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
                      title="Uji bunyi alarm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Tes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleAlarm(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        item.enabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {item.enabled ? 'Aktif' : 'Mati'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteAlarm(item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus alarm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quote */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-4 text-center text-xs text-[#44554B] italic flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>"Disiplin waktu kecil hari ini meringankan beban tugas besarmu esok hari."</span>
      </div>
    </div>
  );
};
