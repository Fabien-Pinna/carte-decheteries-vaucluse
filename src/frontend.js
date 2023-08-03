import ReactDOM from 'react-dom';
import domReady from '@wordpress/dom-ready';
import mapboxgl from 'mapbox-gl';
import Popup from './components/Popup';

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
        fetch('/wp-admin/admin-ajax.php?action=get_mapbox_access_token')
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

function initializeMap(mapContainer, lat, lng, zoom, accessToken) {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/fabioloco/clgqlk3z700ji01qza607558j',
        center: [lng, lat],
        zoom: zoom,
    });

    // Add fullscreen control
    const fullscreenControl = new mapboxgl.FullscreenControl();
    map.addControl(fullscreenControl, 'bottom-right');

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        trackUserLocation: true,
    });
    map.addControl(geolocateControl);

    let isStyleLoaded = false;

    map.on('style.load', function () {
        isStyleLoaded = true;
        addGeoJSONLayers();
    });

    function addGeoJSONLayers() {
        const geojsonFiles = ["privateLandfill", "publicLandfill", "secondhandAssociation"];
        geojsonFiles.forEach((file) => {
            map.addSource(file, {
                type: "geojson",
                data: `/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`,
            });

            map.addLayer({
                id: `${file}-unclustered-point`,
                type: "symbol",
                source: file,
                layout: {
                    "icon-image": "marker-15",
                    "icon-allow-overlap": true,
                    "icon-size": 1,
                },
            });

            map.on("sourcedata", (e) => {
                if (e.sourceId === file && isStyleLoaded) {
                    const features = map.querySourceFeatures(file);
                    addLandfillMarkers(features);
                }
            });
        });
    }


    function filterFeaturesByCategory(features, categories) {
        return features.filter((feature) => categories.includes(feature.properties.categorie));
    }

    const addedMarkers = {};

    const addLandfillMarkers = (landfills) => {
        landfills.forEach((landfill) => {
            const key = landfill.properties.id;

            if (!addedMarkers[key]) {
                const popupNode = document.createElement('div');
                popupNode.className = popupClassName;
                ReactDOM.render(<Popup landfill={landfill} />, popupNode);
                const marker = new mapboxgl.Marker()
                    .setLngLat(landfill.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
                    .addTo(map);

                if (landfill.properties.categorie) {
                    marker.getElement().classList.add(`marker-${landfill.properties.categorie}`);
                }

                addedMarkers[key] = marker;
            }
        });
    }

    function removeAllMarkers() {
        Object.values(addedMarkers).forEach((marker) => marker.remove());
        addedMarkers = {};
    }

    function createCategoryFilterDropdown(categories) {
        const categoryFilterDropdown = document.createElement('select');
        categoryFilterDropdown.className = 'mapboxgl-ctrl category-filter-dropdown';
        categoryFilterDropdown.addEventListener('change', (event) => {
            const selectedCategories = Array.from(event.target.options)
                .filter((option) => option.selected)
                .map((option) => option.value);

            const features = map.queryRenderedFeatures({ layers: geojsonFiles.map((file) => `${file}-unclustered-point`) });
            let filteredFeatures = features;
            if (selectedCategories.length > 0) {
                filteredFeatures = filterFeaturesByCategory(features, selectedCategories);
            }
            removeAllMarkers();
            addLandfillMarkers(filteredFeatures);
        });

        const allCategoriesOption = document.createElement('option');
        allCategoriesOption.value = '';
        allCategoriesOption.text = 'Toutes les catégories';
        categoryFilterDropdown.appendChild(allCategoriesOption);

        categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category;
            option.text = category;
            categoryFilterDropdown.appendChild(option);
        });

        return categoryFilterDropdown;
    }

    function createControlsContainer(categoryFilterDropdown) {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'mapboxgl-ctrl-top-left';

        const filterContainer = document.createElement('div');
        filterContainer.className = 'mapboxgl-ctrl';
        filterContainer.appendChild(categoryFilterDropdown);

        controlsContainer.appendChild(filterContainer);

        return controlsContainer;
    }
}
