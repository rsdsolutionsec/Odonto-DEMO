'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  DoorOpen,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Patient,
  ProfessionalWithSpecialties,
  Service,
  Room,
  TimeSlot,
} from '@/types/app.types';
import {
  createAppointmentAction,
  getAvailabilitySlotsAction,
} from '@/features/appointments/actions';
import { formatTime, formatCurrency, formatDuration } from '@/lib/utils';
import { format, addMinutes, parseISO } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  professionals: ProfessionalWithSpecialties[];
  services: Service[];
  rooms: Room[];
  initialDate?: string;
  initialProfessionalId?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  patients,
  professionals,
  services,
  rooms,
  initialDate,
  initialProfessionalId,
}: BookingModalProps) {
  const router = useRouter();

  // Estados del formulario en los 8 pasos
  const [professionalId, setProfessionalId] = useState(
    initialProfessionalId || (professionals[0]?.id ?? '')
  );
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');
  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [date, setDate] = useState(
    initialDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Estados de cálculo de slots y disponibilidad
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Servicio seleccionado actualmente para mostrar duración y costo
  const selectedService = services.find((s) => s.id === serviceId);

  // Calcular slots cada vez que cambian profesional, servicio, fecha o sala
  useEffect(() => {
    if (!professionalId || !serviceId || !date) return;

    let isMounted = true;
    async function fetchSlots() {
      setLoadingSlots(true);
      setSelectedSlot(null);
      setErrorMessage(null);

      const res = await getAvailabilitySlotsAction({
        professionalId,
        serviceId,
        date,
        roomId,
      });

      if (isMounted) {
        if (res.slots) {
          setAvailableSlots(res.slots);
          // Si hay al menos un slot disponible, preseleccionar el primero
          const firstAvailable = res.slots.find((s) => s.available);
          if (firstAvailable) {
            setSelectedSlot(firstAvailable);
          }
        } else {
          setAvailableSlots([]);
        }
        setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => {
      isMounted = false;
    };
  }, [professionalId, serviceId, date, roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage('Por favor seleccione un horario disponible.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const res = await createAppointmentAction({
      patientId,
      professionalId,
      serviceId,
      roomId,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'pending',
      reason,
      notes,
    });

    setSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'No se pudo agendar la cita');
      return;
    }

    setSuccessMessage('¡Cita programada con éxito!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
      router.refresh();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agendar Nueva Cita Odontológica"
      description="Flujo validado con cálculo automático de duración y prevención de doble reserva"
      maxWidth="2xl"
    >
      {successMessage ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">{successMessage}</h4>
          <p className="text-xs text-slate-500 mt-1">
            Se ha registrado la cita e inicializado el historial de estados en PostgreSQL.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Conflicto o Error</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Paso 1 y 2: Profesional y Paciente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="1. Odontólogo / Especialista"
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                required
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    Dr. {p.first_name} {p.last_name} ({p.specialties.map((s) => s.name).join(', ')})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                label="2. Paciente"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} - Céd: {p.document_id}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Paso 3 y 4: Servicio y Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="3. Servicio / Tratamiento"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                required
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration_minutes} min - {formatCurrency(s.price)})
                  </option>
                ))}
              </Select>
              {selectedService && (
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedService.color }} />
                  <span>Duración: {formatDuration(selectedService.duration_minutes)}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(selectedService.price)}</span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="4. Fecha de Cita"
                type="date"
                value={date}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Paso 5: Horarios Disponibles */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              5. Horarios Disponibles (Calculados por disponibilidad real)
            </label>

            {loadingSlots ? (
              <div className="py-6 flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                <span className="animate-spin w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full" />
                <span>Consultando disponibilidad en servidor...</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                No hay turnos laborales configurados o disponibles para este profesional en la fecha seleccionada.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                {availableSlots.map((slot, idx) => {
                  const isSelected = selectedSlot?.startTime === slot.startTime;
                  const timeLabel = formatTime(slot.startTime);

                  if (!slot.available) {
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled
                        title={slot.reasonUnavailable || 'Horario ocupado'}
                        className="px-2 py-2 text-xs font-medium text-slate-400 bg-slate-100 rounded-lg border border-slate-200 line-through opacity-60 cursor-not-allowed text-center"
                      >
                        {timeLabel}
                      </button>
                    );
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-2 py-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      {timeLabel}
                    </button>
                  );
                })}
              </div>
            )}

            {selectedSlot && selectedService && (
              <p className="mt-2 text-xs text-brand-700 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Cita de {formatTime(selectedSlot.startTime)} a {formatTime(selectedSlot.endTime)} ({selectedService.duration_minutes} min)
              </p>
            )}
          </div>

          {/* Paso 6: Consultorio / Sillón */}
          <div>
            <Select
              label="6. Consultorio / Sillón Clínico"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} - {r.description}
                </option>
              ))}
            </Select>
          </div>

          {/* Paso 7: Observaciones y Motivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="7. Motivo de Consulta"
                placeholder="Ej. Dolor agudo, revisión semestral..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Notas Adicionales"
                placeholder="Ej. Paciente nervioso, alérgico a látex..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Paso 8: Confirmar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={submitting}
              disabled={!selectedSlot || submitting}
            >
              8. Confirmar Reserva
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
