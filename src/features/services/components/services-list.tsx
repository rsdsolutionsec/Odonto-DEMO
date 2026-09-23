'use client';

import React, { useState } from 'react';
import { Service } from '@/types/app.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Clock, Edit2 } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { ServiceModal } from './service-modal';

interface ServicesListProps {
  initialServices: Service[];
}

export function ServicesList({ initialServices }: ServicesListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [search, setSearch] = useState('');

  const filteredServices = initialServices.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q));
  });

  const handleCreate = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Controles Superiores */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tratamiento o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <Button onClick={handleCreate} size="sm" className="bg-brand-600 hover:bg-brand-700 text-white shrink-0">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Grid de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow group relative">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: service.color }}
                  />
                  <CardTitle className="text-sm font-bold">{service.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
                    {formatCurrency(service.price)}
                  </span>
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-1 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Editar Servicio"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              <p className="text-slate-600 dark:text-slate-400 min-h-[36px] line-clamp-2">
                {service.description || 'Sin descripción detallada.'}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Bloque: {formatDuration(service.duration_minutes)}
                </span>
                <span className="font-mono text-[10px] text-slate-400 uppercase">
                  {service.color}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    service.is_active
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-slate-500 bg-slate-100 border-slate-200'
                  }`}
                >
                  {service.is_active ? 'Disponible' : 'Inactivo'}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleEdit(service)} className="text-xs h-7 px-2.5">
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Editar Servicio
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No se encontraron servicios o tratamientos odontológicos.
          </div>
        )}
      </div>

      {/* Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
}
