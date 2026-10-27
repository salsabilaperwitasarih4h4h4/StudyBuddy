import React from 'react';
import { CalendarTask } from '../types';
import { Clock, Check, BellRing, Sparkles } from 'lucide-react';

interface TaskDeadlineModalProps {
  task: CalendarTask | null;
  onDismiss: () => void;
  onComplete: (taskId: string) => void;
  onSnooze: (taskId: string) => void;
}

export const TaskDeadlineModal: React.FC<TaskDeadlineModalProps> = ({
  task,
  onDismiss,
  onComplete,
  onSnooze
}) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-red-400 text-center animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Urgent header badge */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-bounce">
          <BellRing className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 mb-2 animate-pulse">
          ⏰ Tenggat Tugas Tiba di Perangkat Anda!
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-[#1A2820] mb-1">
          {task.title}
        </h3>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-4">
          <span>{task.course || 'Mata Kuliah'}</span>
          <span>•</span>
          <span>Tenggat: {task.dueDate} pukul {task.dueTime || '23:59'}</span>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
          Waktu dan tanggal batas pengumpulan tugas ini telah tiba. Segera cek dan kumpulkan agar tidak melewati batas waktu ya!
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onComplete(task.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1E3F2B] hover:bg-[#163323] text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Tandai Tugas Selesai</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSnooze(task.id)}
              className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tunda 15 Menit</span>
            </button>

            <button
              onClick={onDismiss}
              className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Matikan Bunyi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
