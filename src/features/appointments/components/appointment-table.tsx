'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { formatDateTime, formatCurrency } from '@/lib/utils';

interface AppointmentTableProps {
  initialAppointments: AppointmentWithDetails[];
  patients: Patient[];
  professionals: ProfessionalWithSpecialties[];
  services: Service[];
  rooms: Room[];
}

export function AppointmentTable({
  initialAppointments,
  patients,
  professionals,
  services,
  rooms,
}: AppointmentTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [profFilter, setProfFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithDetails | null>(null);

  const filteredAppointments = initialAppointments.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (profFilter !== 'all' && a.professional_id !== profFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const patientName = `${a.patient.first_name} ${a.patient.last_name}`.toLowerCase();
      const doc = a.patient.document_id.toLowerCase();
      const serviceName = a.service.name.toLowerCase();
      return patientName.includes(q) || doc.includes(q) || serviceName.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por paciente, cédula o tratamiento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="checked_in">En Espera (Llegada)</option>
            <option value="in_progress">En Atención</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
            <option value="no_show">No Asistió</option>
          </select>

          <select
            value={profFilter}
            onChange={(e) => setProfFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700"
          >
            <option value="all">Todos los Odontólogos</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>
                Dr. {p.first_name} {p.last_name}
              </option>
            ))}
          </select>
        </div>

        <Button
          size="sm"
          onClick={() => setIsBookingOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-1" /> Agendar Cita
        </Button>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Tratamiento / Servicio</th>
                <th className="py-3 px-4">Odontólogo</th>
                <th className="py-3 px-4">Sillón</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredAppointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                    {formatDateTime(appt.start_time)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/pacientes/${appt.patient_id}`}
                      className="font-bold text-slate-800 hover:text-brand-600 transition-colors"
                    >
                      {appt.patient.first_name} {appt.patient.last_name}
                    </Link>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Céd: {appt.patient.document_id}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800">{appt.service.name}</span>
                    <p className="text-[10px] text-slate-500">
                      {appt.service.duration_minutes} min • {formatCurrency(appt.service.price)}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: appt.professional.color }}
                      />
                      <span>
                        Dr. {appt.professional.first_name} {appt.professional.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{appt.room.name}</td>
                  <td className="py-3.5 px-4">
                    <AppointmentStatusBadge status={appt.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAppointment(appt)}
                      className="text-xs"
                    >
                      Gestionar
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No se encontraron citas con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
    </div>
  );
}
