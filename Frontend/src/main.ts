import './style.css' // Asegúrate de tener este archivo o quita la línea
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <div class="container">
    <header class="search-header">
      <input 
        type="text" 
        id="search-input" 
        placeholder="Buscar lugares..." 
        class="search-bar"
      />
      <button id="search-btn">Buscar</button>
    </header>

    <div id="map-container" class="map-style">
    <div id="map" style="width: 100%; height: 500px;"></div>
    </div>
  </div>
`;

// Referencias a los elementos 
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const searchBtn = document.querySelector<HTMLButtonElement>('#search-btn');


// traemos el tokken aqui
console.log(import.meta.env.VITE_ACCESS_TOKEN_MAPBOX)
mapboxgl.accessToken = import.meta.env.VITE_ACCESS_TOKEN_MAPBOX;
const map = new mapboxgl.Map({
  container: 'map', // ID del div
  style: 'mapbox://styles/mapbox/streets-v12', // Estilo base
  center: [-78.51233, -0.22016], // [Longitud, Latitud] ¡Cuidado con el orden!
  zoom: 12
});

//todo lo que esta dentro de este load cuando el mapa tarda en cargar, sino
//primero busca la info pero no le da tiempo a cargar
map.on('load', () => {
  //cuando haga click se ejecuta eeste codigo, asincrono
  searchBtn?.addEventListener('click', async () => {

   // ✅ Utilidad de sanitización
const sanitizarTermino = (valor:any) => {
  return valor
    .trim()                          // quitar espacios extremos
    .replace(/[<>"'`;(){}]/g, '')    // eliminar caracteres peligrosos
    .replace(/\s+/g, ' ')            // colapsar espacios múltiples
    .substring(0, 100);              // limitar longitud máxima
};

const MIN_CARACTERES = 2;

// ✅ En tu función de búsqueda
const terminoBusqueda = sanitizarTermino(searchInput?.value ?? '');

if (!terminoBusqueda) {
  alert("Por favor, ingresa un lugar para buscar.");
  return;
}

if (terminoBusqueda.length < MIN_CARACTERES) {
  alert(`Ingresa al menos ${MIN_CARACTERES} caracteres para buscar.`);
  return;
}

try {
  const respuesta = await fetch(
    `http://localhost:3000/comercios?q=${encodeURIComponent(terminoBusqueda)}`
  );
      if (!respuesta.ok) throw new Error(`Error del servidor: ${respuesta.status}`);

      const featuresDesdeBD: GeoJSON.Feature<GeoJSON.Point>[] = await respuesta.json();

      const geoJsonFinal: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: featuresDesdeBD
      };

      const existingSource = map.getSource('mi-data-id');

      if (existingSource) {
        (existingSource as mapboxgl.GeoJSONSource).setData(geoJsonFinal);
      } else {
        map.addSource('mi-data-id', {
          type: 'geojson',
          data: geoJsonFinal
        });
        map.addLayer({
          id: 'capa-puntos',
          type: 'circle',
          source: 'mi-data-id',
          paint: {
            'circle-radius': 10,
            'circle-color': '#ff5733'
          }
        });
      }

      if (featuresDesdeBD.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        featuresDesdeBD.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates as [number, number]);
        });
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
          duration: 2000
        });
      } else {
        alert("No se encontraron resultados.");
      }

    } catch (error) {
      console.error("Error al buscar:", error);
      alert("Ocurrió un error al buscar. Intenta de nuevo.");
    }
  });
});