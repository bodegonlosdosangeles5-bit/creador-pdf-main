# 📱 Instalación en Android como App Nativa

## Cómo Instalar "Creador de PDF" en tu Teléfono Android

### Método 1: Desde Chrome (Método Más Rápido)

1. **Abrir la aplicación en Chrome**:
   - Abre Chrome en tu teléfono Android
   - Ve a la URL: `http://TU_IP:8081` (reemplaza TU_IP con la IP que ves en la terminal)

2. **Instalar la PWA**:
   - Chrome mostrará un banner en la parte inferior que dice "Agregar a pantalla principal"
   - O haz clic en el menú (⋮) de Chrome y selecciona **"Instalar aplicación"**

3. **Confirmar instalación**:
   - Toca el botón **"Instalar"** o **"Agregar"**
   - La app aparecerá en tu pantalla principal como una app nativa

### Método 2: Desde el Menú de Chrome

1. Abre Chrome y navega a la aplicación
2. Toca el menú (⋮) de Chrome
3. Selecciona **"Agregar a pantalla de inicio"**
4. Personaliza el nombre si quieres
5. Toca **"Agregar"**

### Acceder a la App Instalada

- Busca el ícono "Creador PDF" en tu pantalla de inicio
- La app se abrirá en modo standalone (sin la barra de navegación del navegador)
- Funciona offline después de la primera carga
- Se actualiza automáticamente cuando hay cambios

## Publicar en Producción

Para que funcione desde cualquier lugar, necesitas:

1. **Hosting gratuito** recomendado:
   - [Vercel](https://vercel.com) - GitHub automático
   - [Netlify](https://netlify.com) - GitHub automático
   - [GitHub Pages](https://pages.github.com)

2. **Subir tu código a GitHub**:
   ```bash
   git add .
   git commit -m "Add PWA support"
   git push
   ```

3. **Conectar a Vercel/Netlify**:
   - Conecta tu repositorio
   - Deploy automático
   - URL pública tipo: `https://creador-pdf.vercel.app`

4. **Instalar desde producción**:
   - Abre la URL en Chrome
   - Sigue los pasos del Método 1
   - Funciona desde cualquier lugar del mundo

## Características de la PWA

✅ **Modo standalone** - Sin barra del navegador
✅ **Funciona offline** - Cache de todos los archivos
✅ **Actualizaciones automáticas**
✅ **Diseño responsive** - Perfecto en móvil
✅ **Instalable** - Como app nativa
✅ **Rápida** - Optimizada para móviles

## Troubleshooting

**No aparece el banner de instalación:**
- Asegúrate de estar en HTTPS o localhost
- Actualiza Chrome a la última versión
- Intenta desde el menú de Chrome

**La app no funciona offline:**
- Espera a que cargue completamente la primera vez
- Recarga la página una vez instalada

**Los iconos no se ven:**
- Limpia el cache de Chrome
- Reinstala la app

