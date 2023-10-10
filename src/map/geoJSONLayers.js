import ReactDOM from 'react-dom';
import React from 'react'
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Popup from '../components/Popup/Popup';

const addGeoJSONLayers = (map, popupClassName) => {
    const geojsonFiles = ["privateLandfill", "publicLandfill", "secondhandAssociation"];

    const filterGroup = document.createElement('nav');
    filterGroup.id = 'filter-group';
    filterGroup.className = 'filter-group';
    document.getElementsByClassName('map-container')[0].appendChild(filterGroup);

    const wasteFilterGroup = document.createElement('nav');
    wasteFilterGroup.id = 'waste-filter-group';
    wasteFilterGroup.className = 'waste-filter-group';
    document.getElementsByClassName('map-container')[0].appendChild(wasteFilterGroup);

    const wasteTypes = ["Amiante", "Bois", "Cartons", "DEEE", "Encombrants", "Gravats", "Huiles", "Metaux", "Pneus", "Vegetaux", "Verre"];

    // Waste filter

    const updateWasteFilter = () => {
        const checkedWastes = [...document.querySelectorAll('#waste-filter-group input')]
            .filter((el) => el.checked)
            .map((el) => el.id);

        geojsonFiles.forEach((file) => {
            const layerId = `${file}-unclustered-point`;
            const filterConditions = ['all', ...checkedWastes.map(wasteType => ['==', wasteType, true])];
            map.setFilter(layerId, filterConditions);
        });
    };

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

        input.addEventListener('change', updateWasteFilter);
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

        const updateLayerFilter = () => {
            const checkedSymbols = [...document.getElementsByTagName('input')]
                .filter((el) => el.checked)
                .map((el) => el.id);

            map.setFilter(layerId, ['in', 'icon', ...checkedSymbols]);
        };



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

            input.addEventListener('change', updateLayerFilter);
        }


    });
}

export default addGeoJSONLayers;