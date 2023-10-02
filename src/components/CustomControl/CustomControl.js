class CategoryFilterControl {
    constructor(setFilter) {
        this._setFilter = setFilter;
    }

    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-top-left';

        const buttonAll = document.createElement('button');
        buttonAll.textContent = 'All';
        buttonAll.addEventListener('click', () => this._setFilter('all'));

        const buttonPrivate = document.createElement('button');
        buttonPrivate.textContent = 'Private';
        buttonPrivate.addEventListener('click', () => this._setFilter('private'));

        const buttonPublic = document.createElement('button');
        buttonPublic.textContent = 'Public';
        buttonPublic.addEventListener('click', () => this._setFilter('public'));

        const buttonAssociation = document.createElement('button');
        buttonAssociation.textContent = 'Association';
        buttonAssociation.addEventListener('click', () => {
            console.log('clicked');
            this._setFilter('association')
        });

        this._container.appendChild(buttonAll);
        this._container.appendChild(buttonPrivate);
        this._container.appendChild(buttonPublic);
        this._container.appendChild(buttonAssociation);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

export default CategoryFilterControl;
