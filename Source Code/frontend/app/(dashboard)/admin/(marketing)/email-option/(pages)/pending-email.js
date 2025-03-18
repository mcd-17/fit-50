import React from 'react';
import { useFetch } from '../../../../../helpers/hooks';
import { allMarketingEmail } from '../../../../../helpers/backend';
import CommonMail from './commonMail';
const PendingEmail = () => {
    const [data, getData] = useFetch(allMarketingEmail,{status:"pending"})
    return (
        <div>
            <CommonMail data={data} getData={getData} title={"Pending Email"} />
        </div>
    );
};
export default PendingEmail;