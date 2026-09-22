import React from 'react';
import { getAppointments } from '@/features/appointments/services';
import { getPatients } from '@/features/patients/services';
import { getProfessionals } from '@/features/professionals/services';
import { getServices, getRooms } from '@/features/services/services';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';

export const metadata = {
  title: 'Dashboard - OdontoClinic',
  description: 'Panel de control de gestión odontológica y citas del día',
};

export default async function DashboardPage() {
  const [appointments, patients, professionals, services, rooms] = await Promise.all([
    getAppointments(),
    getPatients(),
    getProfessionals(),
    getServices(),
    getRooms(),
  ]);

  return (
    <DashboardOverview
      appointments={appointments}
      patients={patients}
      professionals={professionals}
      services={services}
      rooms={rooms}
    />
  );
}
