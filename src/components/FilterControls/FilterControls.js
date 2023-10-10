import { useState, useEffect } from 'react';

const FilterControls = ({ categories, updateMapLayers }) => {
    const [checkedCategories, setCheckedCategories] = useState(() => {
        const initialChecked = {};
        if (categories) {
            categories.forEach((category) => {
                initialChecked[category] = true;
            });
        }
        return initialChecked;
    });

    useEffect(() => {
        updateMapLayers(checkedCategories);
    }, [checkedCategories, updateMapLayers])


    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedCategories(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    return (
        <fieldset>
            <nav id="filter-group" className="filter-group">
                {categories && categories.map((category, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            name={category}
                            checked={checkedCategories[category]}
                            onChange={handleCheckboxChange}
                        />
                        {category}
                    </label>
                ))}
            </nav>
        </fieldset>
    );
};

export default FilterControls;
