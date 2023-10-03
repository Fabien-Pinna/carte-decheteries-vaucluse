import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Popup from '../components/Popup'
import addcontrols from './controls';

const initializeMap = (mapContainer, lat, lng, zoom, accessToken) => {
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/fabioloco/clgqlk3z700ji01qza607558j',
        center: [lng, lat],
        zoom: zoom,
    });

    addcontrols(map);

    let isStyleLoaded = false;

    map.on('style.load', function () {
        isStyleLoaded = true;
        addGeoJSONLayers();
    });

    const addGeoJSONLayers = () => {
        const geojsonFiles = ["privateLandfill", "publicLandfill", "secondhandAssociation"];
        geojsonFiles.forEach((file) => {
            map.addSource(file, {
                type: "geojson",
                data: `/wordpress/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`,
            });

            map.addLayer({
                id: `${file}-unclustered-point`,
                type: "symbol",
                source: file
            });

            map.on("sourcedata", (e) => {
                if (e.sourceId === file && isStyleLoaded) {
                    const features = map.querySourceFeatures(file);
                    addLandfillMarkers(features, `popup_${file}`);
                }
            });
        });
    }

    const addedMarkers = {};

    const addLandfillMarkers = (landfills, popupClassName) => {
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
}

export default initializeMap;