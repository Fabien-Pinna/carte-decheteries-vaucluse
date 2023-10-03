import mapboxgl from 'mapbox-gl';
import addcontrols from './controls';
import addGeoJSONLayers from './geoJSONLayers';
import addLandfillMarkers from './markers';

const initializeMap = (mapContainer, lat, lng, zoom, accessToken) => {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/fabioloco/clgqlk3z700ji01qza607558j',
        center: [lng, lat],
        zoom: zoom,
    });

    let isStyleLoaded = false;

    map.on('style.load', function () {
        isStyleLoaded = true;
        addGeoJSONLayers(map, isStyleLoaded);
    });

    addcontrols(map);
    addLandfillMarkers([], '', map)
}

export default initializeMap;