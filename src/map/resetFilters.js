import { applyCombinedFilters } from "./filters";

// Function to reset all filters
export const resetFilters = (map, geojsonFiles) => {
    // Reset waste type filters
    document.querySelectorAll('#waste-filter-group input').forEach((input) => {
        input.checked = false;
    });

    // Reset category filters
    document.querySelectorAll('#filter-group input').forEach((input) => {
        input.checked = true;
    });

    // Apply filters to update the map
    applyCombinedFilters(map, geojsonFiles);
};