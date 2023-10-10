import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Popup from '../components/Popup/Popup';

// Function to get the corresponding label for a given symbol
const getLabelForSymbol = (symbol) => {
    switch (symbol) {
        case 'private-marker':
            return 'Établissements Privés';
        case 'public-marker':
            return 'Déchèteries Publiques';
        case 'association-marker':
            return 'Ressourceries & Associations';
        default:
            return symbol;
    }
};

// Function to create and append a DOM element
const createAndAppendElement = (type, attributes, parent) => {
    const element = document.createElement(type);
    Object.keys(attributes).forEach((key) => {
        element[key] = attributes[key];
    });
    parent.appendChild(element);
    return element;
};

// Function to apply combined filters on map layers
const applyCombinedFilters = (map, geojsonFiles) => {
    const checkedWastes = [...document.querySelectorAll('#waste-filter-group input')]
        .filter((el) => el.checked)
        .map((el) => el.id);

    const checkedSymbols = [...document.querySelectorAll('#filter-group input')]
        .filter((el) => el.checked)
        .map((el) => el.id);

    geojsonFiles.forEach((file) => {
        const layerId = `${file}-unclustered-point`;
        const wasteFilterConditions = ['all', ...checkedWastes.map((wasteType) => ['==', wasteType, true])];
        const symbolFilterConditions = ['in', 'icon', ...checkedSymbols];
        const combinedFilterConditions = ['all', wasteFilterConditions, symbolFilterConditions];
        map.setFilter(layerId, combinedFilterConditions);
    });
};

// Function to reset all filters
const resetFilters = (map, geojsonFiles) => {
    // Reset waste type filters
    document.querySelectorAll('#waste-filter-group input').forEach((input) => {
        input.checked = false;
    });

    // Reset category filters
    document.querySelectorAll('#filter-group input').forEach((input) => {
        input.checked = true;
    });

    // Apply filters to update the map
    applyCombinedFilters(map, geojsonFiles);
};

// Main function to add GeoJSON layers
const addGeoJSONLayers = (map) => {
    const geojsonFiles = ['privateLandfill', 'publicLandfill', 'secondhandAssociation'];
    const wasteTypes = ['Amiante', 'Bois', 'Cartons', 'DEEE', 'Encombrants', 'Gravats', 'Huiles', 'Metaux', 'Pneus', 'Vegetaux', 'Verre'];

    // Create and append filter groups and reset button
    const filterGroup = createAndAppendElement(
        'nav',
        {
            id: 'filter-group',
            className: 'filter-group'
        },
        document.getElementsByClassName('map-container')[0]
    );
    const wasteFilterGroup = createAndAppendElement(
        'nav',
        {
            id: 'waste-filter-group',
            className:
                'waste-filter-group'
        },
        document.getElementsByClassName('map-container')[0]
    );
    const resetButton = createAndAppendElement(
        'button',
        {
            id: 'reset-filters',
            className: 'reset-filters',
            textContent: 'Reset Filters'
        },
        document.getElementsByClassName('map-container')[0]);

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
            createAndAppendElement(
                'label',
                {
                    htmlFor: symbol,
                    textContent: getLabelForSymbol(symbol)
                },
                filterGroup
            );
        });

        // Add change event to all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
            input.addEventListener('change', () => applyCombinedFilters(map, geojsonFiles));
        });
    });
};

export default addGeoJSONLayers;
