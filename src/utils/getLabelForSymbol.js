// Function to get the corresponding label for a given symbol
export const getLabelForSymbol = (symbol) => {
    switch (symbol) {
        case 'private-marker':
            return 'Privé';
        case 'public-marker':
            return 'Public';
        case 'association-marker':
            return 'Recyclerie';
        default:
            return symbol;
    }
};