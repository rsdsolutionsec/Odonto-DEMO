import React from 'react';
import { getServices } from '@/features/services/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Clock, DollarSign, Stethoscope } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: service.color }}
                  />
                  <CardTitle className="text-sm font-bold">{service.name}</CardTitle>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                  {formatCurrency(service.price)}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                {service.description || 'Sin descripción detallada.'}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Duración de bloque: {formatDuration(service.duration_minutes)}
                </span>
                <span className="font-mono text-[10px] text-slate-400 uppercase">
                  {service.color}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
