import BoxContact from './BoxContact/BoxContact';
import BoxDescription from './BoxDescription/BoxDescription';

const BoxInformations = ({ landfill }) => {
    return (
        <div className="box_informations">
            <BoxContact landfill={landfill} />
            <BoxDescription landfill={landfill} />
        </div>
    )
}

export default BoxInformations