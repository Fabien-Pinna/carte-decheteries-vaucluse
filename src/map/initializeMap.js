import mapboxgl from 'mapbox-gl';
import addControl from './controls';
import loadGeoJsonLayers from './geoJsonLayers';

const initializeMap = (container, lat, lng, zoom, accessToken) => {
    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/fabioloco/clgqlk3z700ji01qza607558j',
        center: [lng, lat],
        zoom: zoom
    });

    addControl(map);
    loadGeoJsonLayers(map);

    return map;
};

export default initializeMap;
