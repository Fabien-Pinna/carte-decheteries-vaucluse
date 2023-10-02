import mapboxgl from 'mapbox-gl';
import addLandfillMarkers from './markers';

const loadGeoJsonLayers = (map, addedMarkers) => {
    const geojsonFiles = ['privateLandfill', 'publicLandfill', 'secondhandAssociation'];

    map.on('load', () => {
        geojsonFiles.forEach(file => {
            map.addSource(file, {
                type: 'geojson',
                data: `/wordpress/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`,
            });

            map.addLayer({
                id: `${file}-unclustered-point`,
                type: 'symbol',
                source: file,
            });

            map.on('data', e => {
                if (e.dataType === 'source' && e.sourceId === file) {
                    const features = map.querySourceFeatures(file);
                    addLandfillMarkers(features, map, addedMarkers, `popup_${file}`);
                }
            });
        });
    });
};

export default loadGeoJsonLayers;
