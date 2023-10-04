const Body = ({ landfill }) => {
    const {
        hoursMorning,
        hoursMorningSummer,
        hoursAfternoon,
        hoursAfternoonSummer,
    } = landfill.properties;

    // Convertir les chaînes JSON en tableaux
    const parsedHoursMorning = JSON.parse(hoursMorning);
    const parsedHoursAfternoon = JSON.parse(hoursAfternoon);
    const parsedHoursMorningSummer = JSON.parse(hoursMorningSummer);
    const parsedHoursAfternoonSummer = JSON.parse(hoursAfternoonSummer);

    const scheduleData = [
        {
            hours: parsedHoursMorning,
            className: "morning_hours",
        },
        {
            hours: parsedHoursAfternoon,
            className: "afternoon_hours",
        },
        {
            hours: parsedHoursMorningSummer,
            className: "morning_hours_summer",
        },
        {
            hours: parsedHoursAfternoonSummer,
            className: "afternoon_hours_summer",
        },
    ]
    const filteredScheduleData = scheduleData.filter(
        (schedule) => Array.isArray(schedule.hours) && schedule.hours.length > 0
    );

    return (
        <>
            {filteredScheduleData.map((schedule, index) => (
                <tr key={index}>
                    {schedule.hours.map((hour, i) => (
                        <td className={schedule.className} key={i}>
                            {hour}
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};

export default Body;
