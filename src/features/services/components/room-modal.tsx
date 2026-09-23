'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Room } from '@/types/app.types';
import { createRoomAction, updateRoomAction } from '@/features/services/actions';
import { DoorOpen, Shield, CheckCircle2 } from 'lucide-react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null;
}

export function RoomModal({ isOpen, onClose, room }: RoomModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (room) {
      setName(room.name);
      setDescription(room.description || '');
      setIsActive(room.is_active);
    } else {
      setName('');
      setDescription('');
      setIsActive(true);
    }
    setError(null);
  }, [room, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      description,
      isActive,
    };

    const res = room?.id
      ? await updateRoomAction(room.id, payload)
      : await createRoomAction(payload);

    setSubmitting(false);

    if (res.success) {
      onClose();
      router.refresh();
    } else {
      setError(res.error || 'Ocurrió un error al guardar el consultorio');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room ? 'Editar Consultorio / Sillón Dental' : 'Nuevo Consultorio / Sillón Clínico'}
      description="Espacio físico asistencial con control PostgreSQL de prevención de solapamientos"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div>
          <Input
            label="Nombre del Consultorio o Sillón"
            placeholder="Ej. Sillón 3 - Endodoncia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Descripción y Equipamiento
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Detalles del equipamiento (ultrasonido, lámpara, cámara intraoral...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="room_is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
          <label htmlFor="room_is_active" className="text-xs text-slate-700 font-medium">
            Consultorio / Sillón operativo para agendamiento
          </label>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
          <Shield className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span>
            Las citas asignadas a este sillón están respaldadas por la regla de exclusión de base de datos para impedir doble reserva.
          </span>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" isLoading={submitting}>
            {room ? 'Guardar Cambios' : 'Crear Consultorio'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
