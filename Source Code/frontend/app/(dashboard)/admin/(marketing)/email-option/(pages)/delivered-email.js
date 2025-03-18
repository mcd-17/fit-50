import React from 'react';
import { useFetch } from '../../../../../helpers/hooks';
import { allMarketingEmail } from '../../../../../helpers/backend';
import CommonMail from './commonMail';
const DeliveredEmail = () => {
    const [data, getData] = useFetch(allMarketingEmail,{status:"success"})
    return (
        <div>
            <CommonMail data={data} getData={getData} title={"Delivered Email"} />
        </div>
    );
};
export default DeliveredEmail;