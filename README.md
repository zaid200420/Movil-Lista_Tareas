# LogistiApp - App de Tareas

Aplicación móvil multiplataforma (funciona en Android, iOS y web) para organizar tus tareas de forma simple y bonita.

---

## 📖 Índice

1. [¿Qué es LogistiApp?](#-qué-es-logistiapp)
2. [Características Principales](#-características-principales)
3. [Equipo de Trabajo](#-equipo-de-trabajo)
4. [Tecnologías que Usamos](#-tecnologías-que-usamos)
5. [Cómo Instalar y Ejecutar la App](#-cómo-instalar-y-ejecutar-la-app)
6. [Cómo Está Organizado el Proyecto](#-cómo-está-organizado-el-proyecto)
7. [Explicación de Cada Parte de la App](#-explicación-de-cada-parte-de-la-app)
8. [Cómo Funciona Internamente](#-cómo-funciona-internamente)
9. [Cómo Usar la App](#-cómo-usar-la-app)
10. [Preguntas Frecuentes](#-preguntas-frecuentes)

---

## 🤔 ¿Qué es LogistiApp?

Es una app simple para **gestionar tareas** (como una lista de quehaceres). Sus principales ventajas son:
- Es bonita y fácil de usar
- Se adapta a tu idioma y gustos de color
- Guarda tus datos incluso si cierras la app
- Tiene una pantalla de bienvenida divertida con huellas de perro 🐾

---

## ✨ Características Principales

Aquí explico cada función para que entiendas bien lo que hace la app:

### 1. Gestión de Tareas
- ✅ Crear nuevas tareas con título y descripción
- ✅ Editar tareas existentes
- ✅ Marcar tareas como completadas (se tachan automáticamente)
- ✅ Eliminar tareas que ya no necesites

### 2. Personalización Visual
- **6 Temas disponibles**:
  - Claro (blanco y colores suaves)
  - Oscuro (para usar en la noche)
  - Azul, Verde, Morado y Naranja (temas coloridos)
- **7 Opciones de color de texto**: eliges el color que más te guste para las letras principales

### 3. Multiidioma (8 idiomas!)
La app se ajusta automáticamente al idioma que elijas:
- Español
- Inglés
- Francés
- Alemán
- Italiano
- Portugués
- Chino
- Japonés

### 4. Notificaciones (Configurables)
Tu puedes decidir si quieres recibir alertas cuando:
- Se agrega una nueva tarea
- Se completa una tarea
- Es hora de un recordatorio

### 5. Estadísticas
En la pantalla de ajustes puedes ver:
- Cuántas tareas tienes en total
- Cuántas están pendientes por hacer

### 6. Pantalla de Bienvenida
Cuando abres la app, primero verás una animación de **huellas de perro** que aparecen una tras otra, y luego el texto de bienvenida. Después de 3 segundos y medio, pasa automáticamente a la pantalla principal.

---

## 👥 Equipo de Trabajo

Este proyecto fue desarrollado por:
- **Zaid Francisco Cardenas Lagos**
- **Gustavo Avila Nicolas**
- **Jose Fernando Rodriguez Guizado**

---

## 🛠️ Tecnologías que Usamos

Aquí explico cada herramienta, para que entiendas *por qué* la usamos:

| Tecnología               | ¿Qué es?                                                                 |
|--------------------------|--------------------------------------------------------------------------|
| **Expo SDK ~54**         | Plataforma que hace que sea MUY fácil crear apps para Android/iOS/web    |
| **TypeScript**           | Un "super set" de JavaScript que ayuda a no cometer errores de escritura|
| **expo-router v4**       | Sistema de navegación que organiza las pantallas de la app               |
| **Context API**          | Herramienta de React para compartir datos entre todas las pantallas      |
| **AsyncStorage**         | Lugar donde se guardan tus tareas y preferencias (se guardan permanentemente)|
| **MaterialCommunityIcons**| Librería de íconos bonitos y gratuitos                                   |
| **React Native**         | El motor que hace que la app funcione en móviles                          |

---

## 🚀 Cómo Instalar y Ejecutar la App

Incluso si nunca has programado, siguiendo estos pasos podrás usar la app:

### 📋 Requisitos Antes de Empezar

1. **Tener Node.js instalado**: Es un programa que permite ejecutar código JavaScript en tu computadora.
   - Descarga la versión LTS (más estable) aquí: https://nodejs.org/es/
2. **Tener un teléfono (o emulador)**:
   - Si usas Android: Instala la app **Expo Go** desde la Play Store
   - Si usas iOS: Usa la app **Cámara** (no necesita instalar nada extra)

---

### 📝 Paso 1: Navegar a la Carpeta del Proyecto

Abre el **Símbolo del Sistema** (en Windows) o **Terminal** (en Mac/Linux) y escribe:

```bash
cd "c:\Users\Usuario\Desktop\desaroyo movil\my-app"
```

- **Nota**: Esto asume que el proyecto está en tu escritorio. Si lo guardaste en otro lugar, cambia la ruta.

---

### 📦 Paso 2: Instalar Dependencias

Las "dependencias" son programas pequeños que la app necesita para funcionar. Escribe en la terminal:

```bash
npm install
```

- Este paso puede tardar un par de minutos, ten paciencia!
- Verás muchas líneas de texto, eso es normal.

---

### ▶️ Paso 3: Iniciar el Servidor de Desarrollo

Ahora escribe:

```bash
npx expo start --lan
```

- `--lan` significa que la app estará disponible en tu red local (para que la abras en tu teléfono)
- Espera hasta que veas un **código QR** en la terminal.

---

### 📱 Paso 4: Abrir la App en tu Teléfono

1. Asegúrate de que tu teléfono y tu computadora estén conectados a la MISMA red Wi-Fi.
2. **Android**: Abre la app Expo Go y toca "Scan QR Code" para escanear el código.
3. **iOS**: Abre la app de Cámara y apunta al código QR → te aparecerá una notificación para abrir Expo Go.

¡Listo! Ya puedes usar LogistiApp en tu teléfono.

---

## 📂 Cómo Está Organizado el Proyecto

Vamos a abrir la carpeta del proyecto y ver qué hay dentro:

```
my-app/                          # Carpeta PRINCIPAL del proyecto
├── app/                          # Aquí están TODAS LAS PANTALLAS y la NAVEGACIÓN
│   ├── (tabs)/                   # Pestañas principales (Tareas y Ajustes)
│   │   ├── index.tsx             # 👉 Pantalla de Tareas (la principal)
│   │   ├── settings.tsx          # 👉 Pantalla de Ajustes
│   │   └── _layout.tsx           # Archivo que configura las pestañas
│   ├── create-todo/              # Pantalla para CREAR una tarea
│   │   └── index.tsx
│   ├── edit-todo/                # Pantalla para EDITAR una tarea
│   │   └── [id].tsx              # El [id] es el identificador único de la tarea
│   ├── index.tsx                 # 👉 Splash Screen (pantalla de bienvenida)
│   ├── _layout.tsx               # Layout GENERAL de toda la app
│   └── modal.tsx                 # (no lo usamos en la app de tareas)
├── src/                          # Código fuente personalizado
│   ├── components/               # Componentes reutilizables (como el escáner QR)
│   ├── constants/                # Datos fijos (no cambian)
│   │   ├── themes.ts             # 🎨 Paletas de colores de TODOS los temas
│   │   ├── translations.ts       # 🌍 Traducciones en los 8 idiomas
│   │   └── seedData.ts           # Datos de ejemplo (no usado actualmente)
│   ├── context/
│   │   ├── TodoContext.tsx       # 🧠 El "cerebro" central de la app
│   │   └── AppContext.tsx        # (no usado en la app de tareas)
│   ├── types/
│   │   └── index.ts              # Tipos de datos para TypeScript
│   └── utils/                    # Funciones útiles para la versión original de LogistiApp
│       ├── clasificarZona.ts
│       ├── generarGuia.ts
│       ├── ordenarRuta.ts
│       └── validarAsignacion.ts
├── components/                   # Componentes de la plantilla Expo (no lo usamos)
├── assets/                       # Imágenes, íconos y recursos gráficos
├── package.json                  # Archivo que lista todas las dependencias
├── app.json                      # Configuración de Expo (nombre de la app, íconos, etc.)
└── README.md                     # Este archivo que estás leyendo!
```

---

## 🎯 Explicación de Cada Parte de la App

Vamos a repasar una por una las pantallas y archivos importantes:

---

### 1. Pantalla de Bienvenida (`app/index.tsx`)

- **¿Qué hace?**: Es la PRIMERA pantalla que ves al abrir la app.
- **Características**:
  - Tiene 3 huellas de perro que aparecen en secuencia (primero la izquierda, luego la del centro, luego la derecha)
  - Cada huella tiene una animación de "rebote" (se agranda y se hace visible)
  - Después aparece el texto de bienvenida en dos líneas:
    1. "Bienvenido a tu" (o equivalente en tu idioma)
    2. "App de Tareas" (o equivalente)
  - Después de **3.5 segundos**, se cierra automáticamente y pasa a la pantalla principal.
- **Tecnologías usadas**: `Animated` (de React Native) para las animaciones.

---

### 2. Pantalla Principal de Tareas (`app/(tabs)/index.tsx`)

- **¿Qué hace?**: Muestra todas tus tareas.
- **Elementos que tiene**:
  1. **Título**: "Mis Tareas" (según el idioma)
  2. **Botón de +**: Botón circular en la esquina superior derecha para agregar una tarea
  3. **Lista de tareas**: Cada tarea muestra:
     - Un círculo (para marcar como completada)
     - Título y descripción
     - Ícono de lápiz (para editar)
     - Ícono de papelera (para eliminar)
  4. **Mensaje de vacío**: Si no hay tareas, muestra "No hay tareas todavía" y "¡Agrega una nueva tarea!"
- **Tecnologías usadas**: `FlatList` (para la lista de tareas, muy eficiente incluso con muchos elementos).

---

### 3. Pantalla de Ajustes (`app/(tabs)/settings.tsx`)

- **¿Qué hace?**: Permite personalizar la app.
- **Secciones que tiene**:
  1. **Estadísticas**:
     - Tareas totales
     - Tareas pendientes
  2. **Notificaciones**:
     - Interruptor para activar/desactivar todas las notificaciones
     - Si está activado, muestra 3 opciones más: nuevas tareas, tarea completada, recordatorios
  3. **Apariencia**:
     - Tema: abre un modal para elegir entre 6 temas + modo sistema
     - Color de texto: abre un modal para elegir entre 7 colores
  4. **Idioma**: Abre un modal para elegir el idioma de la app
  5. **Información**:
     - Acerca de: muestra el nombre de la app y la versión
- **Tecnologías usadas**: `Alert` para mostrar mensajes simples, `Switch` para los interruptores, modales personalizados.

---

### 4. Pantalla de Crear Tarea (`app/create-todo/index.tsx`)

- **¿Qué hace?**: Formulario para agregar una nueva tarea.
- **Campos que tiene**:
  1. Título (obligatorio)
  2. Descripción (opcional)
- **Botón**: "Crear tarea" (si no escribes un título, te alerta)
- **Acción**: Al crear, vuelve automáticamente a la pantalla principal y la tarea aparece al principio de la lista.

---

### 5. Pantalla de Editar Tarea (`app/edit-todo/[id].tsx`)

- **¿Qué hace?**: Modifica una tarea existente.
- **Funcionamiento**:
  - Recibe el `id` único de la tarea (ej: si la tarea tiene el id `123`, la ruta es `/edit-todo/123`)
  - Carga el título y la descripción actuales de la tarea
  - Permite modificar ambos campos
  - Al guardar, actualiza la tarea y vuelve a la principal
- **Si la tarea no existe**: Muestra un mensaje de error y un botón para volver.

---

### 6. El "Cerebro" de la App: `TodoContext` (`src/context/TodoContext.tsx`)

Este es el **archivo más importante** de toda la app. Funciona como un "almacén central" que comparte datos entre todas las pantallas sin tener que pasar datos de una a otra manualmente.

Contiene:
1. **Estado de las tareas**: La lista completa de tus tareas
2. **Preferencias del usuario**:
   - Tema elegido
   - Idioma elegido
   - Color de texto elegido
   - Configuración de notificaciones
3. **Funciones para modificar los datos**:
   - `addTodo()`: Agrega una nueva tarea
   - `updateTodo()`: Edita una tarea
   - `deleteTodo()`: Elimina una tarea
   - `toggleTodo()`: Marca/desmarca como completada
   - `updatePreferences()`: Actualiza las preferencias del usuario
4. **Traducciones**: El texto `t` que usamos en todas las pantallas (elige el idioma correcto automáticamente)
5. **Tema activo**: Los colores del tema que el usuario eligió

**¿Cómo se usa?**: En cualquier pantalla, usamos el hook `useTodo()` para acceder a todos estos datos y funciones.

---

### 7. Archivo de Traducciones (`src/constants/translations.ts`)

Aquí guardamos TODO el texto de la app en los 8 idiomas. Cada idioma tiene:
- `appName`: Nombre de la app
- `splashTitle`: Primera línea de bienvenida
- `splashSubtitle`: Segunda línea de bienvenida
- `back`, `save`, `cancel`, `create`: Botones generales
- Todas las etiquetas de las pantallas
- Los nombres de los temas y colores de texto

**¿Por qué es útil?**: Si queremos agregar un nuevo idioma, solo tenemos que agregar un nuevo objeto aquí, sin tener que modificar todas las pantallas!

---

### 8. Archivo de Temas (`src/constants/themes.ts`)

Aquí definimos las paletas de colores para cada tema. Cada tema tiene:
- `background`: Color del fondo de toda la app
- `card`: Color de las tarjetas (donde van las tareas, las opciones de ajustes)
- `text`: Color del texto principal
- `textSecondary`: Color del texto secundario (descripciones, subtítulos)
- `primary`: Color principal del tema (para íconos, botones, estadísticas)
- `primaryLight`: Versión clara del color principal (para fondos de íconos)
- `border`: Color de los bordes
- `icon`: Color de los íconos (normalmente igual que `primary`)

---

## 🔍 Cómo Funciona Internamente

### Cómo se Guardan los Datos

Tus datos se guardan en **AsyncStorage**, que es como un "almacén local" en tu teléfono:
1. Cada vez que agregas, editas o eliminas una tarea, se guarda instantáneamente.
2. Cuando cambias una preferencia (tema, idioma, etc.), también se guarda.
3. Cuando abres la app de nuevo, carga automáticamente todos tus datos guardados.

### Cómo se Aplican los Temas

El proceso es:
1. El usuario elige un tema en la pantalla de ajustes.
2. Se guarda la elección en AsyncStorage.
3. El `TodoContext` lee la elección y carga la paleta de colores correspondiente.
4. Todas las pantallas usan estos colores para su fondo, texto, íconos, etc.
5. El cambio es **inmediato**, no hace falta reiniciar la app!

### Cómo Funciona el Multiidioma

Similar a los temas:
1. El usuario elige un idioma.
2. Se guarda la elección.
3. El `TodoContext` carga el objeto de traducciones correspondiente.
4. Todas las pantallas usan el texto del idioma elegido automáticamente.

---

## 📖 Cómo Usar la App

Guía paso a paso para hacer cada cosa:

### Agregar una Tarea
1. En la pantalla principal, toca el botón **+** (morado, en la esquina superior derecha).
2. Escribe un **título** (obligatorio).
3. (Opcional) Escribe una **descripción**.
4. Toca el botón **"Crear tarea"**.
5. Vuelves a la pantalla principal y tu nueva tarea aparece.

### Marcar una Tarea como Completada
1. En la lista de tareas, toca el **círculo** a la izquierda del título de la tarea.
2. El círculo se marca y el texto se tacha automáticamente.

### Editar una Tarea
1. Toca el **ícono de lápiz** a la derecha de la tarea.
2. Modifica el título y/o la descripción.
3. Toca el botón **"Guardar cambios"**.

### Eliminar una Tarea
1. Toca el **ícono de papelera** a la derecha de la tarea.
2. ¡Listo! La tarea desaparece.

### Cambiar el Tema
1. Ve a la pestaña **"Ajustes"**.
2. Toca la opción **"Tema"**.
3. Selecciona el tema que te guste en el modal.

### Cambiar el Idioma
1. Ve a **Ajustes**.
2. Toca la opción **"Idioma de la app"**.
3. Selecciona el idioma de la lista.

### Ver las Estadísticas
1. Ve a **Ajustes**.
2. En la sección **"Estadísticas"**, verás tus números.

---

## ❓ Preguntas Frecuentes

### 1. ¿Se pierden mis datos si cierro la app?
**No!** Todos los datos se guardan localmente en tu teléfono con AsyncStorage, así que están seguros incluso si apagas tu teléfono.

### 2. ¿Puedo usar la app sin internet?
¡Sí! No necesitas internet para ninguna función (solo la necesitas para instalarla la primera vez).

### 3. ¿Funciona en Android y iOS?
Sí! Expo se encarga de que funcione en ambos sistemas operativos sin tener que cambiar el código.

### 4. ¿Por qué hay carpetas como (conductor), (despacho) y (supervisor)?
Esas son de la versión original de LogistiApp (para una empresa de logística). En la app de tareas que usamos actualmente, esas carpetas **no se usan**, pero se quedaron en el proyecto.

---

## 📝 Licencia

Este proyecto fue desarrollado para fines educativos y de práctica. ¡Siéntete libre de usar el código para aprender!

---

¡Gracias por usar LogistiApp! Esperamos que te sea útil para organizar tus tareas. Si tienes dudas, ¡pregúntale a alguien del equipo de trabajo! 🐾
