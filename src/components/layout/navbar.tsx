'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const router = useRouter();
  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Left: Date indicator */}
      <div className="flex items-center gap-3">
        <div className="capitalize text-sm font-medium text-slate-700 dark:text-slate-300">
          {todayFormatted}
        </div>
      </div>

      {/* Right: Quick actions & user info */}
      <div className="flex items-center gap-4">
        {/* Role badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium border border-teal-200/50">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Consultorio Odontológico</span>
        </div>

        {/* User profile dropdown/button */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">
                Dr. Administrador
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-1">Recepción / Gestión</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
