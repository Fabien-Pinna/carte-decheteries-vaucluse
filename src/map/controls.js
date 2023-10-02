import mapboxgl from 'mapbox-gl';

const addControls = (map) => {
    const fullscreenControl = new mapboxgl.FullscreenControl();
    map.addControl(fullscreenControl, 'bottom-right');

    const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
    });
    map.addControl(geolocateControl);
};

export default addControls;
