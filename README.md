SpaceX Dashboard
Descripción

SpaceX Dashboard es una aplicación desarrollada en React que consume la API pública de SpaceX para visualizar información sobre los lanzamientos espaciales.

La aplicación permite:

Consultar lanzamientos de SpaceX.
Filtrar por nombre y fecha.
Ordenar información por diferentes columnas.
Visualizar detalles expandibles de cada lanzamiento.
Mostrar la ubicación del sitio de lanzamiento en un mapa interactivo.
Exportar información individual o múltiple a PDF.
Tecnologías utilizadas
React
Vite
JavaScript
React Leaflet
Leaflet
jsPDF
jsPDF AutoTable
SpaceX Public API
Requisitos previos


Instalación del proyecto
1. Clonar el repositorio
git clone https://github.com/mariocanul23/spacex-dashboard.git
2. Entrar al directorio
cd spacex-dashboard
3. Instalar dependencias
npm install
Dependencias utilizadas

Si se requiere instalarlas manualmente:

React Leaflet y Leaflet

npm install leaflet react-leaflet

Generación de PDF

npm install jspdf jspdf-autotable

Ejecutar el proyecto

Iniciar servidor de desarrollo:

npm run dev

La aplicación estará disponible normalmente en:

http://localhost:5173

Los archivos generados se encontrarán en:

dist/
Funcionalidades implementadas
Tabla principal
Visualización de lanzamientos SpaceX.
Paginación.
Ordenamiento por:
Nombre
Fecha
Estado
Filtros
Filtro por nombre.
Filtro por fecha.
Limpieza de filtros.
Detalle expandible

Al seleccionar un registro se despliega una tarjeta con:

Nombre del lanzamiento.
Fecha.
Estado.
Número de vuelo.
Ubicación.
Descripción.
Enlace de transmisión (si existe).
Mapa interactivo

Visualización del sitio de lanzamiento utilizando:

OpenStreetMap
React Leaflet

Incluye marcador geográfico del launchpad.

Exportación PDF
Exportación individual

Permite exportar:

Información general.
Estado.
Ubicación.
Coordenadas.
Detalles del lanzamiento.
Exportación múltiple

Permite:

Seleccionar varios registros.
Exportar todos en un único PDF.
Generar un resumen con el total de registros exportados.
Consideraciones sobre imágenes

La API de SpaceX proporciona imágenes alojadas en dominios externos.

Algunos servidores bloquean el acceso mediante políticas CORS, lo que impide incrustar ciertas imágenes directamente en el PDF desde el navegador.

Por esta razón:

Las imágenes se muestran correctamente en la interfaz.
En el PDF se exporta la URL de la imagen cuando el recurso externo no permite su descarga.

Endpoints utilizados:

https://api.spacexdata.com/v5/launches
https://api.spacexdata.com/v4/launchpads

Autor

Mario Alberto Canul Cardeña
