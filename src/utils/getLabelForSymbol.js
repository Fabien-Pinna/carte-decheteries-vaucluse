// Function to get the corresponding label for a given symbol
export const getLabelForSymbol = (symbol) => {
    switch (symbol) {
        case 'private-marker':
            return 'Établissements Privés';
        case 'public-marker':
            return 'Déchèteries Publiques';
        case 'association-marker':
            return 'Ressourceries & Associations';
        default:
            return symbol;
    }
};