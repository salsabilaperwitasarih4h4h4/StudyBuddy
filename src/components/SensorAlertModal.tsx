import React from 'react';
import { AlertCircle, VolumeX } from 'lucide-react';

interface SensorAlertModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const SensorAlertModal: React.FC<SensorAlertModalProps> = ({ isOpen, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-emerald-400 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 animate-pulse">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
          📡 Sensor Deteksi Keluar Web Aktif
        </span>

        <h3 className="text-xl font-bold text-[#1A2820] mb-2">
          Hayo, Kamu Meninggalkan Tab Belajar! 🤫
        </h3>

        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          Sensor berbunyi karena kamu sempat beralih ke tab atau jendela lain. Tarik napas dalam-dalam dan kembali fokus selesaikan sesi belajarmu sekarang ya!
        </p>

        <button
          onClick={onDismiss}
          className="w-full py-3 px-4 rounded-xl bg-[#1E3F2B] hover:bg-[#163323] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <VolumeX className="w-4 h-4" />
          <span>Matikan Bunyi & Lanjut Fokus</span>
        </button>
      </div>
    </div>
  );
};
