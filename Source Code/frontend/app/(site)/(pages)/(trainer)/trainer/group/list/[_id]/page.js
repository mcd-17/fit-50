"use client"
import React, { useEffect } from 'react';
import { useFetch } from '../../../../../../../helpers/hooks';
import { fetchMembers } from '../../../../../../../helpers/backend';
import ListItem from './listItem';
import { Empty } from 'antd';
import Button from '../../../../../../../../components/common/button';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../../../providers/i18n';

const FitnessGroupsTable = ({ params }) => {
    const [data, getData] = useFetch(fetchMembers, {}, false)
    const router = useRouter()
    const i18n = useI18n();
 
    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id })
        }
    }, [params?._id])

    return (
        <div className="w-full overflow-x-auto">
            <div className='flex justify-between'>
                <h3 className='profileHeading' >{i18n?.t("view group member")}</h3>
                <Button onClick={() => router.back()} className='!h-fit !py-1'>{i18n?.t("Back")}</Button>
            </div>
            <hr className='mb-4'/>
            <div className='w-full overflow-x-scroll hide-scrollbar '>
                {
                    data?.docs[0]?.members?.length > 0 ? <ListItem data={data} /> : <Empty />
                }
            </div>
        </div>
    );
}

export default FitnessGroupsTable;