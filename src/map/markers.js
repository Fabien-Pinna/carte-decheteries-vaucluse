import { useRef } from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Popup from '../components/Popup';

const addedMarkers = {}

const addLandfillMarkers = (landfills, map, addedMarkers, popupClassName) => {
    landfills.forEach(landfill => {
        const key = landfill.properties.id;
        if (!addedMarkers[key]) {
            const popupNode = document.createElement('div');
            popupNode.className = popupClassName;
            ReactDOM.render(<Popup landfill={landfill} />, popupNode);

            new mapboxgl.Marker()
                .setLngLat(landfill.geometry.coordinates)
                .setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
                .addTo(map)
                .getElement()
                .classList.add(`marker-${landfill.properties.categorie ?? 'default'}`);

            addedMarkers[key] = true;
        }
    });
};


export default { addedMarkers, addLandfillMarkers }
