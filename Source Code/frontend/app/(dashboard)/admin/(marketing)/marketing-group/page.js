"use client"
import React from 'react';
import PageTitle from '../../../components/common/page-title';
import Group from './group';
import { useFetch } from '../../../../helpers/hooks';
import { fetchMarketingGroupList } from '../../../../helpers/backend';

const page = () => {
    const [data, getData, { loading }] = useFetch(fetchMarketingGroupList);
    return (
        <>
            <PageTitle title={"Manage Marketing Group"} />
            <Group data={data} getData={getData} loading={loading} />
        </>

    )
}

export default page;