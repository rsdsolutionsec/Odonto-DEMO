import React from 'react';
import { getProfessionals, getSpecialties } from '@/features/professionals/services';
import { ProfessionalsList } from '@/features/professionals/components/professionals-list';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Odontólogos y Especialistas - OdontoClinic',
  description: 'Directorio del equipo médico y horarios de atención',
};

export default async function ProfessionalsPage() {
  const [professionals, specialties] = await Promise.all([
    getProfessionals(),
    getSpecialties(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Equipo de Odontólogos y Especialistas
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Directorio del personal médico, licencias profesionales y asignación de especialidades
        </p>
      </div>

      <ProfessionalsList
        initialProfessionals={professionals}
        specialties={specialties}
      />
    </div>
  );
}
