# OdontoClinic - Sistema de Gestión Odontológica

Aplicación web moderna y escalable para la gestión clínica, administración de pacientes y reserva de citas de consultorio odontológico único. Desarrollada con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL)** y **Row Level Security (RLS)**.

---

## 🚀 Guía Rápida de Conexión a Supabase

### 1. Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env.local` y completa los valores con las credenciales de tu proyecto Supabase:

```bash
cp .env.example .env.local
```

Configura en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **¿Dónde obtener las claves?**  
> En tu panel de Supabase: **Project Settings -> API**  
> - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`  
> - `Project API keys -> anon / public` -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
> - `Project API keys -> service_role (secret)` -> `SUPABASE_SERVICE_ROLE_KEY`

---

### 2. Conectar y Aplicar Migraciones por CLI de Supabase

1. **Iniciar sesión en la CLI**:
   ```bash
   npx supabase login
   ```

2. **Vincular el proyecto local con tu instancia de Supabase**:
   ```bash
   npx supabase link --project-ref <tu-project-ref>
   ```

3. **Aplicar las migraciones a PostgreSQL**:
   ```bash
   npx supabase db push
   ```

*(Alternativamente, puedes copiar el contenido de los archivos SQL en `supabase/migrations/` y ejecutarlos directamente desde el **SQL Editor** del panel de Supabase en el orden numérico).*

4. **Regenerar tipos de TypeScript (Opcional si cambias el esquema)**:
   ```bash
   npx supabase gen types typescript --project-id <tu-project-ref> > src/types/database.types.ts
   ```

---

## 🏛️ Arquitectura de Base de Datos y Prevención de Doble Reserva

### Control Anti-Doble Reserva (PostgreSQL Exclusion Constraints)
El sistema utiliza la extensión `btree_gist` de PostgreSQL para aplicar **restricciones de exclusión a nivel de motor de base de datos**:

1. **Odontólogo**: Impide que el mismo profesional tenga citas con solapamiento temporal (`tstzrange` con operador `&&`).
2. **Consultorio / Sillón**: Impide que dos citas ocurran simultáneamente en el mismo sillón.
3. Las cancelaciones y reprogramaciones liberan inmediatamente el bloque horario.

```sql
ALTER TABLE appointments 
ADD CONSTRAINT no_overlapping_professional_appointments
EXCLUDE USING gist (
    professional_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
) WHERE (status NOT IN ('cancelled', 'rescheduled'));
```

---

## 📋 Módulos y Funcionalidades del MVP

| Módulo | Descripción |
|---|---|
| **Dashboard** | Métricas en tiempo real (citas hoy, confirmadas, en espera, completadas, cancelaciones), cronograma del día y estado de sillones. |
| **Agenda Dental** | Visualización en vistas **Día**, **Semana** y **Mes**, filtros por profesional y sillón, indicadores de color por tratamiento. |
| **Reserva en 8 Pasos** | Flujo guiado con cálculo automático de hora final según duración del servicio y visualización de disponibilidad real. |
| **Gestión de Estados** | Control del ciclo de vida clínico: `pending` -> `confirmed` -> `checked_in` -> `in_progress` -> `completed` / `cancelled` / `no_show`. Historial inmutable en `appointment_status_history`. |
| **Pacientes** | Directorio con búsqueda por cédula, nombre y teléfono, modal de registro con validaciones Zod y ficha clínica extensible. |
| **Ficha del Paciente** | Pestañas preparadas para futura expansión por dominio: Historia Médica, Odontograma FDI (32 dientes), Presupuestos y Radiografías (Storage). |
| **Profesionales** | Catálogo de odontólogos, números de colegiatura y asignación de múltiples especialidades. |
| **Servicios** | Catálogo de tratamientos con precios referenciales, duraciones fijas y códigos hexadecimales para la agenda. |
| **Consultorios** | Sillones dentales físicos vinculados al control de concurrencia. |

---

## 💻 Desarrollo Local

Para correr el servidor de desarrollo:

```bash
npm run dev
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)
