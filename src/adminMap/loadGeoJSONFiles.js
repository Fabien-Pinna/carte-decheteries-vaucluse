import ReactDOM from 'react-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { createAndAppendElement } from '../utils/createAndAppendElement';
import Popup from '../components/Popup/Popup';


// Function to load GeoJSON files and add layers to the map
export const loadGeoJSONFiles = async (map, files) => {
    for (const file of files) {
        const dataUrl = `/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`;
        const { data } = await axios.get(dataUrl);

        // Add source and layer to the map
        map.addSource(file, { type: 'geojson', data });
        const layerId = `${file}-unclustered-point`;
        map.addLayer({
            id: layerId,
            type: 'symbol',
            source: file,
            layout: {
                'icon-image': ['get', 'icon'],
                'icon-size': 0.5,
                'icon-allow-overlap': true,
            },
        });

        // Add mouse events for cursor style
        map.on('mouseenter', layerId, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = ''; });

        // Add click event to show popup
        map.on('click', layerId, (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;
            const popupNode = createAndAppendElement('div', { className: `popup_${file}` }, document.body);
            ReactDOM.render(<Popup landfill={{ properties }} />, popupNode);
            new mapboxgl.Popup().setLngLat(coordinates).setDOMContent(popupNode).addTo(map);
        });
    }
};