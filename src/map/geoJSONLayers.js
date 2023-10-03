import addLandfillMarkers from "./markers"

const addGeoJSONLayers = (map, isStyleLoaded) => {
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
                addLandfillMarkers(features, `popup_${file}`, map);
            }
        });
    });
}

export default addGeoJSONLayers;