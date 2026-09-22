import React from 'react';
import { getPatients } from '@/features/patients/services';
import { PatientList } from '@/features/patients/components/patient-list';

export const metadata = {
  title: 'Directorio de Pacientes - OdontoClinic',
  description: 'Gestión y consulta de historias y datos de pacientes del consultorio',
};

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Directorio de Pacientes
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Registro completo, estado clínico, antecedentes y acceso directo a fichas médicas
        </p>
      </div>

      <PatientList initialPatients={patients} />
    </div>
  );
}
