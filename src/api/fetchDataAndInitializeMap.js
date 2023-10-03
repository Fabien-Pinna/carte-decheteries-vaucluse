import initializeMap from '../map/initializeMap';

const fetchDataAndInitializeMap = async (mapContainer, lat, lng, zoom) => {
    try {
        const response = await fetch('/wordpress/wp-admin/admin-ajax.php?action=get_mapbox_access_token');
        if (!response.ok) {
            throw new Error('Failed to fetch Mapbox access token');
        }

        const { accessToken } = await response.json();
        if (accessToken) {
            initializeMap(mapContainer, lat, lng, zoom, accessToken);
        } else {
            console.error('Failed to retrieve Mapbox access token from the server.');
        }
    } catch (error) {
        console.error('Error fetching Mapbox access token:', error);
    }
};

export default fetchDataAndInitializeMap;
