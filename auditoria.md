# Auditoría y Documentación del Proyecto: Odonto-DEMO

Este documento centraliza la arquitectura, finalidad, bases de datos y el registro histórico de todas las implementaciones realizadas por Antigravity (y otros agentes/desarrolladores) en el proyecto.

## 1. Finalidad del Proyecto
Odonto-DEMO es una aplicación web a medida para la gestión interna y reserva de citas de un consultorio odontológico. 
Está diseñada con una arquitectura escalable para permitir la futura integración de módulos como historia clínica, odontogramas, facturación y recordatorios por WhatsApp. No es un SaaS (no requiere multi-tenant).

## 2. Arquitectura y Tecnologías (Stack)
- **Framework Frontend/Backend**: Next.js 15 (App Router).
- **Lenguaje**: TypeScript.
- **Estilos**: Tailwind CSS + Shadcn UI + Lucide Icons.
- **Base de Datos y Autenticación**: Supabase (PostgreSQL).
- **Patrón de Arquitectura Frontend**: Feature-Sliced Design (FSD) simplificado. El código se organiza en `src/features/` agrupando la lógica por dominio (citas, pacientes, servicios, profesionales, consultorios).
- **Seguridad**: RLS (Row Level Security) estricto en Supabase, acceso de datos a través de Server Actions y Middleware para proteger rutas.

## 3. Estructura de la Base de Datos (Supabase)
La base de datos relacional en PostgreSQL está compuesta por las siguientes tablas principales:

1. **`professionals`**: Odontólogos/doctores con credenciales, licencias médicas y colores de agenda.
2. **`specialties`** & **`professional_specialties`**: Catálogo y asignación múltiple de especialidades a cada profesional.
3. **`services`**: Tratamientos y servicios odontológicos con duración de bloque, costo y color de identificación.
4. **`rooms`**: Consultorios físicos y sillones dentales vinculados al constraint anti-doble reserva.
5. **`patients`**: Directorio y ficha clínica de pacientes.
6. **`professional_schedules`**: Horarios semanales de atención por odontólogo.
7. **`appointments`**: Citas médicas. Contiene un constraint de exclusión (EXCLUDE USING gist) a nivel de base de datos para **evitar el double-booking** (solapamiento de citas para el mismo profesional o sillón en el mismo horario).
8. **`appointment_status_history`**: Registro inmutable de transiciones de estado de cada cita.

## 4. Funcionalidades Base (MVP)
- **Autenticación**: Login protegido con Supabase Auth y control por roles (admin, recepcionista, odontólogo).
- **Dashboard**: Vista general de métricas en tiempo real (pacientes, citas de hoy, distribución por estado).
- **Gestión de Citas (Agenda)**: Calendario interactivo semanal, diario y mensual con prevención de doble reserva, selector de disponibilidad y modal de estado.
- **Gestión de Pacientes**: Directorio completo con búsqueda, creación y edición en modal interactivo.
- **Gestión de Consultorios (Sillones Clínicos)**: Catálogo físico con creación, edición y visualización en modal, respaldado por reglas PostgreSQL.
- **Gestión de Servicios Odontológicos**: Catálogo de tratamientos con selector de color para la agenda, duración de bloque y honorarios, gestionable mediante modal.
- **Gestión de Profesionales**: Directorio médico con asignación de especialidades clínicas, credenciales y color en agenda, gestionable mediante modal.

---

## 5. Registro de Cambios e Implementaciones (Auditoría)

> **Instrucción para el Agente AI**: Cada vez que realices un cambio significativo en el código, agregues una funcionalidad, alteres la base de datos o cambies la arquitectura, **DEBES** registrarlo en esta sección, añadiendo la fecha, el cambio realizado y la justificación.

### Historial de Cambios

- **2026-09-22** | **Inicialización del MVP** | Se construyó la estructura base en Next.js 15, se configuró Tailwind y Shadcn UI. Se implementaron las entidades principales en Supabase con RLS y el constraint de exclusión para evitar solapamiento de citas. Se crearon las vistas de Dashboard, Agenda, Pacientes, Profesionales y Servicios.
- **2026-09-22** | **Creación de usuario Admin** | Se insertó el usuario `robinsonsolorzano99@gmail.com` con rol de administrador en la tabla de autenticación de Supabase (`auth.users` y `auth.identities`) usando un script SQL para asegurar el acceso a la plataforma.
- **2026-09-22** | **Remoción de Data Mockeada (Fallback)** | Se eliminaron todas las listas estáticas y arrays en memoria que actuaban como fallback en los servicios de citas, pacientes, profesionales y servicios generales. La aplicación ahora se alimenta estricta y únicamente de la base de datos Supabase, permitiendo el despliegue y uso desde cero.
- **2026-09-23** | **Modales CRUD (Consultorios, Servicios, Profesionales) y Fix de Visualización en Agenda** | Se implementaron modales interactivos de creación y edición para Consultorios (rooms), Servicios (services) y Profesionales (professionals) con sus correspondientes Server Actions y esquemas de validación Zod. Se corrigió el problema de visualización de citas en la Agenda Interactiva provocado por desalineación de zona horaria local (-05:00) vs UTC y por el rango de horas de la cuadrícula, ampliando la cobertura de horas (07:00 a 20:00) e incorporando un banner/resumen de citas semanales. Archivos modificados y creados: src/features/services/{services.ts, actions.ts, components/room-modal.tsx, components/rooms-list.tsx, components/service-modal.tsx, components/services-list.tsx}, src/features/professionals/{services.ts, actions.ts, components/professional-modal.tsx, components/professionals-list.tsx}, src/lib/scheduling/availability.ts, src/lib/validations/room.schema.ts, src/features/appointments/components/agenda-view.tsx, src/app/(dashboard)/{consultorios, servicios, profesionales, agenda, citas, page}.tsx.
