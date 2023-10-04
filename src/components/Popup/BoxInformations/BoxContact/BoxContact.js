import BoxAddress from './BoxAddress/BoxAddress'
import BoxPhone from './BoxPhone/BoxPhone'
import BoxWebsite from './BoxWebsite/BoxWebsite'

const BoxContact = ({ landfill }) => {

    return (
        <div className="box_contact">
            <BoxAddress landfill={landfill} />
            <BoxPhone landfill={landfill} />
            <BoxWebsite landfill={landfill} />

        </div>
    )
}

export default BoxContact