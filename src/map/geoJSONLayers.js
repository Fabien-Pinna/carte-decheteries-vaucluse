import ReactDOM from 'react-dom';
import React from 'react'
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Popup from '../components/Popup/Popup';



const addGeoJSONLayers = (map, popupClassName) => {
    const geojsonFiles = ["privateLandfill", "publicLandfill", "secondhandAssociation"];
    const wasteTypes = ["Amiante", "Bois", "Cartons", "DEEE", "Encombrants", "Gravats", "Huiles", "Metaux", "Pneus", "Vegetaux", "Verre"];

    const filterGroup = document.createElement('nav');
    filterGroup.id = 'filter-group';
    filterGroup.className = 'filter-group';
    document.getElementsByClassName('map-container')[0].appendChild(filterGroup);

    const wasteFilterGroup = document.createElement('nav');
    wasteFilterGroup.id = 'waste-filter-group';
    wasteFilterGroup.className = 'waste-filter-group';
    document.getElementsByClassName('map-container')[0].appendChild(wasteFilterGroup);

    // Create reset button
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-filters';
    resetButton.className = 'reset-filters';
    resetButton.textContent = 'Reset Filters';
    document.getElementsByClassName('map-container')[0].appendChild(resetButton);





    const applyCombinedFilters = () => {
        const checkedWastes = [...document.querySelectorAll('#waste-filter-group input')]
            .filter((el) => el.checked)
            .map((el) => el.id);

        const checkedSymbols = [...document.querySelectorAll('#filter-group input')]
            .filter((el) => el.checked)
            .map((el) => el.id);

        geojsonFiles.forEach((file) => {
            const layerId = `${file}-unclustered-point`;
            const wasteFilterConditions = ['all', ...checkedWastes.map(wasteType => ['==', wasteType, true])];
            const symbolFilterConditions = ['in', 'icon', ...checkedSymbols];

            const combinedFilterConditions = ['all', wasteFilterConditions, symbolFilterConditions];

            map.setFilter(layerId, combinedFilterConditions);
        });
    };

    const resetFilters = () => {
        // Reset waste type filters
        document.querySelectorAll('#waste-filter-group input').forEach((input) => {
            input.checked = false;
        });

        // Reset landfill category filters
        document.querySelectorAll('#filter-group input').forEach((input) => {
            input.checked = true;
        });

        // Apply filters to update the map
        applyCombinedFilters();
    };

    // Add event listener to reset button
    resetButton.addEventListener('click', resetFilters);

    for (const wasteType of wasteTypes) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = wasteType;
        input.checked = false; // Initial state is not-checked
        wasteFilterGroup.appendChild(input);

        const label = document.createElement('label');
        label.setAttribute('for', wasteType);
        label.textContent = wasteType;
        wasteFilterGroup.appendChild(label);

    }


    geojsonFiles.forEach(async (file) => {
        const dataUrl = `/wordpress/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`;
        const response = await axios.get(dataUrl);
        const data = response.data;

        map.addSource(file, {
            type: "geojson",
            data: data,
        });

        const layerId = `${file}-unclustered-point`;

        map.addLayer({
            id: layerId,
            type: "symbol",
            source: file,
            layout: {
                "icon-image": ["get", "icon"],
                "icon-size": 0.5,
                "icon-allow-overlap": true
            }
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', layerId, () => {
            map.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', layerId, () => {
            map.getCanvas().style.cursor = '';
        });

        // Ajoutez un événement click pour afficher un Popup
        map.on('click', layerId, (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties

            const popupNode = document.createElement('div');
            popupNode.className = `popup_${file}`;

            ReactDOM.render(<Popup landfill={{ properties }} />, popupNode);

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupNode)
                .addTo(map);
        });

        const symbols = [];

        for (const feature of data.features) {
            const symbol = feature.properties.icon;
            if (!symbols.includes(symbol)) symbols.push(symbol);
        }

        for (const symbol of symbols) {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = symbol;
            input.checked = true;
            filterGroup.appendChild(input);

            const label = document.createElement('label');
            label.setAttribute('for', symbol);
            label.textContent = symbol;
            filterGroup.appendChild(label);
        }
        // Update both filters when any checkbox is changed
        document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
            input.addEventListener('change', applyCombinedFilters);
        });
    });
}

export default addGeoJSONLayers;