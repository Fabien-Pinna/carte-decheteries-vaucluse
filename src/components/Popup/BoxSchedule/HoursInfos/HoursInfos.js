const HoursInfos = ({ landfill }) => {
    const {
        hoursInformationSummer,
        hoursInformationWinter
    } = landfill.properties;

    const hoursInformationsData = [
        { infos: hoursInformationWinter, className: "info_winter" },
        { infos: hoursInformationSummer, className: "info_summer" }
    ]

    return (
        <>
            {(hoursInformationWinter || hoursInformationSummer) &&
                <div className="hours_informations_box">
                    {hoursInformationsData.map((info, index) => (
                        <p className={info.className} key={index}>{info.infos}</p>
                    ))

                    }
                </div>}
        </>
    )
}

export default HoursInfos