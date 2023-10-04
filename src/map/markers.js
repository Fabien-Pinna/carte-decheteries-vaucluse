import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Popup from '../components/Popup/Popup'

const addedMarkers = {};

const addLandfillMarkers = (landfills, popupClassName, map) => {
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

export default addLandfillMarkers;