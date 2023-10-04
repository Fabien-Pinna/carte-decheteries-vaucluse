import { Website, NewWindow } from '../../../../../Icons/Icons';

const BoxWebsite = ({ landfill }) => {
    const { email, website } = landfill.properties;

    return (
        <>
            {(email || website) &&
                <div className="box_website">
                    <Website />
                    <div className="box_website_links">
                        {website && (
                            <a href={website} target="_blank" className="website_item">
                                Site Web
                                <NewWindow />
                            </a>)}
                        {email && (
                            <a href={email} className="website_item">
                                Email
                                <NewWindow />
                            </a>
                        )}
                    </div>
                </div>}

        </>
    );
};

export default BoxWebsite;
