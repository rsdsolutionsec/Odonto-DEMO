'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Service } from '@/types/app.types';
import { createServiceAction, updateServiceAction } from '@/features/services/actions';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { Clock, DollarSign, Palette, Check } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
}

const COLOR_PRESETS = [
  '#0d9488', // Teal
  '#0891b2', // Cyan
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#ea580c', // Orange
  '#16a34a', // Green
  '#4f46e5', // Indigo
  '#d97706', // Amber
  '#e11d48', // Rose
];

export function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [price, setPrice] = useState(50);
  const [color, setColor] = useState('#0d9488');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description || '');
      setDurationMinutes(service.duration_minutes);
      setPrice(Number(service.price));
      setColor(service.color || '#0d9488');
      setIsActive(service.is_active);
    } else {
      setName('');
      setDescription('');
      setDurationMinutes(45);
      setPrice(50);
      setColor('#0d9488');
      setIsActive(true);
    }
    setError(null);
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      description,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      color,
      isActive,
    };

    const res = service?.id
      ? await updateServiceAction(service.id, payload)
      : await createServiceAction(payload);

    setSubmitting(false);

    if (res.success) {
      onClose();
      router.refresh();
    } else {
      setError(res.error || 'Ocurrió un error al guardar el servicio');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Editar Servicio Odontológico' : 'Nuevo Servicio / Tratamiento'}
      description="Configuración de duración de bloque, honorarios y código de color para la agenda visual"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div>
          <Input
            label="Nombre del Tratamiento o Servicio"
            placeholder="Ej. Limpieza Profiláctica con Ultrasonido"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Descripción del Procedimiento
          </label>
          <textarea
            rows={2}
            className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Detalles clínicos o indicaciones del servicio..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Duración de Bloque (Minutos)"
              type="number"
              min={10}
              max={480}
              step={5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Equivale a: {formatDuration(durationMinutes)}
            </p>
          </div>

          <div>
            <Input
              label="Precio Referencial ($ USD)"
              type="number"
              min={0}
              step={0.5}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Valor: {formatCurrency(price)}
            </p>
          </div>
        </div>

        {/* Selector de Color de Agenda */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Color Identificador en la Agenda
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
            id="service_is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
          />
          <label htmlFor="service_is_active" className="text-xs text-slate-700 font-medium">
            Tratamiento activo disponible para reservas y citas
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" isLoading={submitting}>
            {service ? 'Guardar Cambios' : 'Crear Servicio'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
