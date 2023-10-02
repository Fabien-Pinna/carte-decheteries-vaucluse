import { useState, useRef, useEffect } from '@wordpress/element';
import mapboxgl from 'mapbox-gl';
import { useBlockProps } from '@wordpress/block-editor';
import ReactDOM from 'react-dom';
import Popup from './components/Popup';

import './editor.scss';

export default function Edit(props) {
	const { attributes: { lat, lng, zoom }, setAttributes } = props;
	const mapContainer = useRef(null);
	const map = useRef(null);
	const addedMarkers = useRef({});
	const geolocateControl = useRef(null);

	const [mapboxAccessToken, setMapboxAccessToken] = useState('');

	useEffect(() => {
		// fetch the api key
		fetch('/wordpress/wp-admin/admin-ajax.php?action=get_mapbox_access_token')
			.then(response => response.json())
			.then(data => {
				if (data && data.accessToken) {
					setMapboxAccessToken(data.accessToken);
				}
			})
			.catch(error => {
				console.error('Erreur lors de la récupération de la clé API Mapbox:', error);
			});
	}, []);

	useEffect(() => {
		if (mapboxAccessToken) {
			mapboxgl.accessToken = mapboxAccessToken;

			// initialize map only once
			if (map.current) return;

			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: 'mapbox://styles/fabioloco/clgqlk3z700ji01qza607558j',
				center: [lng, lat],
				zoom: zoom
			});

			// Add fullscreen control
			const fullscreenControl = new mapboxgl.FullscreenControl();
			map.current.addControl(fullscreenControl, "bottom-right");

			// Add geolocate control
			geolocateControl.current = new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			});
			map.current.addControl(geolocateControl.current);

			map.current.on('move', () => {
				setAttributes({
					lng: map.current.getCenter().lng.toFixed(4),
					lat: map.current.getCenter().lat.toFixed(4),
					zoom: map.current.getZoom().toFixed(2),
				});
			});

			// load ressources
			map.current.on('load', function () {
				const geojsonFiles = ['privateLandfill', 'publicLandfill', 'secondhandAssociation'];
				geojsonFiles.forEach((file) => {
					map.current.addSource(file, {
						type: 'geojson',
						data: `/wordpress/wp-content/plugins/carte-decheteries-vaucluse/src/data/${file}.geojson`,

					});

					map.current.addLayer({
						id: `${file}-unclustered-point`,
						type: 'symbol',
						source: file,

					});

					map.current.on('data', function (e) {
						if (e.dataType === 'source' && e.sourceId === file) {
							const features = map.current.querySourceFeatures(file);
							addLandfillMarkers(features, `marker_${file}`, `popup_${file}`);
						}
					});
				});
			});
		}
	}, [mapboxAccessToken]);

	// add markers
	const addLandfillMarkers = (landfills, markerClassName, popupClassName) => {
		landfills.forEach(landfill => {
			const key = landfill.properties.id;

			if (!addedMarkers.current[key]) {
				const popupNode = document.createElement('div');
				popupNode.className = popupClassName;
				ReactDOM.render(<Popup landfill={landfill} />, popupNode);
				const marker = new mapboxgl.Marker()
					.setLngLat(landfill.geometry.coordinates)
					.setPopup(new mapboxgl.Popup().setDOMContent(popupNode))
					.addTo(map.current);

				// Add a class depending on the category of the landfill
				if (landfill.properties.categorie) {
					marker.getElement().classList.add(`marker-${landfill.properties.categorie}`);
				}

				addedMarkers.current[key] = true;
			}
		});
	};

	return (
		<div {...useBlockProps()}>
			<div ref={mapContainer} className="map-container" />
		</div>
	);
}
