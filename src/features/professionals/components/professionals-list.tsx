'use client';

import React, { useState } from 'react';
import { ProfessionalWithSpecialties, Specialty } from '@/types/app.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Phone, Mail, Edit2 } from 'lucide-react';
import { ProfessionalModal } from './professional-modal';

interface ProfessionalsListProps {
  initialProfessionals: ProfessionalWithSpecialties[];
  specialties: Specialty[];
}

export function ProfessionalsList({
  initialProfessionals,
  specialties,
}: ProfessionalsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<ProfessionalWithSpecialties | null>(null);
  const [search, setSearch] = useState('');

  const filteredProfessionals = initialProfessionals.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    const license = p.license_number.toLowerCase();
    const specs = p.specialties.map((s) => s.name.toLowerCase()).join(' ');
    return fullName.includes(q) || license.includes(q) || specs.includes(q);
  });

  const handleCreate = () => {
    setSelectedProfessional(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prof: ProfessionalWithSpecialties) => {
    setSelectedProfessional(prof);
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
            placeholder="Buscar por nombre, especialidad o colegiatura..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <Button
          onClick={handleCreate}
          size="sm"
          className="bg-brand-600 hover:bg-brand-700 text-white shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Profesional
        </Button>
      </div>

      {/* Grid de Odontólogos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map((prof) => (
          <Card key={prof.id} className="hover:shadow-md transition-shadow group relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                    style={{ backgroundColor: prof.color }}
                  >
                    {prof.first_name[0]}
                    {prof.last_name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">
                      Dr. {prof.first_name} {prof.last_name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Colegiatura: {prof.license_number}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleEdit(prof)}
                  className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Editar Profesional"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              {/* Especialidades */}
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400 mb-1.5">
                  Especialidades Asignadas
                </p>
                <div className="flex flex-wrap gap-1.5 min-h-[26px]">
                  {prof.specialties.map((s) => (
                    <Badge key={s.id} variant="info" className="text-[11px]">
                      {s.name}
                    </Badge>
                  ))}
                  {prof.specialties.length === 0 && (
                    <span className="text-[11px] text-slate-400">Sin especialidad asignada</span>
                  )}
                </div>
              </div>

              {/* Contacto */}
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prof.phone}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{prof.email}</span>
                </p>
              </div>

              {/* Identificador para la Agenda */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-200"
                    style={{ backgroundColor: prof.color }}
                  />
                  <span className="font-mono text-xs">{prof.color}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(prof)} className="text-xs h-7 px-2.5">
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProfessionals.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No se encontraron profesionales médicos.
          </div>
        )}
      </div>

      {/* Catálogo de Especialidades */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Especialidades del Consultorio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {specialties.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50"
              >
                <h4 className="text-xs font-bold text-slate-800">{s.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{s.description || 'Especialidad clínica odontológica.'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <ProfessionalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        professional={selectedProfessional}
        specialties={specialties}
      />
    </div>
  );
}
