import { CalendarTask } from '../types';
import { audioService } from './audioService';

class NotificationService {
  private isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  public triggerTaskDeadlineNotification(task: CalendarTask) {
    const title = `⏰ Tenggat Waktu Tugas Tiba!`;
    const body = `Tugas "${task.title}" (${task.course || 'Mata Kuliah'}) sudah mencapai batas pengumpulan pukul ${task.dueTime || '23:59'}. Segera kumpulkan ya!`;

    // 1. Device Hardware Vibration (Mobile/Tablet)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([500, 200, 500, 200, 500]);
      } catch {
        // ignore
      }
    }

    // 2. Audible Ringing Sound
    audioService.playRingtone('lonceng', true);

    // 3. Web Notification API (Works on Android, Windows, Mac, Linux, iOS PWA)
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>',
          tag: `task-deadline-${task.id}`,
          requireInteraction: true
        });

        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      } catch (err) {
        console.warn('Web notification failed to display:', err);
      }
    }
  }

  public async sendTestNotification(): Promise<boolean> {
    if (!this.isSupported()) {
      alert('Perangkat Anda belum mendukung Web Notification API.');
      return false;
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        alert('Izin notifikasi belum diberikan. Silakan izinkan notifikasi pada pengaturan browser Anda.');
        return false;
      }
    }

    // Trigger test vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([300, 150, 300]);
      } catch {
        // ignore
      }
    }

    // Audio test
    audioService.playRingtone('lonceng', false);

    try {
      new Notification('🔔 Tes Notifikasi StudyBuddy Berhasil!', {
        body: 'Perangkat Anda siap menerima pengingat otomatis saat jam dan tanggal tenggat tugas tiba.',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>',
        tag: 'test-studybuddy-notif'
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const notificationService = new NotificationService();
