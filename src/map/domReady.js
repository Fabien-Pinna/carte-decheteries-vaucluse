import domReady from '@wordpress/dom-ready';
import fetchAccessToken from '../api/api';
import initializeMap from './initializeMap';

const domInitialize = () => {
    domReady(() => {
        const blocks = document.querySelectorAll('.wp-block-create-block-carte-decheteries-vaucluse');

        blocks.forEach(block => {
            const mapContainer = block.querySelector('.map-container');

            if (!mapContainer) {
                console.error(`No map container found for block: ${block.outerHTML}`);
                return;
            }

            const lat = parseFloat(mapContainer.dataset.lat);
            const lng = parseFloat(mapContainer.dataset.lng);
            let zoom = parseFloat(mapContainer.dataset.zoom);

            if (isNaN(lat) || isNaN(lng) || isNaN(zoom)) {
                console.error(`Invalid geometry.coordinates or zoom level for block: ${block.outerHTML}`);
                return;
            }

            zoom = window.innerWidth < 768 ? 7.5 : window.innerWidth < 1024 ? 8 : 8.5;

            fetchAccessToken()
                .then(token => {
                    if (token) {
                        initializeMap(mapContainer, lat, lng, zoom, token);
                    } else {
                        console.error('Failed to retrieve Mapbox access token.');
                    }
                })
                .catch(error => console.error('Error fetching Mapbox access token:', error));
        });
    });
};

export default domInitialize;
