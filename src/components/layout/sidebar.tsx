'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  Users,
  UserCheck,
  Stethoscope,
  Clock,
  LayoutDashboard,
  DoorOpen,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agenda Dental', href: '/agenda', icon: CalendarDays },
  { name: 'Gestión de Citas', href: '/citas', icon: Clock },
  { name: 'Pacientes', href: '/pacientes', icon: Users },
  { name: 'Odontólogos', href: '/profesionales', icon: UserCheck },
  { name: 'Servicios', href: '/servicios', icon: Stethoscope },
  { name: 'Consultorios / Sillones', href: '/consultorios', icon: DoorOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight block">OdontoClinic</span>
          <span className="text-[10px] text-teal-400 font-semibold tracking-wider uppercase block">
            Gestión Médica
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Operaciones Clínicas
          </p>
        </div>
        {navigation.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
            >
              <item.icon
                className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')}
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Sistema Conectado</span>
          </div>
          <p className="text-[11px] text-slate-400">PostgreSQL Anti-Doble Reserva Activo</p>
        </div>
      </div>
    </aside>
  );
}
