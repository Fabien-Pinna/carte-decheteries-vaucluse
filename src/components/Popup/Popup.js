import BoxInformations from './BoxInformations/BoxInformations'
import BoxSchedule from './BoxSchedule/BoxSchedule'
import BoxWaste from './BoxWaste/BoxWaste'

const Popup = ({ landfill }) => {

    const {
        name,
    } = landfill.properties

    return (
        <div className='box_content'>
            <h1>{name}</h1>
            <BoxInformations landfill={landfill} />
            <BoxSchedule landfill={landfill} />
            <BoxWaste landfill={landfill} />
        </div>
    )
}

export default Popup