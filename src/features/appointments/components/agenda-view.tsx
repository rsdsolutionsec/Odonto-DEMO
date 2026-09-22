'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  User,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { AppointmentStatusBadge } from '@/components/ui/status-badge';
import {
  AppointmentWithDetails,
  Patient,
  ProfessionalWithSpecialties,
  Service,
  Room,
} from '@/types/app.types';
import { BookingModal } from './booking-modal';
import { StatusModal } from './status-modal';
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';

interface AgendaViewProps {
  initialAppointments: AppointmentWithDetails[];
  patients: Patient[];
  professionals: ProfessionalWithSpecialties[];
  services: Service[];
  rooms: Room[];
}

export function AgendaView({
  initialAppointments,
  patients,
  professionals,
  services,
  rooms,
}: AgendaViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  // Modales
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null);

  // Filtros de citas
  const filteredAppointments = initialAppointments.filter((appt) => {
    if (selectedProfessionalId && appt.professional_id !== selectedProfessionalId) return false;
    if (selectedRoomId && appt.room_id !== selectedRoomId) return false;
    return true;
  });

  // Navegación de fechas
  const handlePrev = () => {
    if (viewMode === 'day') setCurrentDate((prev) => subDays(prev, 1));
    else if (viewMode === 'week') setCurrentDate((prev) => subDays(prev, 7));
    else setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNext = () => {
    if (viewMode === 'day') setCurrentDate((prev) => addDays(prev, 1));
    else if (viewMode === 'week') setCurrentDate((prev) => addDays(prev, 7));
    else setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Días de la semana actual (Lunes a Sábado)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 5), // Lunes a Sábado
  });

  // Horas del día (08:00 a 18:00)
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  return (
    <div className="space-y-4">
      {/* Barra de Controles y Filtros */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Izquierda: Navegación de fechas */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hoy
          </Button>
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <button
              onClick={handlePrev}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize ml-2">
            {viewMode === 'month'
              ? format(currentDate, 'MMMM yyyy', { locale: es })
              : viewMode === 'week'
              ? `Semana del ${format(weekStart, "d 'de' MMMM", { locale: es })}`
              : format(currentDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </span>
        </div>

        {/* Centro y Derecha: Modos de Vista, Filtros y Botón de Agendar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Vista (Día / Semana / Mes) */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Día
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mes
            </button>
          </div>

          {/* Filtro Profesional */}
          <select
            value={selectedProfessionalId}
            onChange={(e) => setSelectedProfessionalId(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Todos los Odontólogos</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                Dr. {p.first_name} {p.last_name}
              </option>
            ))}
          </select>

          {/* Filtro Sillón */}
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Todos los Sillones</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Botón Nueva Cita */}
          <Button
            size="sm"
            onClick={() => setIsBookingOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" /> Nueva Cita
          </Button>
        </div>
      </div>

      {/* VISTA SEMANA */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Cabecera de Días */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="p-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider border-r border-slate-200 dark:border-slate-800">
                Hora
              </div>
              {weekDays.map((day, i) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <div
                    key={i}
                    className={`p-3 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                      isToday ? 'bg-brand-50/50 dark:bg-brand-950/20' : ''
                    }`}
                  >
                    <p className="text-xs font-medium text-slate-500 capitalize">
                      {format(day, 'EEE', { locale: es })}
                    </p>
                    <p
                      className={`text-sm font-bold mt-0.5 inline-block px-2 py-0.5 rounded-full ${
                        isToday ? 'bg-brand-600 text-white' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {format(day, 'd')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Grid de Horarios */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {hours.map((hour) => {
                const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;

                return (
                  <div key={hour} className="grid grid-cols-7 min-h-[90px]">
                    {/* Columna de Hora */}
                    <div className="p-2 text-right pr-3 text-xs font-semibold text-slate-400 border-r border-slate-200 dark:border-slate-800 bg-slate-50/20">
                      {hourFormatted}
                    </div>

                    {/* Columnas de los 6 Días */}
                    {weekDays.map((day, dayIdx) => {
                      // Buscar citas en este día y bloque de hora
                      const dayAppointments = filteredAppointments.filter((appt) => {
                        const apptDate = parseISO(appt.start_time);
                        return isSameDay(apptDate, day) && apptDate.getHours() === hour;
                      });

                      return (
                        <div
                          key={dayIdx}
                          onClick={() => {
                            setCurrentDate(day);
                            setIsBookingOpen(true);
                          }}
                          className="p-1 border-r border-slate-200 dark:border-slate-800 last:border-r-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer relative flex flex-col gap-1"
                        >
                          {dayAppointments.map((appt) => (
                            <div
                              key={appt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAppointment(appt);
                              }}
                              className="p-1.5 rounded-lg border text-left shadow-xs transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer"
                              style={{
                                backgroundColor: `${appt.service.color}15`,
                                borderColor: `${appt.service.color}60`,
                              }}
                            >
                              <div className="flex items-center justify-between gap-1 leading-none mb-1">
                                <span className="text-[10px] font-bold text-slate-800 truncate">
                                  {appt.patient.first_name} {appt.patient.last_name}
                                </span>
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: appt.professional.color }}
                                  title={`Dr. ${appt.professional.first_name}`}
                                />
                              </div>
                              <p className="text-[10px] text-slate-600 truncate font-medium">
                                {appt.service.name}
                              </p>
                              <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500">
                                <span>{format(parseISO(appt.start_time), 'HH:mm')}</span>
                                <AppointmentStatusBadge status={appt.status} />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VISTA DÍA */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4 capitalize">
            Agenda del {format(currentDate, "EEEE d 'de' MMMM", { locale: es })}
          </h3>
          <div className="space-y-3">
            {filteredAppointments
              .filter((a) => isSameDay(parseISO(a.start_time), currentDate))
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => setSelectedAppointment(appt)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{ borderLeftWidth: '5px', borderLeftColor: appt.service.color }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {appt.patient.first_name} {appt.patient.last_name}
                      </span>
                      <AppointmentStatusBadge status={appt.status} />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{appt.service.name}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {format(parseISO(appt.start_time), 'HH:mm')} -{' '}
                        {format(parseISO(appt.end_time), 'HH:mm')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Dr. {appt.professional.first_name} {appt.professional.last_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {appt.room.name}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appt)}>
                    Gestionar
                  </Button>
                </div>
              ))}

            {filteredAppointments.filter((a) => isSameDay(parseISO(a.start_time), currentDate))
              .length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No hay citas programadas para este día.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA MES */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
          <div className="grid grid-cols-7 gap-2">
            {eachDayOfInterval({
              start: startOfMonth(currentDate),
              end: endOfMonth(currentDate),
            }).map((day, idx) => {
              const dayAppts = filteredAppointments.filter((a) =>
                isSameDay(parseISO(a.start_time), day)
              );
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode('day');
                  }}
                  className={`min-h-[90px] p-2 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${
                    isToday ? 'border-brand-500 bg-brand-50/20' : 'border-slate-200'
                  }`}
                >
                  <p
                    className={`text-xs font-bold ${
                      isToday ? 'text-brand-600' : 'text-slate-700'
                    }`}
                  >
                    {format(day, 'd')}
                  </p>
                  <div className="mt-1 space-y-1">
                    {dayAppts.slice(0, 2).map((a) => (
                      <div
                        key={a.id}
                        className="text-[10px] px-1.5 py-0.5 rounded truncate text-white font-medium"
                        style={{ backgroundColor: a.service.color }}
                      >
                        {a.patient.first_name} ({format(parseISO(a.start_time), 'HH:mm')})
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <p className="text-[10px] text-slate-400 font-semibold">
                        +{dayAppts.length - 2} más
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Agendamiento */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        patients={patients}
        professionals={professionals}
        services={services}
        rooms={rooms}
        initialDate={format(currentDate, 'yyyy-MM-dd')}
        initialProfessionalId={selectedProfessionalId}
      />

      {/* Modal de Estado de Cita */}
      <StatusModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
