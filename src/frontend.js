import domReady from '@wordpress/dom-ready';
import initializeMap from './map/initializeMap';

import './style.scss';

domReady(() => {
    const blocks = document.querySelectorAll('.wp-block-create-block-carte-decheteries-vaucluse');
    blocks.forEach((block) => {
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

        // Adjust zoom depending on screen size
        if (window.innerWidth < 768) {
            zoom = 7.5;
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            zoom = 8;
        } else {
            zoom = 8.5;
        }

        // get api key
        fetch('/wordpress/wp-admin/admin-ajax.php?action=get_mapbox_access_token')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.accessToken) {
                    initializeMap(mapContainer, lat, lng, zoom, data.accessToken);
                } else {
                    console.error('Failed to retrieve Mapbox access token from the server.');
                }
            })
            .catch((error) => {
                console.error('Error fetching Mapbox access token:', error);
            });
    });
});
