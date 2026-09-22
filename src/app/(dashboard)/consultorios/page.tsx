import React from 'react';
import { getRooms } from '@/features/services/services';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DoorOpen, CheckCircle, Shield } from 'lucide-react';

export const metadata = {
  title: 'Consultorios y Sillones - OdontoClinic',
  description: 'Gestión de espacios físicos de atención odontológica',
};

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Consultorios y Sillones de Atención
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Espacios clínicos y sillones dentales vinculados al control PostgreSQL anti-doble reserva
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-sm font-bold">{room.name}</CardTitle>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Operativo
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                {room.description || 'Consultorio dental equipado para procedimientos estándar.'}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                  Restricción PostgreSQL Activa
                </p>
                <p className="text-[10px] text-slate-500">
                  La base de datos impide automáticamente dos citas simultáneas en este sillón.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
