import React from 'react';
import { notFound } from 'next/navigation';
import { getPatientById } from '@/features/patients/services';
import { getPatientAppointments } from '@/features/appointments/services';
import { PatientDetailView } from '@/features/patients/components/patient-detail-view';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientPage({ params }: PageProps) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const appointments = await getPatientAppointments(id);

  return <PatientDetailView patient={patient} appointments={appointments} />;
}
