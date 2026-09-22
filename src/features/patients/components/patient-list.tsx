'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, User, Phone, Mail, FileText, ChevronRight, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PatientStatusBadge } from '@/components/ui/status-badge';
import { Patient } from '@/types/app.types';
import { PatientModal } from './patient-modal';
import { formatShortDate } from '@/lib/utils';

export function PatientList({ initialPatients }: { initialPatients: Patient[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const filteredPatients = initialPatients.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = `${p.first_name} ${p.last_name}`.toLowerCase().includes(q);
      const matchDoc = p.document_id.toLowerCase().includes(q);
      const matchPhone = p.phone.toLowerCase().includes(q);
      return matchName || matchDoc || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Barra de Filtros y Acciones */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre, cédula o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingPatient(null);
            setIsModalOpen(true);
          }}
          className="bg-brand-600 hover:bg-brand-700 text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1" /> Nuevo Paciente
        </Button>
      </div>

      {/* Tabla de Pacientes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Identificación</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">F. Nacimiento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/pacientes/${patient.id}`}
                      className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand-600 transition-colors flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-700 font-semibold flex items-center justify-center text-xs">
                        {patient.first_name[0]}
                        {patient.last_name[0]}
                      </div>
                      <span>
                        {patient.first_name} {patient.last_name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {patient.document_id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{patient.phone}</span>
                    </div>
                    {patient.email && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Mail className="w-3 h-3" />
                        <span>{patient.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {formatShortDate(patient.birth_date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <PatientStatusBadge status={patient.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setEditingPatient(patient);
                        setIsModalOpen(true);
                      }}
                      title="Editar ficha"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/pacientes/${patient.id}`}
                      title="Ver Historial Clínico"
                      className="inline-flex items-center p-1.5 rounded-lg text-brand-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No se encontraron pacientes registrados con los filtros especificados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPatient(null);
        }}
        patient={editingPatient}
      />
    </div>
  );
}
