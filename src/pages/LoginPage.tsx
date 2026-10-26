import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CheckCircle2, Sparkles, UserCheck, UserPlus } from 'lucide-react';

interface LoginPageProps {
  onLogin: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

const AVATARS = ['🎓', '🌿', '☕', '📚', '⭐', '🌱'];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [nim, setNim] = useState(initialProfile?.nim || '');
  const [university, setUniversity] = useState(initialProfile?.university || '');
  const [avatar, setAvatar] = useState(initialProfile?.avatar || '🎓');

  const handleGuestLogin = () => {
    const guestUser: UserProfile = {
      name: name.trim() || 'Tamu StudyBuddy',
      email: email.trim() || 'tamu@studybuddy.id',
      nim: nim.trim() || '-',
      university: university.trim() || 'Akses Tamu',
      avatar: avatar || '🌿',
      isLoggedIn: true
    };
    onLogin(guestUser);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalProfile: UserProfile = {
      name: name.trim(),
      email: email.trim() || 'pelajar@studybuddy.id',
      nim: nim.trim() || '-',
      university: university.trim() || '-',
      avatar,
      isLoggedIn: true
    };
    onLogin(finalProfile);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        {/* Top Logo / Mascot */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#162B20] text-amber-300 shadow-md mb-3 border border-[#234232]">
            <div className="relative flex items-center justify-center">
              <span className="text-3xl select-none">✨</span>
              <span className="text-2xl select-none -ml-1">🌟</span>
            </div>
          </div>
          <span className="block text-[11px] font-bold tracking-[0.25em] text-[#55695E] uppercase mb-1">
            R U A N G &nbsp; F O K U S M U
          </span>
          <h1 className="text-3xl font-extrabold text-[#162B20] tracking-tight">
            StudyBuddy
          </h1>
        </div>

        {/* Masuk sebagai Tamu Card (Ubah dari Rekomendasi menjadi Masuk sebagai Tamu) */}
        <div
          onClick={handleGuestLogin}
          className="bg-[#EAECE3] hover:bg-[#E3E7DA] border border-[#D5DBCB] rounded-2xl p-3.5 mb-5 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1E3F2B] text-white flex items-center justify-center text-lg shadow-xs">
              🌿
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#1A2820]">
                Masuk sebagai Tamu
              </div>
              <div className="text-[11px] text-[#526459] truncate max-w-[190px] sm:max-w-[220px]">
                Mulai belajar langsung tanpa registrasi
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-[#1A3826] text-emerald-200">
              Akses Tamu
            </span>
            <Sparkles className="w-4 h-4 text-[#1E3F2B] group-hover:rotate-12 transition-transform" />
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-[#DFD8CC] w-full" />
          <span className="bg-[#F8F6F0] px-3 text-[11px] font-semibold text-[#7E8B83] tracking-widest uppercase">
            ATAU GUNAKAN PROFIL KAMU
          </span>
        </div>

        {/* Custom Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkapmu..."
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
                NIM/NISN
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Nomor induk..."
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2C3B32] mb-1.5">
                Universitas / Sekolah
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Nama institusi..."
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-[#DDD6C9] focus:outline-hidden focus:border-[#1E3F2B] focus:ring-1 focus:ring-[#1E3F2B] text-sm text-[#1A2820] shadow-2xs transition-all"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-[#2C3B32] mb-2">
              Pilih Avatar
            </label>
            <div className="flex items-center justify-between gap-2">
              {AVATARS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setAvatar(item)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    avatar === item
                      ? 'bg-[#183323] text-white ring-2 ring-[#183323] ring-offset-2 scale-105 shadow-sm'
                      : 'bg-white border border-[#DDD6C9] hover:bg-stone-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#162B20] hover:bg-[#102018] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-emerald-300" />
            <span>Masuk ke Ruang Fokus</span>
          </button>
        </form>
      </div>

      {/* Footer reassurance */}
      <div className="mt-8 text-center text-xs text-[#7A8880] flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Data tersimpan aman di browser Anda (Local Storage)</span>
      </div>
    </div>
  );
};
