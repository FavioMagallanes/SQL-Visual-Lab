# SQL Visual Lab

Un playground interactivo de SQL disenado para eliminar la friccion de aprendizaje en personas principiantes mediante retroalimentacion visual inmediata. Los usuarios pueden escribir y ejecutar consultas SQL sobre una base de datos en memoria precargada, y ver los resultados actualizarse en tiempo real con animaciones que ilustran el efecto de cada operacion.

## Objetivo

La mayoria de las herramientas de aprendizaje SQL requieren configuracion de entorno, instalacion de base de datos o conocimientos previos antes de poder ejecutar la primera consulta. SQL Visual Lab elimina esa barrera por completo: la aplicacion carga con datos ya disponibles, una consulta por defecto prellenada y resultados visibles desde el primer render. El objetivo es que una persona sin experiencia en SQL pueda comenzar a explorar y aprender en segundos de abrir la aplicacion.

## Funcionalidades

- **Exploracion instantanea de datos**: La consulta `SELECT * FROM characters` esta prellenada al cargar. Los resultados aparecen inmediatamente sin ninguna accion del usuario. Editar la consulta ejecuta automaticamente tras un debounce de 300ms.
- **Retroalimentacion visual animada**: Las operaciones DELETE desvanecen las filas afectadas. Las consultas JOIN colorean las columnas segun su tabla de origen. Las consultas SELECT resaltan las columnas recuperadas. Las animaciones estan implementadas con Framer Motion y estan disenadas para hacer intuitivo el impacto de cada operacion SQL.
- **Explicaciones con IA**: Un boton "Explicame" envia la consulta actual (y cualquier error) a una ruta de API respaldada por OpenAI, que devuelve una explicacion en lenguaje natural en espanol. Disenado para perfiles no tecnicos que necesitan entender que hace su consulta o por que fallo.
- **Proteccion contra operaciones destructivas**: DROP, ALTER, CREATE y TRUNCATE estan bloqueados con un mensaje amigable. El boton "Reiniciar BD" restaura la base de datos a su estado original en cualquier momento.
- **Atajo de teclado**: Ctrl+Enter ejecuta la consulta actual de forma inmediata, sin esperar el debounce.
- **Limite de resultados**: Se muestran como maximo 100 filas para mantener el rendimiento.

## Stack Tecnologico

| Capa | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript 5.9+ |
| Interfaz | React 19, Tailwind CSS v4, shadcn/ui |
| Motor SQL | sql.js 1.14.1 (SQLite compilado a WebAssembly, ejecutado completamente en el navegador) |
| Estado | Zustand 5 |
| Animaciones | Framer Motion 12 |
| Integracion IA | API de OpenAI (gpt-4o-mini) a traves de una ruta de API de Next.js |
| Gestor de paquetes | pnpm |

## Estructura del Proyecto

El proyecto sigue una arquitectura orientada a funcionalidades. Toda la logica de la aplicacion vive bajo `src/features/`, agrupada por dominio. El directorio `app/` esta reservado exclusivamente para el enrutamiento de Next.js y las rutas de API.

```
src/
  features/
    sql-engine/     # Inicializacion de sql.js, ejecucion de consultas, store de Zustand, parser, seed data
    editor/         # Componente textarea SQL, hook de consulta con debounce
    visualizer/     # Tabla de resultados, filas animadas, resaltado de columnas, hook de animaciones
    ai-assistant/   # Servicio de explicacion, hook useQueryExplanation, HumanButton, ExplanationPanel
  shared/
    components/     # AppLayout, ResetDatabaseButton
    types/          # Interfaces TypeScript compartidas
app/
  api/explain/      # Ruta POST: envia la consulta a OpenAI, devuelve la explicacion en espanol
  page.tsx          # Pagina raiz: compone todas las funcionalidades
```

## Dataset

La base de datos precargada contiene tres tablas:

- **characters**: 15 personajes de Star Wars (nombre, afiliacion, especie, mundo natal)
- **teams**: 12 clubes de futbol de Champions League (nombre, pais, liga, estadio)
- **fan_clubs**: 20 filas que relacionan personajes con equipos mediante una tabla puente (character_id, team_id, membership_year)

El dataset es intencionalmente ludico y multidominial para incentivar consultas JOIN y hacer el aprendizaje menos aburrido.

## Inicio Rapido

**Requisitos previos**: Node.js 20+, pnpm 9+

```bash
# Instalar dependencias (copia automaticamente el binario WASM a /public)
pnpm install

# Iniciar el servidor de desarrollo
pnpm dev
```

La aplicacion estara disponible en `http://localhost:3000`.

Para habilitar las explicaciones con IA, crea un archivo `.env.local` en la raiz del proyecto:

```
OPENAI_API_KEY=tu_clave_de_api_aqui
```

Si no se proporciona una clave de API, el boton "Explicame" sigue funcionando y devuelve un mensaje de fallback.

## Scripts Disponibles

| Comando | Descripcion |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo con Turbopack |
| `pnpm build` | Compila la aplicacion para produccion |
| `pnpm start` | Inicia el servidor de produccion |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm typecheck` | Ejecuta la verificacion de tipos de TypeScript sin emitir archivos |
| `pnpm format` | Formatea todos los archivos `.ts` y `.tsx` con Prettier |

## Decisiones de Arquitectura

- **SQLite en el cliente**: sql.js se ejecuta completamente en el navegador mediante WebAssembly. No hay base de datos en el servidor, ni ejecucion de consultas del lado del servidor, ni almacenamiento persistente. Cada sesion comienza desde cero con los datos del seed.
- **Referencia de base de datos a nivel de modulo**: La instancia `Database` de sql.js se almacena en una variable a nivel de modulo (fuera del estado de Zustand) para evitar la sobrecarga de serializacion. Zustand gestiona unicamente el estado reactivo de la UI (resultados, carga, errores).
- **Screaming architecture**: Las carpetas de funcionalidades son autocontenidas. Cada feature expone tipos, utilidades, hooks y componentes. Las dependencias entre features fluyen solo desde las de mas bajo nivel (sql-engine) hacia las de nivel superior (editor, visualizer, ai-assistant).
-  Todos los componentes reciben props directamente. El modo estricto de TypeScript esta aplicado en todo el proyecto.
