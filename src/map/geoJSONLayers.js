import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { getLabelForSymbol } from '../utils/getLabelForSymbol';
import { createAndAppendElement } from '../utils/createAndAppendElement';
import { applyCombinedFilters } from '../map/filters';
import { resetFilters } from '../map/resetFilters';
import Popup from '../components/Popup/Popup';

// Main function to add GeoJSON layers
const addGeoJSONLayers = (map) => {
    const geojsonFiles = ['privateLandfill', 'publicLandfill', 'secondhandAssociation'];
    const wasteTypes = ['Amiante', 'Bois', 'Cartons', 'DEEE', 'Encombrants', 'Gravats', 'Huiles', 'Metaux', 'Pneus', 'Vegetaux', 'Verre'];

    // Create and append filters block
    const filtersBlock = createAndAppendElement(
        'div',
        {
            className: 'filters-block'
        },
        document.getElementsByClassName('map-container')[0]
    );

    const filtersTab = createAndAppendElement(
        'div',
        {
            className: 'filters-tab'
        },
        document.getElementsByClassName('map-container')[0]
    );

    // Create and append filter groups

    const filterGroup = createAndAppendElement(
        'nav',
        {
            id: 'filter-group',
            className: 'filter-group'
        },
        filtersBlock
    );

    const filterGroupTitle = createAndAppendElement(
        'h5',
        {
            className: 'filter-group-title',
            textContent: 'Filtrer par Catégories'
        },
        filterGroup
    );
    filterGroup.appendChild(filterGroupTitle);


    const wasteFilterGroup = createAndAppendElement(
        'nav',
        {
            id: 'waste-filter-group',
            className:
                'waste-filter-group'
        },
        filtersBlock
    );

    const wasteFilterGroupTitle = createAndAppendElement(
        'h5',
        {
            className: 'filter-group-title',
            textContent: 'Filtrer par Déchets'
        },
        wasteFilterGroup
    );
    wasteFilterGroup.appendChild(wasteFilterGroupTitle);

    const resetButton = createAndAppendElement(
        'button',
        {
            id: 'reset-filters',
            className: 'reset-filters',
            textContent: 'Réinitialiser Filtres'
        },
        filtersBlock
    );

    const toggleFilterDrawer = () => {
        const filtersBlock = document.querySelector('.filters-block');
        if (filtersBlock.classList.contains('open')) {
            filtersBlock.classList.remove('open');
        } else {
            filtersBlock.classList.add('open');
        }
    };

    filtersTab.addEventListener('click', toggleFilterDrawer);

    const adjustFilterBlockHeight = () => {
        const canvasHeight = document.querySelector('.map-container canvas').offsetHeight;
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const offset = rootFontSize * 2; // 2rem
        const maxHeight = canvasHeight - offset;
        document.querySelector('.filters-block').style.maxHeight = `${maxHeight}px`;
    };

    adjustFilterBlockHeight();

    // Adjust the height when the window is resized
    window.addEventListener('resize', adjustFilterBlockHeight);

    // Adjust the height when the map is fullscreened
    document.addEventListener('fullscreenchange', adjustFilterBlockHeight);

    // Add event listener to reset button
    resetButton.addEventListener('click', () => resetFilters(map, geojsonFiles))

    // Create waste type checkboxes
    wasteTypes.forEach((wasteType) => {
        createAndAppendElement(
            'input',
            {
                type: 'checkbox',
                id: wasteType,
                checked: false
            },
            wasteFilterGroup
        );
        createAndAppendElement(
            'label',
            {
                htmlFor: wasteType,
                textContent: wasteType
            },
            wasteFilterGroup
        );
    });

    // Fetch and process GeoJSON files
    geojsonFiles.forEach(async (file) => {
        const dataUrl = `/wordpress/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`;
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
            ReactDOM.render(
                <Popup landfill={{ properties }} />,
                popupNode
            );
            new mapboxgl
                .Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupNode)
                .addTo(map);
        });

        // Create category checkboxes
        const uniqueSymbols = [...new Set(data.features.map((feature) => feature.properties.icon))];
        uniqueSymbols.forEach((symbol) => {
            createAndAppendElement(
                'input',
                {
                    type: 'checkbox',
                    id: symbol,
                    checked: true
                },
                filterGroup
            );
            const label = createAndAppendElement(
                'label',
                {
                    htmlFor: symbol,

                },
                filterGroup
            );
            createAndAppendElement(
                'span',
                {
                    className: `marker-icon ${symbol}`,
                },
                label
            );
            label.appendChild(document.createTextNode(getLabelForSymbol(symbol)));

        });

        // Add change event to all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
            input.addEventListener('change', () => applyCombinedFilters(map, geojsonFiles));
        });
    });
};

export default addGeoJSONLayers;
