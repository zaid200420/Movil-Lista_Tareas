# 📝 TodoApp - Aplicación de Gestión de Tareas

¡Bienvenido(a) a la documentación de **TodoApp**! Este archivo está diseñado para que cualquier persona, sin importar su nivel de conocimientos técnicos, pueda entender qué hace esta aplicación, cómo está construida y dónde se encuentra cada pieza del rompecabezas.

---

## 🎯 ¿Qué es esta aplicación?
**TodoApp** es una aplicación móvil (y web) diseñada para la gestión integral de tareas. Permite a los usuarios registrarse, iniciar sesión, crear nuevas tareas, organizarlas por prioridad, establecer fechas límite, escanear códigos QR y mantener un historial organizado de todo lo que tienen pendiente o ya han completado.

---

## 📂 ¿Dónde está cada cosa? (Estructura del Proyecto)

Imagina que la aplicación es una casa. Algunas partes son la "fachada" (lo que ves y tocas), y otras son las "tuberías y cables" (lo que hace que todo funcione por detrás).

### 1. La "Fachada" y Habitaciones (`/app`)
La carpeta `app` contiene todas las **pantallas visibles** de la aplicación. Aquí es donde el usuario interactúa. Funciona mediante un sistema donde cada archivo o carpeta representa una ruta o pantalla:

*   **`_layout.tsx`**: Es como el plano principal de la casa. Aquí se configuran los cimientos visuales (temas, colores globales) y se envuelve la aplicación con los permisos y datos básicos.
*   **`index.tsx`**: La puerta principal. Se encarga de redirigir al usuario al área correcta (generalmente a la pantalla de inicio de sesión o al menú principal si ya está conectado).
*   **`login.tsx`**: Pantalla donde el usuario ingresa su correo y contraseña para entrar.
*   **`register.tsx`**: Pantalla para crear una cuenta nueva.
*   **`(tabs)`**: Esta carpeta es el **Menú Principal**. Todo lo que está aquí adentro tiene una barra de navegación inferior (los botoncitos de abajo en la pantalla). Contiene pantallas como el inicio y los ajustes de perfil.
*   **`create-todo` / `edit-todo`**: Pantallas específicas donde aparece el formulario para crear una nueva tarea o modificar una existente.
*   **`task`**: Pantalla para ver el detalle de una tarea específica (leer toda su información).
*   **`modal.tsx`**: Pantallas flotantes que aparecen por encima de la vista normal, utilizadas para avisos o configuraciones rápidas.

### 2. El "Motor" y Tuberías (`/src`)
La carpeta `src` (Source) contiene el cerebro de la aplicación. Aquí no hay pantallas enteras, sino las piezas de Lego que hacen que las pantallas funcionen:

*   **`/src/components`**: Pequeñas piezas reutilizables. Por ejemplo, el archivo `QRScanner.tsx` es la herramienta de la cámara que puede usarse en cualquier pantalla para leer códigos QR.
*   **`/src/context`**: La memoria a corto plazo de la app. Aquí se guarda la información mientras usas la app para no tener que cargarla de nuevo:
    *   `AuthContext.tsx`: Recuerda quién eres, si has iniciado sesión y cierra tu sesión.
    *   `TodoContext.tsx`: Mantiene la lista de tareas al día (tus pendientes, completadas, etc.).
    *   `SettingsContext.tsx`: Guarda tus preferencias, como si prefieres el modo oscuro o el modo claro.
*   **`/src/types/index.ts`**: El diccionario de la app. Aquí se definen reglas estrictas de qué es una "Tarea" (debe tener un título, una fecha, una prioridad) para evitar errores.
*   **`/src/constants`**: Configuraciones fijas. Contiene cosas como `themes.ts` (los colores exactos que usa la aplicación) o `translations.ts` (los textos en diferentes idiomas).
*   **`/src/firebase`**: La conexión con la base de datos en la nube. Aquí está la configuración (`config.ts`) que permite que tus tareas se guarden en internet para que no se pierdan si borras la app.

---

## 🛠️ Ficha Técnica (Para Desarrolladores)

Esta sección detalla las tecnologías exactas, lenguajes y versiones (frameworks) utilizados para construir y hacer funcionar esta aplicación.

### Lenguaje de Programación
*   **TypeScript (v5.9.2)**: Es un superconjunto de JavaScript que añade tipado estricto. Esto hace que el código sea mucho más seguro, robusto y fácil de mantener a largo plazo.

### Tecnologías Principales (Core)
*   **React (v19.1.0)**: La biblioteca base para construir la interfaz de usuario basada en componentes.
*   **React Native (v0.81.5)**: El framework que permite usar React para crear aplicaciones móviles nativas reales (no simples páginas web envueltas), logrando un rendimiento excelente en iOS y Android.
*   **Expo (v54.0.36)**: El ecosistema y plataforma que envuelve a React Native. Facilita enormemente el desarrollo al proporcionar acceso directo a la cámara, almacenamiento y notificaciones sin tener que escribir código complejo en Java o Swift.

### Enrutamiento y Navegación
*   **Expo Router (v6.0.24)**: El sistema moderno de navegación de Expo. Funciona basado en archivos (File-based routing), lo que significa que la estructura de carpetas en `/app` define automáticamente cómo navega el usuario por las pantallas, de manera similar a como funcionan las páginas web con Next.js.
*   **React Navigation Bottom Tabs (v7.4.0)**: Utilizado internamente por Expo Router para manejar la barra de navegación inferior en la carpeta `(tabs)`.

### Base de Datos y Backend
*   **Firebase (v12.17.1)**: La plataforma en la nube utilizada para la autenticación de usuarios y la persistencia de los datos (guardar las tareas).
*   **AsyncStorage (v2.2.0)**: Sistema de almacenamiento local en el teléfono. Se usa para guardar cosas de forma rápida, como la sesión del usuario (para que no tenga que iniciar sesión cada vez que abre la app) o las tareas cuando no hay internet.

### Herramientas Nativas de Expo (Módulos)
La aplicación hace uso de varios módulos optimizados de Expo para funcionalidades del dispositivo:
*   `expo-camera`: Para la lectura de códigos QR.
*   `expo-image-picker`: Para poder seleccionar fotos de la galería o tomar fotos de perfil.
*   `expo-haptics`: Para dar pequeñas vibraciones al tocar botones y mejorar la experiencia de usuario.
*   `expo-status-bar`: Para cambiar el color de la barra superior del celular (donde está la batería) según el modo claro/oscuro.

---

*Desarrollado con ❤️ y optimizado para una gestión de tareas eficiente y sin distracciones.*
