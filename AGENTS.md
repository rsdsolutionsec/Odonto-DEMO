---
name: Registro de Auditoria en Odonto-DEMO
description: Obliga al agente a documentar cada cambio arquitectónico, de base de datos o implementación de features en auditoria.md.
---

# Reglas de Auditoría y Documentación

1. **Registro Obligatorio de Cambios**: Cada vez que realices una implementación completa, agregues un módulo, cambies la arquitectura, modifiques el esquema de la base de datos o alteres la lógica de negocio importante, **DEBES** registrar dicho cambio en el archivo `auditoria.md` que se encuentra en la raíz del proyecto.

2. **Formato del Registro**: Ve al final del archivo `auditoria.md`, bajo la sección `### Historial de Cambios`, y agrega un nuevo bullet point con el siguiente formato exacto:
   `- **YYYY-MM-DD** | **[Título corto del cambio]** | [Descripción técnica de qué se cambió, qué archivos clave se tocaron, y cuál es la finalidad/justificación].`

3. **Mantenimiento de la Arquitectura**: Si el cambio implica agregar una nueva tabla a la base de datos, un nuevo módulo principal (ej. Odontograma, Facturación), o una nueva tecnología al stack, también debes actualizar las secciones correspondientes (`2. Arquitectura y Tecnologías`, `3. Estructura de la Base de Datos` o `4. Funcionalidades Base`) del archivo `auditoria.md`.

4. **Verificación Antes de Finalizar**: Antes de dar por terminada una tarea compleja, asegúrate de haber actualizado `auditoria.md`. No le pidas al usuario que lo haga, hazlo tú mismo usando tus herramientas de edición de archivos.
