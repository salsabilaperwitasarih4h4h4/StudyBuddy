import React, { useState } from 'react';
import { StudyDayLog } from '../types';
import { Sparkles, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface DashboardPageProps {
  logs: StudyDayLog[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ logs }) => {
  const [filterRange, setFilterRange] = useState<'7d' | '30d'>('30d');

  // Generate 30 date slots up to today
  const generateDateSlots = (count: number) => {
    const slots: StudyDayLog[] = [];
    const today = new Date();
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const found = logs.find((l) => l.date === dateStr);
      slots.push(found || { date: dateStr, minutes: 0, sessions: 0 });
    }
    return slots;
  };

  const last7Logs = generateDateSlots(7);
  const last30Logs = generateDateSlots(30);

  // Weekly stats
  const weeklyMinutes = last7Logs.reduce((acc, curr) => acc + curr.minutes, 0);
  const weeklySessions = last7Logs.reduce((acc, curr) => acc + curr.sessions, 0);
  const weeklyActiveDays = last7Logs.filter((l) => l.minutes > 0).length;
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);
  const average7DaysMin = Math.round(weeklyMinutes / 7);

  // Monthly stats
  const monthlyMinutes = last30Logs.reduce((acc, curr) => acc + curr.minutes, 0);
  const monthlySessions = last30Logs.reduce((acc, curr) => acc + curr.sessions, 0);
  const monthlyActiveDays = last30Logs.filter((l) => l.minutes > 0).length;
  const monthlyHours = (monthlyMinutes / 60).toFixed(1);

  const getDayShortName = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[d.getDay()] || 'Hari';
  };

  const max7DaysMin = Math.max(...last7Logs.map((l) => l.minutes), 60);

  // Intensity color for 30-day matrix
  const getMatrixColor = (minutes: number) => {
    if (minutes === 0) return 'bg-[#EAE5D9] text-stone-500 border-[#DDD5C5]';
    if (minutes <= 25) return 'bg-[#C2DFCA] text-[#1E3F2B] border-[#B0D3B9]';
    if (minutes <= 50) return 'bg-[#7EBA8E] text-white border-[#6EA87E]';
    if (minutes <= 75) return 'bg-[#3C8C56] text-white border-[#317747]';
    return 'bg-[#184628] text-white border-[#12361E]';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Filter Card */}
      <div className="bg-[#162B20] text-white rounded-3xl p-6 sm:p-8 border border-[#234232] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-300 block mb-1">
              J E J A K &nbsp; F O K U S M U
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {filterRange === '7d' ? 'Dashboard mingguan' : 'Dashboard bulanan'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-lg leading-relaxed">
              {filterRange === '7d' 
                ? 'Pantau ritme fokus belajar selama 7 hari terakhir secara spesifik.' 
                : 'Pantau kebiasaan dan total ritme kegiatan belajar yang terbangun tiap bulan.'}
            </p>
          </div>

          {/* Toggle pill switcher */}
          <div className="flex items-center bg-[#234232] p-1.5 rounded-2xl self-start sm:self-center border border-[#2D503C]">
            <button
              onClick={() => setFilterRange('7d')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterRange === '7d'
                  ? 'bg-white text-[#162B20] shadow-xs font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setFilterRange('30d')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterRange === '30d'
                  ? 'bg-white text-[#162B20] shadow-xs font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Bulanan (30 Hari)
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards (dynamically reflect selected range) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3DDD2] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
            <span>{filterRange === '7d' ? 'Menit fokus 7 hari ini' : 'Menit fokus bulan ini'}</span>
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#162B20] tracking-tight">
            {filterRange === '7d' ? weeklyMinutes : monthlyMinutes}
          </div>
          <p className="text-xs text-stone-400 mt-1">
            menit ({filterRange === '7d' ? weeklyHours : monthlyHours} jam)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3DDD2] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
            <span>Sesi selesai</span>
            <CheckCircle className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#162B20] tracking-tight">
            {filterRange === '7d' ? weeklySessions : monthlySessions}
          </div>
          <p className="text-xs text-stone-400 mt-1">
            sesi Pomodoro
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E3DDD2] shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
            <span>Hari aktif</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#162B20] tracking-tight">
            {filterRange === '7d' ? weeklyActiveDays : monthlyActiveDays}
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {filterRange === '7d' ? `${weeklyActiveDays} hari belajar / 7 hari` : `${monthlyActiveDays} hari belajar / 30 hari`}
          </p>
        </div>
      </div>

      {/* SEPARATED VIEWS BASED ON SELECTED TAB */}
      {filterRange === '7d' ? (
        /* Chart: Ritme Belajar 7 Hari (Mingguan) */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#162B20]">
                Ritme belajar 7 hari
              </h3>
              <p className="text-xs text-stone-500">
                Grafik batang fokus mingguan berdasarkan sesi belajar Pomodoro
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-center">
              Rata-rata ~{average7DaysMin} menit / hari
            </span>
          </div>

          {/* Vertical Capsule Bars */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 pt-6 pb-2 px-2">
            {last7Logs.map((log) => {
              const heightPercent = log.minutes > 0 
                ? Math.max(14, Math.round((log.minutes / max7DaysMin) * 100))
                : 8;
              const dayLabel = getDayShortName(log.date);

              return (
                <div key={log.date} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] sm:text-xs font-bold text-[#1E3F2B] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {log.minutes}m
                  </span>

                  <div className="w-8 sm:w-12 bg-[#EFECE4] rounded-full p-1 flex flex-col justify-end h-32 sm:h-36">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-full transition-all duration-500 ${
                        log.minutes > 0
                          ? 'bg-linear-to-t from-[#162B20] to-[#3B8256]'
                          : 'bg-[#DED7C8]'
                      }`}
                    />
                  </div>

                  <span className="text-[11px] sm:text-xs font-semibold text-stone-600 mt-2">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Chart: Matriks Konsistensi Bulanan (30 Hari) */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1E3F2B]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#162B20]">
                Matriks Konsistensi Bulanan (30 Hari)
              </h3>
            </div>
            <span className="text-xs font-bold text-stone-500">
              Total {monthlySessions} sesi tercatat
            </span>
          </div>

          <p className="text-xs text-stone-500 mb-6">
            Warna hijau yang semakin pekat menandakan jumlah sesi belajar Pomodoro yang lebih tinggi pada hari tersebut.
          </p>

          {/* 30 Day Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
            {last30Logs.map((item, idx) => {
              const dayNum = idx + 1;
              const colorClass = getMatrixColor(item.minutes);

              return (
                <div
                  key={item.date}
                  title={`${item.date}: ${item.minutes} menit (${item.sessions} sesi)`}
                  className={`h-14 sm:h-16 rounded-2xl border p-1.5 flex flex-col justify-between items-center transition-transform hover:scale-105 cursor-pointer ${colorClass}`}
                >
                  <span className="text-[10px] font-bold opacity-80">{dayNum}</span>
                  <span className="text-[10px] sm:text-xs font-extrabold">
                    {item.minutes}m
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-[#F0ECE3] flex items-center justify-end gap-2 text-[11px] text-stone-500">
            <span>Kurang</span>
            <span className="w-3.5 h-3.5 rounded-md bg-[#EAE5D9] border border-[#DDD5C5]" />
            <span className="w-3.5 h-3.5 rounded-md bg-[#C2DFCA]" />
            <span className="w-3.5 h-3.5 rounded-md bg-[#7EBA8E]" />
            <span className="w-3.5 h-3.5 rounded-md bg-[#184628]" />
            <span>Lebih Banyak</span>
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-4 text-center text-xs text-[#44554B] italic flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>"Kemajuan tidak selalu bising. Konsistensi harian yang hening adalah kunci keberhasilan sejati."</span>
      </div>
    </div>
  );
};
