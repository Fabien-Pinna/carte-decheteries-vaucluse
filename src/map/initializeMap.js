import mapboxgl from 'mapbox-gl';
import addControls from './controls';
import addGeoJSONLayers from './geoJSONLayers';
import addLandfillMarkers from './markers';
import addFilterControls from './addFilterControls';

const initializeMap = (mapContainer, lat, lng, zoom, accessToken) => {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/fabioloco/clnhurl0q03x101qu83e6e9r0',
        center: [lng, lat],
        zoom,
    });

    map.on('style.load', () => {
        addGeoJSONLayers(map);
    });

    addControls(map);
}

export default initializeMap;