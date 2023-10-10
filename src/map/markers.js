import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Popup from '../components/Popup/Popup';

const addedMarkers = new Map();

const addLandfillMarkers = (landfills, popupClassName, map) => {
    landfills.forEach(({ geometry, properties }) => {

        const { id, categorie } = properties;

        if (!addedMarkers.has(id)) {
            const popupNode = document.createElement('div');
            popupNode.className = popupClassName;

            ReactDOM.render(<Popup landfill={{ geometry, properties }} />, popupNode);

            const marker = new mapboxgl.Marker()
                .setLngLat(geometry.coordinates)
                .setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
                .addTo(map);

            if (categorie) {
                marker.getElement().classList.add(`marker-${categorie}`);
            }

            addedMarkers.set(id, marker);
        }
    });
};

export default addLandfillMarkers;
