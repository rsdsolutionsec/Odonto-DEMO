import React from 'react';
import { getAppointments } from '@/features/appointments/services';
import { getPatients } from '@/features/patients/services';
import { getProfessionals } from '@/features/professionals/services';
import { getServices, getRooms } from '@/features/services/services';
import { AppointmentTable } from '@/features/appointments/components/appointment-table';

export const metadata = {
  title: 'Gestión de Citas - OdontoClinic',
  description: 'Control de citas y estados clínicos',
};

export default async function AppointmentsPage() {
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
          Gestión de Citas Odontológicas
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Registro completo de reservas, estados de atención, cancelaciones y reprogramaciones
        </p>
      </div>

      <AppointmentTable
        initialAppointments={appointments}
        patients={patients}
        professionals={professionals}
        services={services}
        rooms={rooms}
      />
    </div>
  );
}
