import { Marker } from '../../../../../Icons/Icons'

const Address = ({ landfill }) => {

    const {
        address,
        city
    } = landfill.properties

    return (
        <div className="box_address">
            <Marker />
            <div className="box_address_text">
                <p className="address">{address}</p>
                <p className="city">{city}</p>
            </div>
        </div>
    )
}

export default Address