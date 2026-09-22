'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Si las credenciales no están conectadas a una instancia real en producción, permitir demo mode
        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('tu-proyecto')
        ) {
          router.push('/');
          return;
        }
        setError(authError.message || 'Error al iniciar sesión');
        return;
      }

      if (data.session) {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Error inesperado durante la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: string) => {
    // Modo demostración instantáneo para validación
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-300 flex items-center justify-center text-white mx-auto shadow-xl shadow-teal-500/20 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">OdontoClinic</h1>
          <p className="text-xs text-teal-300 font-medium uppercase tracking-wider mt-1">
            Sistema de Gestión Odontológica
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ingresa con tus credenciales de Supabase Auth
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="doctor@odontoclinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
              Ingresar al Consultorio
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Acceso Rápido Demo */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Acceso Rápido de Prueba (Demo)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="px-2 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('receptionist')}
                className="px-2 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center transition-colors"
              >
                Recepción
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('dentist')}
                className="px-2 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center transition-colors"
              >
                Odontólogo
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Seguridad por Roles y Row Level Security (RLS)
        </p>
      </div>
    </div>
  );
}
