import mapboxgl from 'mapbox-gl';
import addControls from './controls';
import addGeoJSONLayers from './geoJSONLayers';

const initializeMap = (mapContainer, lat, lng, zoom, accessToken) => {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/fne-84/clnvktp5w001n01qqd2vdhg17',
        center: [lng, lat],
        zoom,
    });

    map.on('style.load', () => {
        addGeoJSONLayers(map);
    });

    addControls(map);
}

export default initializeMap;