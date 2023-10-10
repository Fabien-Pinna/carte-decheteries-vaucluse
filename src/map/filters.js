// Function to apply combined filters on map layers
export const applyCombinedFilters = (map, geojsonFiles) => {
    const checkedWastes = [...document.querySelectorAll('#waste-filter-group input')]
        .filter((el) => el.checked)
        .map((el) => el.id);

    const checkedSymbols = [...document.querySelectorAll('#filter-group input')]
        .filter((el) => el.checked)
        .map((el) => el.id);

    geojsonFiles.forEach((file) => {
        const layerId = `${file}-unclustered-point`;
        const wasteFilterConditions = ['all', ...checkedWastes.map((wasteType) => ['==', wasteType, true])];
        const symbolFilterConditions = ['in', 'icon', ...checkedSymbols];
        const combinedFilterConditions = ['all', wasteFilterConditions, symbolFilterConditions];
        map.setFilter(layerId, combinedFilterConditions);
    });
};
