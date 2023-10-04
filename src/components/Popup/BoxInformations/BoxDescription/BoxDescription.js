import { Card, Money } from '../../../../Icons/Icons'

const BoxDescription = ({ landfill }) => {

    const {
        description
    } = landfill.properties

    return (
        <div className="box_description">
            <Card />
            <Money />
            <h3>Modalité d'accès :</h3>
            <p>{description}</p>
        </div>
    )
}

export default BoxDescription