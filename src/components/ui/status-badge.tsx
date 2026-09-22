import React from 'react';
import { AppointmentStatus, PatientStatus } from '@/types/database.types';
import { Badge } from './badge';

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const configs: Record<
    AppointmentStatus,
    { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' }
  > = {
    pending: { label: 'Pendiente', variant: 'warning' },
    confirmed: { label: 'Confirmada', variant: 'info' },
    checked_in: { label: 'En Espera', variant: 'purple' },
    in_progress: { label: 'En Atención', variant: 'purple' },
    completed: { label: 'Completada', variant: 'success' },
    cancelled: { label: 'Cancelada', variant: 'danger' },
    no_show: { label: 'No Asistió', variant: 'danger' },
    rescheduled: { label: 'Reprogramada', variant: 'default' },
  };

  const config = configs[status] || { label: status, variant: 'default' };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PatientStatusBadge({ status }: { status: PatientStatus }) {
  return status === 'active' ? (
    <Badge variant="success">Activo</Badge>
  ) : (
    <Badge variant="default">Inactivo</Badge>
  );
}
