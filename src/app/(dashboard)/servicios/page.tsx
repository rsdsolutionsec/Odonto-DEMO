import React from 'react';
import { getServices } from '@/features/services/services';
import { ServicesList } from '@/features/services/components/services-list';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Catálogo de Servicios - OdontoClinic',
  description: 'Tratamientos, precios referenciales y duraciones de bloque',
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Catálogo de Servicios Odontológicos
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tratamientos configurados con cálculo automático de duración de bloque y código de color para la agenda
        </p>
      </div>

      <ServicesList initialServices={services} />
    </div>
  );
}
