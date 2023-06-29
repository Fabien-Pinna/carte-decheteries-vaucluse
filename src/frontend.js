import ReactDOM from 'react-dom';
import domReady from '@wordpress/dom-ready';
import mapboxgl from 'mapbox-gl';
import Popup from './components/Popup';

import './style.scss';

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

        // Adjust zoom depending on screen size
        if (window.innerWidth < 768) {
            zoom = 7.5;
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            zoom = 8;
        } else {
            zoom = 8.5;
        }

        // get api key
        fetch('/wp-admin/admin-ajax.php?action=get_mapbox_access_token')
            .then(response => response.json())
            .then(data => {
                if (data && data.accessToken) {
                    initializeMap(mapContainer, lat, lng, zoom, data.accessToken);
                } else {
                    console.error('Failed to retrieve Mapbox access token from the server.');
                }
            })
            .catch(error => {
                console.error('Error fetching Mapbox access token:', error);
            });
    });
});

function initializeMap(mapContainer, lat, lng, zoom, accessToken) {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/fabioloco/clgqlk3z700ji01qza607558j',
        center: [lng, lat],
        zoom: zoom
    });

    // Add fullscreen control
    const fullscreenControl = new mapboxgl.FullscreenControl();
    map.addControl(fullscreenControl, "bottom-right");

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    });
    map.addControl(geolocateControl);

    map.on('load', function () {
        const geojsonFiles = ['privateLandfill', 'publicLandfill', 'secondhandAssociation'];
        geojsonFiles.forEach((file) => {
            map.addSource(file, {
                type: 'geojson',
                data: `/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`,
            });

            map.addLayer({
                id: `${file}-unclustered-point`,
                type: 'symbol',
                source: file,
            });

            map.on('sourcedata', function (e) {
                if (e.sourceId === file) {
                    const features = map.querySourceFeatures(file);
                    addLandfillMarkers(features, `marker_${file}`, `popup_${file}`);
                }
            });
        });
    });

    const addedMarkers = {};

    const addLandfillMarkers = (landfills, markerClassName, popupClassName) => {
        landfills.forEach(landfill => {
            const key = landfill.properties.id;

            if (!addedMarkers[key]) {
                const popupNode = document.createElement('div');
                popupNode.className = popupClassName;
                ReactDOM.render(<Popup landfill={landfill} />, popupNode);
                const marker = new mapboxgl.Marker()
                    .setLngLat(landfill.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
                    .addTo(map);

                // Add a class depending on the category of the landfill
                if (landfill.properties.categorie) {
                    marker.getElement().classList.add(`marker-${landfill.properties.categorie}`);
                }

                addedMarkers[key] = true;
            }
        });
    };
}
