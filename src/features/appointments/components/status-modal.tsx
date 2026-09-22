'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  UserCheck,
  Play,
  CheckCircle,
  XCircle,
  UserX,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppointmentWithDetails, AppointmentStatus } from '@/types/app.types';
import {
  updateAppointmentStatusAction,
  cancelAppointmentAction,
} from '@/features/appointments/actions';
import { AppointmentStatusBadge } from '@/components/ui/status-badge';
import { formatDateTime } from '@/lib/utils';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithDetails | null;
}

export function StatusModal({ isOpen, onClose, appointment }: StatusModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!appointment) return null;

  const handleUpdateStatus = async (newStatus: AppointmentStatus) => {
    setLoading(true);
    setError(null);

    const res = await updateAppointmentStatusAction({
      appointmentId: appointment.id,
      status: newStatus,
    });

    setLoading(false);
    if (res.success) {
      onClose();
      router.refresh();
    } else {
      setError(res.error || 'Error actualizando estado');
    }
  };

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      setError('Por favor indique el motivo de la cancelación');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await cancelAppointmentAction({
      appointmentId: appointment.id,
      cancellationReason,
    });

    setLoading(false);
    if (res.success) {
      setShowCancelInput(false);
      setCancellationReason('');
      onClose();
      router.refresh();
    } else {
      setError(res.error || 'Error cancelando cita');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestión de Cita Odontológica"
      description="Actualizar estado del paciente y avance en la atención clínica"
      maxWidth="md"
    >
      <div className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Resumen de la Cita */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Paciente:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {appointment.patient.first_name} {appointment.patient.last_name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Odontólogo:</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Dr. {appointment.professional.first_name} {appointment.professional.last_name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tratamiento:</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {appointment.service.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Horario:</span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {formatDateTime(appointment.start_time)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500">Estado Actual:</span>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
        </div>

        {/* Acciones de Flujo Clínico */}
        {!showCancelInput ? (
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Flujo de Atención
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {appointment.status === 'pending' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateStatus('confirmed')}
                  isLoading={loading}
                  className="w-full"
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Confirmar Cita
                </Button>
              )}

              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus('checked_in')}
                  isLoading={loading}
                  className="w-full text-purple-700 border-purple-200 hover:bg-purple-50"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1" /> Marcar Llegada (Espera)
                </Button>
              )}

              {appointment.status === 'checked_in' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateStatus('in_progress')}
                  isLoading={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Play className="w-3.5 h-3.5 mr-1" /> Pasar a Sillón (Atendiendo)
                </Button>
              )}

              {appointment.status === 'in_progress' && (
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleUpdateStatus('completed')}
                  isLoading={loading}
                  className="w-full col-span-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Finalizar Tratamiento
                </Button>
              )}

              {['pending', 'confirmed', 'checked_in'].includes(appointment.status) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdateStatus('no_show')}
                  isLoading={loading}
                  className="w-full text-slate-600"
                >
                  <UserX className="w-3.5 h-3.5 mr-1" /> Paciente No Asistió
                </Button>
              )}

              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowCancelInput(true)}
                  disabled={loading}
                  className="w-full"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Cancelar Cita
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4 bg-rose-50/60 rounded-xl border border-rose-200">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wide">
              Indicar Motivo de Cancelación
            </h4>
            <Input
              placeholder="Ej. Paciente canceló por viaje o emergencia laboral"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCancelInput(false)}
                disabled={loading}
              >
                Volver
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancel}
                isLoading={loading}
              >
                Confirmar Cancelación
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
