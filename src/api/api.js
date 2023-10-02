const fetchAccessToken = async () => {
    try {
        const response = await fetch('/wordpress/wp-admin/admin-ajax.php?action=get_mapbox_access_token');
        const data = await response.json();
        return data.accessToken;
    } catch (error) {
        console.error('Error fetching Mapbox access token:', error);
        return null;
    }
};

export default fetchAccessToken;
