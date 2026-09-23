import React from 'react';
import { getRooms } from '@/features/services/services';
import { RoomsList } from '@/features/services/components/rooms-list';

export const dynamic = 'force-dynamic';

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

      <RoomsList initialRooms={rooms} />
    </div>
  );
}
