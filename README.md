# Gestor de Láminas FIFA 2026 - Mobile Application

Aplicación móvil nativa multiplataforma (Android) construida con Vite + Capacitor + HTML5 para administrar las láminas del álbum del Mundial FIFA 2026 en tiempo real usando Google Sheets como base de datos.

## Estructura del Proyecto

- `app/`: Contiene el código fuente de la aplicación móvil (Vite + Capacitor).
  - `app/index.html`: Interfaz premium responsiva y lógica del cliente.
  - `app/assets/`: Iconos fuente para la app.
  - `app/android/`: Código nativo del proyecto Android.
- `Codigo.gs`: Código backend para Google Apps Script.
- `.github/workflows/`: Pipelines de automatización CI/CD para compilación nativa.

## Instalación del Backend (Google Sheets)

1. Abre tu hoja de cálculo en Google Sheets.
2. Ve a **Extensiones > Apps Script**.
3. Elimina cualquier código previo y pega las funciones de [Codigo.gs](./Codigo.gs).
4. Guarda el proyecto.
5. Ve a **Implementar > Nueva implementación**.
6. Selecciona el tipo **Aplicación web**.
7. Configura:
   - **Ejecutar como:** Yo (tu correo).
   - **Quién tiene acceso:** Cualquiera (Anyone).
8. Implementa y copia la **URL de la aplicación web**.
9. Abre la aplicación móvil, ve a la sección de **Ajustes** y pega la URL.

> **Importante:** Para no exponer credenciales en el repositorio de Git, el ID de la hoja de cálculo se resuelve mediante la hoja vinculada o configurando la propiedad de script `SPREADSHEET_ID` en el editor de Apps Script.

## Desarrollo Local

Si deseas correr el frontend de desarrollo localmente:

```bash
cd app
npm install
npm run dev
```

Para compilar y sincronizar cambios con el proyecto Android nativo:

```bash
npm run build
npx cap sync android
```
