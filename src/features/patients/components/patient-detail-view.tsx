'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  FileText,
  Activity,
  CreditCard,
  Image as ImageIcon,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AppointmentStatusBadge, PatientStatusBadge } from '@/components/ui/status-badge';
import { Patient, AppointmentWithDetails } from '@/types/app.types';
import { formatDateTime, formatDate, formatShortDate, formatCurrency } from '@/lib/utils';
import { differenceInYears, parseISO } from 'date-fns';

interface PatientDetailViewProps {
  patient: Patient;
  appointments: AppointmentWithDetails[];
}

export function PatientDetailView({ patient, appointments }: PatientDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    'citas' | 'historia' | 'odontograma' | 'presupuestos' | 'archivos'
  >('citas');

  const age = differenceInYears(new Date(), new Date(patient.birth_date));

  // Clasificar citas
  const now = new Date();
  const upcomingAppointments = appointments.filter(
    (a) => parseISO(a.start_time) >= now && !['cancelled', 'rescheduled'].includes(a.status)
  );
  const pastAppointments = appointments.filter(
    (a) => parseISO(a.start_time) < now || ['completed', 'cancelled', 'no_show'].includes(a.status)
  );

  return (
    <div className="space-y-6">
      {/* Botón Volver */}
      <div>
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al directorio de pacientes
        </Link>
      </div>

      {/* Tarjeta Principal de Información del Paciente */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {patient.first_name[0]}
              {patient.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {patient.first_name} {patient.last_name}
                </h1>
                <PatientStatusBadge status={patient.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Cédula: <span className="font-mono font-medium">{patient.document_id}</span> • {age} años ({formatShortDate(patient.birth_date)}) • Sexo: {patient.gender === 'female' ? 'Femenino' : patient.gender === 'male' ? 'Masculino' : 'Otro'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/agenda">
              <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
                <Calendar className="w-4 h-4 mr-1.5" /> Agendar Cita
              </Button>
            </Link>
          </div>
        </div>

        {/* Datos de Contacto y Emergencia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Contacto</span>
            <p className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {patient.phone}
            </p>
            {patient.email && (
              <p className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {patient.email}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Dirección</span>
            <p className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {patient.address || 'No especificada'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Contacto de Emergencia</span>
            <p className="text-slate-800 dark:text-slate-200 font-medium">
              {patient.emergency_contact_name || 'No registrado'}
            </p>
            {patient.emergency_contact_phone && (
              <p className="text-slate-500">{patient.emergency_contact_phone}</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Observaciones</span>
            <p className="text-slate-700 dark:text-slate-300 italic">
              {patient.notes || 'Sin observaciones registradas.'}
            </p>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación por Dominio Clínico */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto space-x-1">
        <button
          onClick={() => setActiveTab('citas')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'citas'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Historial de Citas ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('historia')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'historia'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" /> Historia Clínica / Anamnesis
          <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full font-normal">Escalable</span>
        </button>

        <button
          onClick={() => setActiveTab('odontograma')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'odontograma'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Odontograma
          <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded-full font-normal">Escalable</span>
        </button>

        <button
          onClick={() => setActiveTab('presupuestos')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'presupuestos'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Presupuestos y Pagos
        </button>

        <button
          onClick={() => setActiveTab('archivos')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'archivos'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4" /> Radiografías y Archivos
        </button>
      </div>

      {/* CONTENIDO DE PESTAÑAS */}

      {/* 1. CITAS E HISTORIAL */}
      {activeTab === 'citas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Citas */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Citas Programadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-brand-500 transition-all flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{appt.service.name}</span>
                        <AppointmentStatusBadge status={appt.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Dr. {appt.professional.first_name} {appt.professional.last_name} • {appt.room.name}
                      </p>
                      <p className="text-xs text-brand-700 font-semibold mt-1">
                        {formatDateTime(appt.start_time)}
                      </p>
                    </div>
                  </div>
                ))}

                {upcomingAppointments.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No tiene citas futuras programadas actualmente.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Historial Pasado */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Atenciones Clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">{appt.service.name}</span>
                        <AppointmentStatusBadge status={appt.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Dr. {appt.professional.first_name} {appt.professional.last_name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {formatDateTime(appt.start_time)}
                      </p>
                      {appt.cancellation_reason && (
                        <p className="text-[11px] text-rose-600 mt-1">
                          Motivo cancelación: {appt.cancellation_reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {pastAppointments.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No hay atenciones pasadas registradas.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2. HISTORIA CLÍNICA / ANAMNESIS (Estructura Modular Preparada) */}
      {activeTab === 'historia' && (
        <Card>
          <CardHeader>
            <CardTitle>Anamnesis y Antecedentes Médicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800">
              <span className="font-bold">Módulo de Historia Clínica Preparado:</span> La tabla de pacientes y la arquitectura de la base de datos están listas para vincular tablas independientes como <code>medical_histories</code>, <code>allergies</code>, <code>vital_signs</code> y <code>clinical_notes</code> sin alterar la entidad central de pacientes.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Antecedentes Sistémicos</h4>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>• Hipertensión Arterial: <span className="font-medium text-slate-800">No reportada</span></li>
                  <li>• Diabetes Mellitus: <span className="font-medium text-slate-800">No reportada</span></li>
                  <li>• Trastornos de coagulación: <span className="font-medium text-slate-800">No</span></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase">Alergias Conocidas</h4>
                <p className="text-xs text-rose-700 font-medium">
                  {patient.notes?.toLowerCase().includes('alergia') ? patient.notes : 'Sin alergias a anestésicos reportadas.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. ODONTOGRAMA (Layout Dental Preparado) */}
      {activeTab === 'odontograma' && (
        <Card>
          <CardHeader>
            <CardTitle>Odontograma Anatómico FDI (Preparado para Digitalización)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              Diseño estructural preparado para representar las 5 caras dentales (Vestibular, Oclusal, Lingual/Palatina, Mesial, Distal) según la convención internacional FDI.
            </div>

            {/* Arcada Superior */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Arcada Superior (Maxilar)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => (
                  <div
                    key={tooth}
                    className="w-10 h-14 rounded-lg border border-slate-300 bg-white hover:border-brand-500 hover:bg-brand-50 cursor-pointer flex flex-col items-center justify-between p-1 transition-all"
                  >
                    <span className="text-[10px] font-bold text-slate-700">{tooth}</span>
                    <div className="w-5 h-5 rounded-full border border-slate-300 bg-slate-100" />
                    <span className="text-[8px] text-slate-400">Sano</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arcada Inferior */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Arcada Inferior (Mandibular)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((tooth) => (
                  <div
                    key={tooth}
                    className="w-10 h-14 rounded-lg border border-slate-300 bg-white hover:border-brand-500 hover:bg-brand-50 cursor-pointer flex flex-col items-center justify-between p-1 transition-all"
                  >
                    <span className="text-[10px] font-bold text-slate-700">{tooth}</span>
                    <div className="w-5 h-5 rounded-full border border-slate-300 bg-slate-100" />
                    <span className="text-[8px] text-slate-400">Sano</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. PRESUPUESTOS Y PAGOS */}
      {activeTab === 'presupuestos' && (
        <Card>
          <CardHeader>
            <CardTitle>Presupuestos y Estado de Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-slate-400 text-xs">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Estructura lista para planes de tratamiento valorados, cuotas y recibos de caja.
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. ARCHIVOS Y RADIOGRAFÍAS */}
      {activeTab === 'archivos' && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos Clínicos y Radiografías (Supabase Storage)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center text-slate-400 text-xs">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              Listo para integrar bucket privado de Supabase Storage con políticas RLS de acceso clínico.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
