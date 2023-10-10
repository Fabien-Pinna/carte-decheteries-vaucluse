import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import FilterControls from '../components/FilterControls/FilterControls';

const addFilterControls = (map, categories, updateMapLayers) => {
    if (!(map instanceof mapboxgl.Map)) {
        console.error('Invalid map instance passed to addFilterControls');
        return;
    }

    const oldFilterControls = document.getElementById('map-filter-controls');
    if (oldFilterControls) {
        oldFilterControls.remove();
    }

    const filterControls = document.createElement('div');
    filterControls.id = 'map-filter-controls';

    ReactDOM.render(<FilterControls categories={categories} updateMapLayers={updateMapLayers} />, filterControls);

    const mapContainer = map.getContainer();
    mapContainer.appendChild(filterControls);
};

export default addFilterControls;
