'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AppointmentStatusBadge } from '@/components/ui/status-badge';
import {
  AppointmentWithDetails,
  Patient,
  ProfessionalWithSpecialties,
  Service,
  Room,
} from '@/types/app.types';
import { BookingModal } from '@/features/appointments/components/booking-modal';
import { StatusModal } from '@/features/appointments/components/status-modal';
import { PatientModal } from '@/features/patients/components/patient-modal';
import { formatTime, formatDateTime, formatCurrency } from '@/lib/utils';
import { isSameDay, parseISO } from 'date-fns';

interface DashboardOverviewProps {
  appointments: AppointmentWithDetails[];
  patients: Patient[];
  professionals: ProfessionalWithSpecialties[];
  services: Service[];
  rooms: Room[];
}

export function DashboardOverview({
  appointments,
  patients,
  professionals,
  services,
  rooms,
}: DashboardOverviewProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null);

  const today = new Date();
  const todayAppointments = appointments.filter((a) =>
    isSameDay(parseISO(a.start_time), today)
  );

  const todayPending = todayAppointments.filter((a) => a.status === 'pending').length;
  const todayConfirmed = todayAppointments.filter((a) => a.status === 'confirmed').length;
  const todayCheckedInOrProgress = todayAppointments.filter((a) =>
    ['checked_in', 'in_progress'].includes(a.status)
  ).length;
  const todayCompleted = todayAppointments.filter((a) => a.status === 'completed').length;
  const todayCancelled = appointments.filter((a) => a.status === 'cancelled').length;
  const todayNoShow = appointments.filter((a) => a.status === 'no_show').length;

  return (
    <div className="space-y-6">
      {/* Barra Superior con Acciones Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Panel de Control Odontológico
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Resumen en tiempo real del consultorio, citas de la jornada y disponibilidad de sillones
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPatientModalOpen(true)}
            className="text-xs"
          >
            <Users className="w-3.5 h-3.5 mr-1.5" /> Registrar Paciente
          </Button>
          <Button
            size="sm"
            onClick={() => setIsBookingOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Nueva Cita
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Citas Hoy</span>
            <Calendar className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {todayAppointments.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Agendadas para hoy</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">En Espera</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{todayCheckedInOrProgress}</p>
          <p className="text-[10px] text-slate-400 mt-1">En sala o sillón</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmadas</span>
            <CheckCircle className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-sky-600">{todayConfirmed}</p>
          <p className="text-[10px] text-slate-400 mt-1">Asistencia verificada</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completadas</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{todayCompleted}</p>
          <p className="text-[10px] text-slate-400 mt-1">Atendidas hoy</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cancelaciones</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600">{todayCancelled}</p>
          <p className="text-[10px] text-slate-400 mt-1">Canceladas globales</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pacientes</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {patients.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Registrados activos</p>
        </div>
      </div>

      {/* Sección Central: Citas de Hoy y Estado de Sillones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2 cols): Cronograma de Hoy */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Citas de Hoy</CardTitle>
                <CardDescription>
                  Listado cronológico de atenciones programadas para la fecha
                </CardDescription>
              </div>
              <Link
                href="/agenda"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                Ver Agenda Completa <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayAppointments
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((appt) => (
                    <div
                      key={appt.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {formatTime(appt.start_time)} - {formatTime(appt.end_time)}
                          </span>
                          <AppointmentStatusBadge status={appt.status} />
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {appt.patient.first_name} {appt.patient.last_name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {appt.service.name} • Dr. {appt.professional.first_name} {appt.professional.last_name} • {appt.room.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAppointment(appt)}
                          className="text-xs"
                        >
                          Gestionar
                        </Button>
                      </div>
                    </div>
                  ))}

                {todayAppointments.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No hay citas programadas para el día de hoy.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha (1 col): Estado de Sillones y Profesionales */}
        <div className="space-y-6">
          {/* Sillones / Consultorios */}
          <Card>
            <CardHeader>
              <CardTitle>Consultorios y Sillones</CardTitle>
              <CardDescription>Ocupación y estado actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{room.name}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                        {room.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Disponible
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Odontólogos */}
          <Card>
            <CardHeader>
              <CardTitle>Equipo Médico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {professionals.map((prof) => (
                  <div key={prof.id} className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: prof.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        Dr. {prof.first_name} {prof.last_name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {prof.specialties.map((s) => s.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modales */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        patients={patients}
        professionals={professionals}
        services={services}
        rooms={rooms}
      />

      <StatusModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />

      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
      />
    </div>
  );
}
