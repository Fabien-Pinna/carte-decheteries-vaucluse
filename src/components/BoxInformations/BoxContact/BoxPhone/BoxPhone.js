import { Phone, PhoneCall } from '../../../../Icons/Icons'

const BoxPhone = ({ landfill }) => {

    const {
        phoneData,
        phoneData2,
        phoneClient,
        phoneClient2
    } = landfill.properties


    return (
        <>
            {phoneClient && (<div className="box_phone">
                <Phone />
                <div className="box_phone_number">
                    <a href={phoneData} className="phone_number">
                        {phoneClient}
                        <PhoneCall />
                    </a>
                    {phoneData2 && (
                        <a href={phoneData2} className="phone_number">
                            {phoneClient2}
                            <PhoneCall />
                        </a>
                    )}
                </div>
            </div>)}
        </>
    )
}

export default BoxPhone