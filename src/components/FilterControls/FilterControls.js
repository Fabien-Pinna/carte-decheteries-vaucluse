const FilterControls = () => {
    return (
        <div className="map-overlay">
            <fieldset>
                <nav id="filter-group" className="filter-group">
                    <label>
                        <input type="checkbox" />
                        Private Landfill
                    </label>
                    <label>
                        <input type="checkbox" />
                        Public Landfill
                    </label>
                    <label>
                        <input type="checkbox" />
                        Secondhand Association
                    </label>
                </nav>
            </fieldset>
        </div>
    );
};

export default FilterControls;