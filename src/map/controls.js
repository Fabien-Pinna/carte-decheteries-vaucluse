import mapboxgl from 'mapbox-gl';

const addcontrols = (map) => {
    // Add fullscreen control
    const fullscreenControl = new mapboxgl.FullscreenControl();
    map.addControl(fullscreenControl, 'bottom-right');

    // Add geolocate control
    const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true,
        },
        trackUserLocation: true,
    });
    map.addControl(geolocateControl);
}

export default addcontrols