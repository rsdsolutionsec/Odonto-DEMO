'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Patient } from '@/types/app.types';
import { createPatientAction, updatePatientAction } from '@/features/patients/actions';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: Patient | null;
}

export function PatientModal({ isOpen, onClose, patient }: PatientModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Campos de formulario
  const [firstName, setFirstName] = useState(patient?.first_name || '');
  const [lastName, setLastName] = useState(patient?.last_name || '');
  const [documentId, setDocumentId] = useState(patient?.document_id || '');
  const [birthDate, setBirthDate] = useState(patient?.birth_date || '1995-01-01');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(patient?.gender || 'female');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [whatsapp, setWhatsapp] = useState(patient?.whatsapp || '');
  const [email, setEmail] = useState(patient?.email || '');
  const [address, setAddress] = useState(patient?.address || '');
  const [emergencyContactName, setEmergencyContactName] = useState(patient?.emergency_contact_name || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(patient?.emergency_contact_phone || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(patient?.status || 'active');
  const [notes, setNotes] = useState(patient?.notes || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      firstName,
      lastName,
      documentId,
      birthDate,
      gender,
      phone,
      whatsapp,
      email,
      address,
      emergencyContactName,
      emergencyContactPhone,
      status,
      notes,
    };

    const res = patient?.id
      ? await updatePatientAction(patient.id, payload)
      : await createPatientAction(payload);

    setSubmitting(false);

    if (res.success) {
      onClose();
      router.refresh();
    } else {
      setError(res.error || 'Ocurrió un error al guardar los datos del paciente');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patient ? 'Editar Ficha de Paciente' : 'Registrar Nuevo Paciente'}
      description="Datos de contacto, información clínica básica y contacto de emergencia"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Nombres y Apellidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombres"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Apellidos"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Cédula, Fecha Nacimiento, Sexo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Cédula / Documento"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            required
          />
          <Input
            label="Fecha de Nacimiento"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
          <Select
            label="Sexo"
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            required
          >
            <option value="female">Femenino</option>
            <option value="male">Masculino</option>
            <option value="other">Otro</option>
          </Select>
        </div>

        {/* Teléfono, WhatsApp, Correo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Teléfono Móvil"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Dirección */}
        <Input
          label="Dirección Domiciliaria"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Contacto de Emergencia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <Input
            label="Contacto de Emergencia (Nombre)"
            value={emergencyContactName}
            onChange={(e) => setEmergencyContactName(e.target.value)}
          />
          <Input
            label="Teléfono de Emergencia"
            value={emergencyContactPhone}
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
          />
        </div>

        {/* Observaciones */}
        <div>
          <Input
            label="Observaciones Médicas / Alergias"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Alergias a fármacos, antecedentes odontológicos o condiciones relevantes"
          />
        </div>

        {/* Botones */}
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            {patient ? 'Guardar Cambios' : 'Registrar Paciente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
