'use client';

import React, { useState } from 'react';
import { Room } from '@/types/app.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DoorOpen, Plus, Shield, Edit2, Search } from 'lucide-react';
import { RoomModal } from './room-modal';

interface RoomsListProps {
  initialRooms: Room[];
}

export function RoomsList({ initialRooms }: RoomsListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [search, setSearch] = useState('');

  const filteredRooms = initialRooms.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q));
  });

  const handleCreate = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
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
            placeholder="Buscar por consultorio o equipamiento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-xs"
          />
        </div>

        <Button onClick={handleCreate} size="sm" className="bg-brand-600 hover:bg-brand-700 text-white shrink-0">
          <Plus className="w-4 h-4 mr-1.5" />
          Nuevo Consultorio
        </Button>
      </div>

      {/* Grid de Consultorios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow group relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold">{room.name}</CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      room.is_active
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-slate-500 bg-slate-100 border-slate-200'
                    }`}
                  >
                    {room.is_active ? 'Operativo' : 'Inactivo'}
                  </span>
                  <button
                    onClick={() => handleEdit(room)}
                    className="p-1 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Editar Consultorio"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-2 text-xs">
              <p className="text-slate-600 dark:text-slate-400 min-h-[36px]">
                {room.description || 'Consultorio dental equipado para procedimientos odontológicos estándar.'}
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

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <Button variant="outline" size="sm" onClick={() => handleEdit(room)} className="text-xs h-7 px-2.5">
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  Editar Consultorio
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRooms.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No se encontraron consultorios o sillones clínicos.
          </div>
        )}
      </div>

      {/* Modal */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={selectedRoom}
      />
    </div>
  );
}
