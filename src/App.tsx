import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  PageType, UserProfile, AlarmItem, CalendarTask, 
  LectureNote, PlantState, StudyDayLog, PlantCondition 
} from './types';
import { 
  getStoredUser, saveUser, clearUser, 
  getStoredAlarms, saveAlarms, 
  getStoredTasks, saveTasks, 
  getStoredNotes, saveNotes, 
  getStoredPlant, savePlant, 
  getStoredLogs, recordCompletedPomodoro,
  getSensorEnabled, setSensorEnabled
} from './services/storageService';
import { audioService } from './services/audioService';

import { HeaderNav } from './components/HeaderNav';
import { AlarmModal } from './components/AlarmModal';
import { TaskDeadlineModal } from './components/TaskDeadlineModal';
import { SensorAlertModal } from './components/SensorAlertModal';
import { notificationService } from './services/notificationService';

import { LoginPage } from './pages/LoginPage';
import { NavigationPage } from './pages/NavigationPage';
import { MainMenuPage } from './pages/MainMenuPage';
import { PomodoroPage } from './pages/PomodoroPage';
import { AlarmPage } from './pages/AlarmPage';
import { CalendarPage } from './pages/CalendarPage';
import { NotesPage } from './pages/NotesPage';
import { DashboardPage } from './pages/DashboardPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { GuideBookPage } from './pages/GuideBookPage';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const existing = getStoredUser();
    return existing && existing.isLoggedIn ? 'nav' : 'login';
  });

  const [sensorEnabled, setSensorEnabledState] = useState<boolean>(() => getSensorEnabled());
  const [showSensorAlert, setShowSensorAlert] = useState<boolean>(false);

  // Global Pomodoro Timer state (continues across ALL menu pages!)
  const [timerMode, setTimerMode] = useState<'focus25' | 'break5' | 'break10'>('focus25');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeInstrument, setActiveInstrument] = useState<'piano' | 'guitar' | 'lofi' | 'cello' | null>(null);
  const [volume, setVolume] = useState<number>(0.55);
  const [showPomodoroCelebration, setShowPomodoroCelebration] = useState<boolean>(false);

  const [alarms, setAlarms] = useState<AlarmItem[]>(() => getStoredAlarms());
  const [ringingAlarm, setRingingAlarm] = useState<AlarmItem | null>(null);

  const [tasks, setTasks] = useState<CalendarTask[]>(() => getStoredTasks());
  const [dueTask, setDueTask] = useState<CalendarTask | null>(null);
  const [notifiedTaskIds, setNotifiedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('studybuddy_notified_task_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<LectureNote[]>(() => getStoredNotes());
  const [plant, setPlant] = useState<PlantState>(() => getStoredPlant());
  const [logs, setLogs] = useState<StudyDayLog[]>(() => getStoredLogs());

  // Ref to keep current alarms & tasks accessible in ticker interval without stale closures
  const alarmsRef = useRef(alarms);
  alarmsRef.current = alarms;

  const ringingAlarmRef = useRef(ringingAlarm);
  ringingAlarmRef.current = ringingAlarm;

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const dueTaskRef = useRef(dueTask);
  dueTaskRef.current = dueTask;

  const notifiedTaskIdsRef = useRef(notifiedTaskIds);
  notifiedTaskIdsRef.current = notifiedTaskIds;

  // 1. Alarm & Calendar Task Deadline Ticker Check (every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      // Check Alarms
      if (!ringingAlarmRef.current) {
        const currentAlarms = alarmsRef.current;
        const due = currentAlarms.find((a) => {
          if (!a.enabled || a.dismissed) return false;
          const targetTime = new Date(a.datetime).getTime();
          return now >= targetTime && now <= targetTime + 60 * 60 * 1000;
        });

        if (due) {
          setRingingAlarm(due);
          audioService.playRingtone(due.tone, true);
        }
      }

      // Check Calendar Task Deadlines across any device
      if (!dueTaskRef.current && !ringingAlarmRef.current) {
        const currentTasks = tasksRef.current;
        const notified = notifiedTaskIdsRef.current;

        const dueT = currentTasks.find((t) => {
          if (t.completed || notified.includes(t.id)) return false;
          const timePart = t.dueTime ? `${t.dueTime}:00` : '23:59:00';
          const targetTimestamp = new Date(`${t.dueDate}T${timePart}`).getTime();
          if (isNaN(targetTimestamp)) return false;
          // Trigger when reached deadline and within 24 hours
          return now >= targetTimestamp && now <= targetTimestamp + 24 * 60 * 60 * 1000;
        });

        if (dueT) {
          setDueTask(dueT);
          notificationService.triggerTaskDeadlineNotification(dueT);
          setNotifiedTaskIds((prev) => {
            const nextList = [...prev, dueT.id];
            try {
              localStorage.setItem('studybuddy_notified_task_ids', JSON.stringify(nextList));
            } catch {}
            return nextList;
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. Global Pomodoro Timer Ticker (runs in background across all pages!)
  const timerModeRef = useRef(timerMode);
  timerModeRef.current = timerMode;

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            handlePomodoroCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handlePomodoroCompleted = () => {
    audioService.playPomodoroComplete();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (timerModeRef.current === 'focus25') {
      const { plant: updatedPlant, logs: updatedLogs } = recordCompletedPomodoro(25);
      setPlant(updatedPlant);
      setLogs(updatedLogs);
      setShowPomodoroCelebration(true);
    } else {
      alert('Sesi istirahat selesai! Siap untuk kembali fokus? 💪');
    }
  };

  const handleModeChange = (newMode: 'focus25' | 'break5' | 'break10') => {
    setIsTimerRunning(false);
    setTimerMode(newMode);
    const secs = newMode === 'focus25' ? 25 * 60 : newMode === 'break5' ? 5 * 60 : 10 * 60;
    setTimeLeft(secs);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    const secs = timerMode === 'focus25' ? 25 * 60 : timerMode === 'break5' ? 5 * 60 : 10 * 60;
    setTimeLeft(secs);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  // Instrument audio controls
  const handleInstrumentToggle = (id: 'piano' | 'guitar' | 'lofi' | 'cello') => {
    const started = audioService.playInstrument(id);
    setActiveInstrument(started ? id : null);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioService.setVolume(newVol);
  };

  const handleStopInstrument = () => {
    audioService.stopInstrument();
    setActiveInstrument(null);
  };

  // 3. Sensor Deteksi Keluar Web listener
  const sensorEnabledRef = useRef(sensorEnabled);
  sensorEnabledRef.current = sensorEnabled;

  useEffect(() => {
    let wasHidden = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (sensorEnabledRef.current) {
          wasHidden = true;
          audioService.startSensorWarning();
        }
      } else {
        if (wasHidden) {
          wasHidden = false;
          setShowSensorAlert(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audioService.stopSensorWarning();
    };
  }, []);

  const handleToggleSensor = () => {
    setSensorEnabledState((prev) => {
      const next = !prev;
      setSensorEnabled(next);
      if (!next) {
        audioService.stopSensorWarning();
        setShowSensorAlert(false);
      }
      return next;
    });
  };

  const handleDismissSensorAlert = () => {
    setShowSensorAlert(false);
    audioService.stopSensorWarning();
  };

  // Alarm actions
  const handleDismissAlarm = (alarmId: string) => {
    audioService.stopAlarm();
    setRingingAlarm(null);
    setAlarms((prev) => {
      const updated = prev.map((a) =>
        a.id === alarmId ? { ...a, enabled: false, dismissed: true } : a
      );
      saveAlarms(updated);
      return updated;
    });
  };

  const handleSnoozeAlarm = (alarmId: string) => {
    audioService.stopAlarm();
    setRingingAlarm(null);
    const newDateTime = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);
    setAlarms((prev) => {
      const updated = prev.map((a) =>
        a.id === alarmId ? { ...a, datetime: newDateTime, dismissed: false } : a
      );
      saveAlarms(updated);
      return updated;
    });
  };

  const handleSaveAlarm = (newAlarm: AlarmItem) => {
    setAlarms((prev) => {
      const updated = [newAlarm, ...prev];
      saveAlarms(updated);
      return updated;
    });
  };

  const handleDeleteAlarm = (alarmId: string) => {
    setAlarms((prev) => {
      const updated = prev.filter((a) => a.id !== alarmId);
      saveAlarms(updated);
      return updated;
    });
  };

  const handleToggleAlarm = (alarmId: string) => {
    setAlarms((prev) => {
      const updated = prev.map((a) =>
        a.id === alarmId ? { ...a, enabled: !a.enabled } : a
      );
      saveAlarms(updated);
      return updated;
    });
  };

  // Task actions
  const handleAddTask = (newTask: CalendarTask) => {
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveTasks(updated);
      return updated;
    });
  };

  const handleToggleTaskComplete = (taskId: string) => {
    if (dueTask && dueTask.id === taskId) {
      audioService.stopAlarm();
      setDueTask(null);
    }
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      saveTasks(updated);
      return updated;
    });
  };

  const handleDeleteTask = (taskId: string) => {
    if (dueTask && dueTask.id === taskId) {
      audioService.stopAlarm();
      setDueTask(null);
    }
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      saveTasks(updated);
      return updated;
    });
  };

  // Due Task Deadline Notification Actions
  const handleDismissDueTask = () => {
    audioService.stopAlarm();
    setDueTask(null);
  };

  const handleCompleteDueTask = (taskId: string) => {
    audioService.stopAlarm();
    setDueTask(null);
    handleToggleTaskComplete(taskId);
  };

  const handleSnoozeDueTask = (taskId: string) => {
    audioService.stopAlarm();
    setDueTask(null);
    // Push deadline 15 minutes forward
    const nowPlus15 = new Date(Date.now() + 15 * 60 * 1000);
    const newDate = `${nowPlus15.getFullYear()}-${String(nowPlus15.getMonth() + 1).padStart(2, '0')}-${String(nowPlus15.getDate()).padStart(2, '0')}`;
    const newTime = `${String(nowPlus15.getHours()).padStart(2, '0')}:${String(nowPlus15.getMinutes()).padStart(2, '0')}`;

    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === taskId ? { ...t, dueDate: newDate, dueTime: newTime } : t
      );
      saveTasks(updated);
      return updated;
    });

    // Unmark from notifiedTaskIds so it triggers again after 15 mins
    setNotifiedTaskIds((prev) => {
      const updated = prev.filter((id) => id !== taskId);
      try {
        localStorage.setItem('studybuddy_notified_task_ids', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Note actions
  const handleSaveNote = (newNote: LectureNote) => {
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      saveNotes(updated);
      return updated;
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => {
      const updated = prev.filter((n) => n.id !== noteId);
      saveNotes(updated);
      return updated;
    });
  };

  // User auth actions
  const handleLogin = (profile: UserProfile) => {
    saveUser(profile);
    setUser(profile);
    setCurrentPage('nav');
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setCurrentPage('login');
  };

  // Plant actions
  const handleUpdatePlantCondition = (condition: PlantCondition) => {
    setPlant((prev) => {
      const updated: PlantState = {
        ...prev,
        condition,
        healthPercent: condition === 'subur' ? 100 : condition === 'layu' ? 45 : 0
      };
      savePlant(updated);
      return updated;
    });
  };

  const handleUpdateFlowerCount = (count: number) => {
    setPlant((prev) => {
      const updated: PlantState = {
        ...prev,
        flowerCount: count
      };
      savePlant(updated);
      return updated;
    });
  };


  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#1A2820] flex flex-col font-sans pb-12">
      {/* Real-time Alarm Modal */}
      <AlarmModal
        alarm={ringingAlarm}
        onDismiss={handleDismissAlarm}
        onSnooze={handleSnoozeAlarm}
      />

      {/* Real-time Task Deadline Notification Modal */}
      <TaskDeadlineModal
        task={dueTask}
        onDismiss={handleDismissDueTask}
        onComplete={handleCompleteDueTask}
        onSnooze={handleSnoozeDueTask}
      />

      {/* Sensor Deteksi Keluar Web Alert Modal */}
      <SensorAlertModal
        isOpen={showSensorAlert}
        onDismiss={handleDismissSensorAlert}
      />

      {/* Top Header Navigation (Shown on all pages except login) */}
      {currentPage !== 'login' && (
        <HeaderNav
          currentPage={currentPage}
          user={user}
          sensorEnabled={sensorEnabled}
          onToggleSensor={handleToggleSensor}
          onNavigate={(page) => setCurrentPage(page)}
          onLogout={handleLogout}
          isTimerRunning={isTimerRunning}
          timerSecondsLeft={timeLeft}
          timerMode={timerMode}
          onToggleTimer={handleToggleTimer}
          isInstrumentPlaying={!!activeInstrument}
          activeInstrumentName={activeInstrument}
          onToggleInstrument={handleStopInstrument}
        />
      )}

      {/* Page Routing */}
      <main className="flex-1 w-full">
        {currentPage === 'login' && (
          <LoginPage onLogin={handleLogin} initialProfile={user} />
        )}

        {currentPage === 'nav' && user && (
          <NavigationPage
            user={user}
            onNavigate={(page) => setCurrentPage(page)}
            onLogout={handleLogout}
          />
        )}

        {currentPage === 'menu' && (
          <MainMenuPage onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === 'pomodoro' && (
          <PomodoroPage
            mode={timerMode}
            timeLeft={timeLeft}
            isRunning={isTimerRunning}
            activeInstrument={activeInstrument}
            volume={volume}
            sensorEnabled={sensorEnabled}
            flowerCount={plant.flowerCount || 0}
            showCelebration={showPomodoroCelebration}
            onModeChange={handleModeChange}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onInstrumentToggle={handleInstrumentToggle}
            onVolumeChange={handleVolumeChange}
            onToggleSensor={handleToggleSensor}
            onCloseCelebration={() => setShowPomodoroCelebration(false)}
          />
        )}

        {currentPage === 'alarm' && (
          <AlarmPage
            alarms={alarms}
            onSaveAlarm={handleSaveAlarm}
            onDeleteAlarm={handleDeleteAlarm}
            onToggleAlarm={handleToggleAlarm}
          />
        )}

        {currentPage === 'calendar' && (
          <CalendarPage
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTaskComplete={handleToggleTaskComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {currentPage === 'notes' && (
          <NotesPage
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage logs={logs} />
        )}

        {currentPage === 'achievements' && (
          <AchievementsPage
            plant={plant}
            isTimerRunning={isTimerRunning}
            onNavigateToPomodoro={() => setCurrentPage('pomodoro')}
            onUpdatePlantCondition={handleUpdatePlantCondition}
            onUpdateFlowerCount={handleUpdateFlowerCount}
          />
        )}

        {currentPage === 'guide' && (
          <GuideBookPage onNavigate={(page) => setCurrentPage(page)} />
        )}
      </main>
    </div>
  );
}
