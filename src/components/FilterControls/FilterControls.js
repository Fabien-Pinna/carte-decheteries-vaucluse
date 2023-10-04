import React, { useState } from 'react';
import './FilterControls.scss';

const FilterControls = ({ onCategoryChange }) => {
    const [selectedCategories, setSelectedCategories] = useState({});

    const handleCheckboxChange = (e, category) => {
        setSelectedCategories({
            ...selectedCategories,
            [category]: e.target.checked,
        });
        onCategoryChange(selectedCategories);
    };

    return (
        <div className="map-overlay">
            <fieldset>
                <nav id="filter-group" className="filter-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCategories['privateLandfill'] || false}
                            onChange={(e) => handleCheckboxChange(e, 'privateLandfill')}
                        />
                        Private Landfill
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCategories['publicLandfill'] || false}
                            onChange={(e) => handleCheckboxChange(e, 'publicLandfill')}
                        />
                        Public Landfill
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedCategories['secondhandAssociation'] || false}
                            onChange={(e) => handleCheckboxChange(e, 'secondhandAssociation')}
                        />
                        Secondhand Association
                    </label>
                </nav>
            </fieldset>
        </div>
    );
};

export default FilterControls;