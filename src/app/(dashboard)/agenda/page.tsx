import React from 'react';
import { getAppointments } from '@/features/appointments/services';
import { getPatients } from '@/features/patients/services';
import { getProfessionals } from '@/features/professionals/services';
import { getServices, getRooms } from '@/features/services/services';
import { AgendaView } from '@/features/appointments/components/agenda-view';

export const metadata = {
  title: 'Agenda Odontológica - OdontoClinic',
  description: 'Control de citas, horarios y sillones de atención clínica',
};

export default async function AgendaPage() {
  const [appointments, patients, professionals, services, rooms] = await Promise.all([
    getAppointments(),
    getPatients(),
    getProfessionals(),
    getServices(),
    getRooms(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Agenda Dental Interactiva
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Planificación visual de citas con prevención de doble reserva en tiempo real
        </p>
      </div>

      <AgendaView
        initialAppointments={appointments}
        patients={patients}
        professionals={professionals}
        services={services}
        rooms={rooms}
      />
    </div>
  );
}
