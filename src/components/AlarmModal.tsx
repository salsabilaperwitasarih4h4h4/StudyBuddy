import React from 'react';
import { AlarmItem } from '../types';
import { Bell, Check, Clock } from 'lucide-react';

interface AlarmModalProps {
  alarm: AlarmItem | null;
  onDismiss: (alarmId: string) => void;
  onSnooze: (alarmId: string) => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({ alarm, onDismiss, onSnooze }) => {
  if (!alarm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-300 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 animate-bounce">
          <Bell className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-100 text-red-700 mb-2 animate-pulse">
          ⏰ Alarm Berdering Nyata!
        </span>

        <h3 className="text-xl sm:text-2xl font-bold text-[#1A2820] mb-2">
          {alarm.title}
        </h3>

        <p className="text-sm text-stone-600 mb-6">
          Waktu pengingat tugas kuliahmu telah tiba. Ayo selesaikan sekarang agar tidak tertunda!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onDismiss(alarm.id)}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#1E3F2B] hover:bg-[#163323] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Matikan Alarm</span>
          </button>
          <button
            onClick={() => onSnooze(alarm.id)}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Tunda 5m</span>
          </button>
        </div>
      </div>
    </div>
  );
};
