'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfessionalWithSpecialties, Specialty } from '@/types/app.types';
import { createProfessionalAction, updateProfessionalAction } from '@/features/professionals/actions';
import { Check } from 'lucide-react';

interface ProfessionalModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional?: ProfessionalWithSpecialties | null;
  specialties: Specialty[];
}

const COLOR_PRESETS = [
  '#2563eb', // Blue
  '#0d9488', // Teal
  '#7c3aed', // Purple
  '#0284c7', // Sky
  '#16a34a', // Green
  '#d97706', // Amber
  '#dc2626', // Red
  '#e11d48', // Rose
  '#4f46e5', // Indigo
];

export function ProfessionalModal({
  isOpen,
  onClose,
  professional,
  specialties,
}: ProfessionalModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (professional) {
      setFirstName(professional.first_name);
      setLastName(professional.last_name);
      setDocumentId(professional.document_id);
      setLicenseNumber(professional.license_number);
      setPhone(professional.phone);
      setEmail(professional.email);
      setColor(professional.color || '#2563eb');
      setSelectedSpecialtyIds(professional.specialties.map((s) => s.id));
      setIsActive(professional.is_active);
    } else {
      setFirstName('');
      setLastName('');
      setDocumentId('');
      setLicenseNumber('');
      setPhone('');
      setEmail('');
      setColor('#2563eb');
      setSelectedSpecialtyIds(specialties[0] ? [specialties[0].id] : []);
      setIsActive(true);
    }
    setError(null);
  }, [professional, isOpen, specialties]);

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialtyIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSpecialtyIds.length === 0) {
      setError('Debe seleccionar al menos una especialidad clínica.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      firstName,
      lastName,
      documentId,
      licenseNumber,
      phone,
      email,
      color,
      specialtyIds: selectedSpecialtyIds,
      isActive,
    };

    const res = professional?.id
      ? await updateProfessionalAction(professional.id, payload)
      : await createProfessionalAction(payload);

    setSubmitting(false);

    if (res.success) {
      onClose();
      router.refresh();
    } else {
      setError(res.error || 'Ocurrió un error al guardar el profesional');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={professional ? 'Editar Ficha Profesional' : 'Registrar Nuevo Odontólogo'}
      description="Perfil médico, credenciales profesionales, especialidades y código visual para la agenda"
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
            placeholder="Ej. Carlos Eduardo"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Apellidos"
            placeholder="Ej. Mendoza Paredes"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Identificación y Colegiatura */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Identificación / Cédula"
            placeholder="10 dígitos"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            required
          />
          <Input
            label="N° de Colegiatura / Licencia Médica"
            placeholder="Ej. MSP-17-9021"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
          />
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Teléfono Móvil"
            placeholder="Ej. 0991234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="doctor@odontoclinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Selección de Especialidades */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Especialidades Médicas Asignadas (Seleccione al menos una)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-36 overflow-y-auto p-1">
            {specialties.map((spec) => {
              const isChecked = selectedSpecialtyIds.includes(spec.id);
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => toggleSpecialty(spec.id)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    isChecked
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  <span className="truncate mr-1">{spec.name}</span>
                  {isChecked && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color en la Agenda */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Color Identificador del Profesional en la Agenda
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-xs border border-white dark:border-slate-800"
                style={{ backgroundColor: preset }}
                title={preset}
              >
                {color.toLowerCase() === preset.toLowerCase() && (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                )}
              </button>
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-7 h-7 rounded-full border border-slate-200 cursor-pointer overflow-hidden p-0"
              title="Personalizar color"
            />
            <span className="text-xs font-mono text-slate-500 uppercase ml-2">{color}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="prof_is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
          <label htmlFor="prof_is_active" className="text-xs text-slate-700 font-medium">
            Profesional activo en clínica y disponible para agendamiento
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" isLoading={submitting}>
            {professional ? 'Guardar Cambios' : 'Registrar Profesional'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
