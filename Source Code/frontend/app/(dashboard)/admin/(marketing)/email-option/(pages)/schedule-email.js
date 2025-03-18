import React from 'react';
import { useFetch } from '../../../../../helpers/hooks';
import { allMarketingEmail } from '../../../../../helpers/backend';
import CommonMail from './commonMail';
const ScheduleEmail = () => {
    const [data, getData] = useFetch(allMarketingEmail,{status:"scheduled"})
    return (
        <div>
            <CommonMail isScheduled={true} data={data} getData={getData} title={"All Email"} />
        </div>
    );
};

export default ScheduleEmail;