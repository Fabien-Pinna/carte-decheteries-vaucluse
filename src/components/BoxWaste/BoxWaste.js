import { CheckOk, CheckNo } from '../../Icons/Icons';

const BoxWaste = ({ landfill }) => {
    const {
        authorizedWaste,
        forbiddenWaste
    } = landfill.properties;

    const parsedAuthorizedWaste = JSON.parse(authorizedWaste);
    const parsedForbiddenWaste = JSON.parse(forbiddenWaste);

    const wasteTypeData = [
        {
            title: "Déchets autorisés",
            className: "box_waste_authorized",
            icon: <CheckOk />,
            items: parsedAuthorizedWaste
        },
        {
            title: "Déchets refusés",
            className: "box_waste_forbidden",
            icon: <CheckNo />,
            items: parsedForbiddenWaste
        }
    ];

    return (
        <div className="box_waste">
            {wasteTypeData.map((wasteType, index) => (
                wasteType.items && wasteType.items.length > 0 && (
                    <div className={wasteType.className} key={index}>
                        <div className="header_waste">
                            {wasteType.icon}
                            <h3>{wasteType.title}</h3>
                        </div>
                        <ul>
                            {wasteType.items.map((item, itemIndex) => (
                                <li className={`${wasteType.className}_item`} key={itemIndex}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </div>
    );
};

export default BoxWaste;
