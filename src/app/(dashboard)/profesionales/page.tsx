import React from 'react';
import { getProfessionals, getSpecialties } from '@/features/professionals/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Phone, Mail, Award, Clock } from 'lucide-react';

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

      {/* Grid de Odontólogos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {professionals.map((prof) => (
          <Card key={prof.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                  style={{ backgroundColor: prof.color }}
                >
                  {prof.first_name[0]}
                  {prof.last_name[0]}
                </div>
                <div>
                  <CardTitle className="text-base">
                    Dr. {prof.first_name} {prof.last_name}
                  </CardTitle>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Colegiatura: {prof.license_number}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {/* Especialidades */}
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400 mb-1.5">
                  Especialidades Asignadas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {prof.specialties.map((s) => (
                    <Badge key={s.id} variant="info" className="text-[11px]">
                      {s.name}
                    </Badge>
                  ))}
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
                  <span>{prof.email}</span>
                </p>
              </div>

              {/* Identificador para la Agenda */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Color en Agenda:</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-200"
                    style={{ backgroundColor: prof.color }}
                  />
                  <span className="font-mono text-xs">{prof.color}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
                <p className="text-[11px] text-slate-500 mt-1">{s.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
