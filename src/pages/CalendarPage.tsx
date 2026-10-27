import React, { useState, useEffect } from 'react';
import { CalendarTask, TaskPriority } from '../types';
import { notificationService } from '../services/notificationService';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckSquare, 
  Square, Trash2, Plus, Sparkles, Clock, BellRing 
} from 'lucide-react';

interface CalendarPageProps {
  tasks: CalendarTask[];
  onAddTask: (task: CalendarTask) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  tasks,
  onAddTask,
  onToggleTaskComplete,
  onDeleteTask
}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [dueTime, setDueTime] = useState('23:59');
  const [course, setCourse] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Sedang');

  // Device Notification Permission State
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [testSent, setTestSent] = useState<boolean>(false);

  useEffect(() => {
    setNotifPermission(notificationService.getPermissionStatus());
  }, []);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
  };

  const handleTestNotification = async () => {
    const success = await notificationService.sendTestNotification();
    if (success) {
      setNotifPermission('granted');
      setTestSent(true);
      setTimeout(() => setTestSent(false), 2500);
    }
  };

  // Calendar month state
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(dueDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    // Auto-prompt permission if not granted yet
    if (notifPermission === 'default') {
      notificationService.requestPermission().then((granted) => {
        setNotifPermission(granted ? 'granted' : 'denied');
      });
    }

    const newTask: CalendarTask = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      dueDate,
      dueTime: dueTime || '23:59',
      course: course.trim() || undefined,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    onAddTask(newTask);
    setSelectedDay(dueDate);
    setTitle('');
    setCourse('');
  };

  // Calendar computation
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const weekLabels = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

  // Map tasks to dates
  const tasksByDate = tasks.reduce<Record<string, CalendarTask[]>>((acc, t) => {
    if (!acc[t.dueDate]) acc[t.dueDate] = [];
    acc[t.dueDate].push(t);
    return acc;
  }, {});

  const displayedTasks = selectedDay
    ? tasks.filter((t) => t.dueDate === selectedDay)
    : tasks;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
              ATUR TENGGAT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#162B20]">
              Kalender tugas
            </h2>
          </div>

          {/* Minimal notification button to keep UI clean and simple */}
          <button
            type="button"
            onClick={notifPermission === 'granted' ? handleTestNotification : handleRequestPermission}
            title={notifPermission === 'granted' ? 'Notifikasi tugas aktif di perangkat ini (klik untuk uji coba)' : 'Klik untuk mengizinkan notifikasi tugas'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3DDD2] bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[11px] font-medium text-stone-600 transition-colors cursor-pointer shrink-0"
          >
            <BellRing className={`w-3.5 h-3.5 ${notifPermission === 'granted' ? 'text-emerald-700' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">
              {testSent ? 'Terkirim! ✓' : notifPermission === 'granted' ? 'Notifikasi Aktif' : 'Izin Notifikasi'}
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Nama tugas
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Makalah Interaksi Manusia & Komputer"
              className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tanggal dan Waktu Pengumpulan */}
            <div>
              <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
                Tanggal dan Waktu Pengumpulan
              </label>
              <div className="grid grid-cols-5 gap-2">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    setSelectedDay(e.target.value);
                  }}
                  className="col-span-3 px-3 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-xs sm:text-sm text-[#1A2820] shadow-2xs cursor-pointer"
                  required
                />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="col-span-2 px-2.5 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-xs sm:text-sm text-[#1A2820] shadow-2xs cursor-pointer text-center font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
                Mata kuliah / Mata Pelajaran
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Contoh: Rekayasa Perangkat Lunak"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs"
              />
            </div>
          </div>

          {/* Priority Pill Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Tingkat Prioritas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Rendah', 'Sedang', 'Tinggi'] as TaskPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    priority === p
                      ? p === 'Tinggi'
                        ? 'bg-rose-800 text-white border-rose-800'
                        : p === 'Sedang'
                        ? 'bg-[#1E3F2B] text-white border-[#1E3F2B]'
                        : 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-[#FAF8F5] text-stone-600 border-[#DDD6C9] hover:bg-stone-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#1E3F2B] hover:bg-[#163323] text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambahkan tugas</span>
          </button>
        </form>
      </div>

      {/* Calendar View Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3DDD2] shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F0ECE3]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#1E3F2B]" />
            <h3 className="text-xl font-bold text-[#162B20]">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-stone-400 mb-2">
          {weekLabels.map((lbl) => (
            <div key={lbl} className="py-1">
              {lbl}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty prefix cells */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={'empty-' + idx} className="h-12 sm:h-16 rounded-xl bg-transparent" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayTasks = tasksByDate[dateStr] || [];
            const isSelected = selectedDay === dateStr;
            const isToday =
              new Date().toISOString().slice(0, 10) === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDay(dateStr)}
                className={`h-12 sm:h-16 p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#EBF3ED] border-[#1E3F2B] ring-2 ring-[#1E3F2B]/20 font-bold'
                    : isToday
                    ? 'bg-amber-50/70 border-amber-300 font-semibold'
                    : 'bg-[#FAF8F5] border-[#E8E2D6] hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>{dayNum}</span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Hari ini" />
                  )}
                </div>

                {/* Task indicators */}
                {dayTasks.length > 0 && (
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#1E3F2B] text-white truncate">
                      {dayTasks.length} tugas
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Task List Details */}
        <div className="mt-8 pt-6 border-t border-[#F0ECE3]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-[#162B20]">
              {selectedDay ? `Daftar Tugas (${selectedDay})` : 'Semua Tugas Terjadwal'}
            </h4>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs text-[#1E3F2B] hover:underline font-medium cursor-pointer"
              >
                Tampilkan Semua
              </button>
            )}
          </div>

          {displayedTasks.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-3">
              Tidak ada tugas yang dijadwalkan pada tanggal ini.
            </p>
          ) : (
            <div className="space-y-2.5">
              {displayedTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    t.completed
                      ? 'bg-stone-50 border-stone-200 opacity-60 line-through'
                      : 'bg-[#FAF8F5] border-[#E5DFD4]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onToggleTaskComplete(t.id)}
                      className="text-[#1E3F2B] hover:scale-110 transition-transform cursor-pointer"
                    >
                      {t.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <Square className="w-5 h-5 text-stone-400" />
                      )}
                    </button>

                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-[#162B20]">
                        {t.title}
                      </h5>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                        {t.course && <span>{t.course}</span>}
                        <span>•</span>
                        <span className="flex items-center gap-1 font-semibold text-stone-700">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Tenggat: {t.dueDate} pukul {t.dueTime || '23:59'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'Tinggi'
                          ? 'bg-red-100 text-red-700'
                          : t.priority === 'Sedang'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.priority}
                    </span>

                    <button
                      type="button"
                      onClick={() => onDeleteTask(t.id)}
                      className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus tugas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quote */}
      <div className="bg-[#EBE7DC]/60 border border-[#DDD6C8] rounded-2xl p-4 text-center text-xs text-[#44554B] italic flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>"Tenggat waktu bukan musuh, melainkan garis finish yang membawa kelegaan."</span>
      </div>
    </div>
  );
};
