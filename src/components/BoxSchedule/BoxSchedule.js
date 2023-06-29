import Header from './Header/Header';
import Body from './Body/Body';
import HoursInfos from './HoursInfos/HoursInfos';

const BoxSchedule = ({ landfill }) => {

    return (
        <>
            <div className="box_schedule">
                <table>
                    <thead>
                        <Header />
                    </thead>
                    <tbody>
                        <Body landfill={landfill} />
                    </tbody>
                </table>
            </div>
            <HoursInfos landfill={landfill} />
        </>
    )
}

export default BoxSchedule

