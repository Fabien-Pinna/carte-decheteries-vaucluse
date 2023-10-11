// Function to handle map events
export const handleMapEvents = (map, setAttributes) => {
    map.on('move', () => {
        setAttributes({
            lng: map.getCenter().lng.toFixed(4),
            lat: map.getCenter().lat.toFixed(4),
            zoom: map.getZoom().toFixed(2),
        });
    });
};