import React from 'react';
import { useFetch } from '../../../../../helpers/hooks';
import { allMarketingEmail } from '../../../../../helpers/backend';
import CommonMail from './commonMail';

const AllEmail = () => {
    const [data, getData] = useFetch(allMarketingEmail)
    return (
        <div>
            <CommonMail data={data} getData={getData} title={"All Email"} />
        </div>
    );
};

export default AllEmail;