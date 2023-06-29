import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	return (
		<div {...useBlockProps.save()}>
			<div className="map-container" data-lat={attributes.lat} data-lng={attributes.lng} data-zoom={attributes.zoom} />
		</div>
	);
}
