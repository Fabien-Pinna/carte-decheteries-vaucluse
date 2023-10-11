import { useState, useRef, useEffect } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import mapboxgl from 'mapbox-gl';
import { loadGeoJSONFiles } from './adminMap/loadGeoJSONFiles';
import { handleMapEvents } from './adminMap/handleMapEvents';


import './editor.scss';

export default function Edit(props) {
	const { attributes: { lat, lng, zoom }, setAttributes } = props;
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [mapboxAccessToken, setMapboxAccessToken] = useState('');

	// Fetch the Mapbox API key
	useEffect(() => {
		fetch('/wp-admin/admin-ajax.php?action=get_mapbox_access_token')
			.then(response => response.json())
			.then(data => data && data.accessToken && setMapboxAccessToken(data.accessToken))
			.catch(error => console.error('Error fetching Mapbox API key:', error));
	}, []);

	// Initialize the Mapbox map
	useEffect(() => {
		if (mapboxAccessToken) {
			mapboxgl.accessToken = mapboxAccessToken;

			if (map.current) return;

			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/fabioloco/clnhurl0q03x101qu83e6e9r0',
				center: [lng, lat],
				zoom: zoom,
			});

			// Add controls to the map
			map.current.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
			map.current.addControl(new mapboxgl.GeolocateControl({
				positionOptions: { enableHighAccuracy: true },
				trackUserLocation: true,
			}));

			handleMapEvents(map.current, setAttributes);

			// Load resources when the map is ready
			map.current.on('load', () => {
				const geojsonFiles = ['privateLandfill', 'publicLandfill', 'secondhandAssociation'];
				loadGeoJSONFiles(map.current, geojsonFiles);
			});
		}
	}, [mapboxAccessToken]);

	return (
		<div {...useBlockProps()}>
			<div ref={mapContainer} className="map-container" />
		</div>
	);
}
