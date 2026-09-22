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
- **Patrón de Arquitectura Frontend**: Feature-Sliced Design (FSD) simplificado. El código se organiza en `src/features/` agrupando la lógica por dominio (citas, pacientes, servicios, profesionales).
- **Seguridad**: RLS (Row Level Security) estricto en Supabase, acceso de datos a través de Server Actions y Middleware para proteger rutas.

## 3. Estructura de la Base de Datos (Supabase)
La base de datos relacional en PostgreSQL está compuesta por las siguientes tablas principales:

1. **`professionals`**: Odontólogos/doctores.
2. **`services`**: Tratamientos y servicios odontológicos (ej. Limpieza, Ortodoncia).
3. **`patients`**: Registro de pacientes.
4. **`appointments`**: Citas médicas. Contiene un constraint de exclusión (EXCLUDE USING gist) a nivel de base de datos para **evitar el double-booking** (solapamiento de citas para el mismo profesional en el mismo horario).

## 4. Funcionalidades Base (MVP)
- **Autenticación**: Login protegido (simulado/Supabase Auth).
- **Dashboard**: Vista general de métricas (pacientes, citas de hoy, ingresos simulados).
- **Gestión de Citas (Agenda)**: Calendario para agendar, visualizar y cancelar citas.
- **Gestión de Pacientes**: Directorio de pacientes, creación y visualización de perfiles básicos.
- **Servicios y Profesionales**: Administración de los tratamientos ofrecidos y el staff médico.

---

## 5. Registro de Cambios e Implementaciones (Auditoría)

> **Instrucción para el Agente AI**: Cada vez que realices un cambio significativo en el código, agregues una funcionalidad, alteres la base de datos o cambies la arquitectura, **DEBES** registrarlo en esta sección, añadiendo la fecha, el cambio realizado y la justificación.

### Historial de Cambios

- **2026-09-22** | **Inicialización del MVP** | Se construyó la estructura base en Next.js 15, se configuró Tailwind y Shadcn UI. Se implementaron las entidades principales en Supabase con RLS y el constraint de exclusión para evitar solapamiento de citas. Se crearon las vistas de Dashboard, Agenda, Pacientes, Profesionales y Servicios.
