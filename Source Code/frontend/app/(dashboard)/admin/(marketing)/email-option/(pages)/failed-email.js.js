import React from 'react';
import { useFetch } from '../../../../../helpers/hooks';
import { allMarketingEmail } from '../../../../../helpers/backend';
import CommonMail from './commonMail';
const FailedEmail = () => {
    const [data, getData] = useFetch(allMarketingEmail,{status:"failed"})
    return (
        <div>
        <CommonMail data={data} getData={getData} title={"Failed Email"} />
        </div>
    );
};
export default FailedEmail;