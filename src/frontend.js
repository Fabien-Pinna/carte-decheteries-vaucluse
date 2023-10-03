import domReady from '@wordpress/dom-ready';
import fetchDataAndInitializeMap from './api/fetchDataAndInitializeMap';

import './style.scss';

const SMALL_SCREEN_ZOOM = 7.5;
const MEDIUM_SCREEN_ZOOM = 8;
const LARGE_SCREEN_ZOOM = 8.5;

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
            zoom = SMALL_SCREEN_ZOOM;
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            zoom = MEDIUM_SCREEN_ZOOM;
        } else {
            zoom = LARGE_SCREEN_ZOOM;
        }

        fetchDataAndInitializeMap(mapContainer, lat, lng, zoom);
    });
});
