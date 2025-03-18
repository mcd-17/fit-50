"use client"
import React, { useEffect } from 'react';
import { Empty } from 'antd';
import ListItem from './listItem';
import Button from '../../../../../../../../components/common/button';
import { useActionConfirm, useFetch } from '../../../../../../../helpers/hooks';
import { groupDetails, leaveGroup } from '../../../../../../../helpers/backend';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../../../providers/i18n';

const FitnessGroupsTable = ({ params }) => {
    const [data, getData] = useFetch(groupDetails, {}, false);
    const { push } = useRouter()
    const i18n = useI18n();

    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id });
            const groupStatus = localStorage.getItem(`group_${params?._id}_status`);
            if (groupStatus === 'joined') {
                setIsJoined(true);
            }
        }
    }, [params?._id]);

    const handleGroupToggle = () => {
        useActionConfirm(leaveGroup, { _id: params?._id }, () => {
            localStorage.setItem(`group_${params?._id}_status`, 'left');
            getData();
            push('/user/group');
        });
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex justify-between border-b mb-5 pb-5">
                <h1 className="profileHeading">{i18n?.t("View Assign Trainers")}</h1>
                <hr className='mb-4' />
                {
                    data?._id && <Button onClick={handleGroupToggle} className="md:block hidden !h-fit !py-3">
                        {i18n?.t('Leave Group')}
                    </Button>
                }

            </div>
            <div className="xl:w-full gap-5 sm:w-full w-[686px] lg:w-[689px] overflow-x-auto hide-scrollbar">
                <div>
                    <div className='flex justify-between py-4 border-b items-center bg-gray-100 font-semibold text-gray-700 text-center'>
                        <div className='w-[80px]'>{i18n?.t('Image')}</div>
                        <div className='flex-1'>{i18n?.t('Name')}</div>
                        <div className='flex-1'>{i18n?.t('Email')}</div>
                        <div className='flex-1'>{i18n?.t('Phone')}</div>
                        <div className='flex-1'>{i18n?.t('Message')}</div>
                    </div>
                    {data?.members?.length > 0 ? (
                        data?.assign_trainers?.map((member) => <ListItem key={member?._id} data={member} role='trainer' />)
                    ) : (
                        <Empty />
                    )}
                </div>

            </div>
            <h2 className="profileHeading my-10">{i18n?.t("Group Members")}</h2>
            <div className="xl:w-full gap-5 sm:w-full w-[686px] lg:w-[689px] overflow-x-auto hide-scrollbar">
                <div>
                    <div className='flex justify-between py-4 border-b items-center bg-gray-100 font-semibold text-gray-700 text-center'>
                        <div className='w-[80px]'>{i18n?.t('Image')}</div>
                        <div className='flex-1'>{i18n?.t('Name')}</div>
                        <div className='flex-1'>{i18n?.t('Email')}</div>
                        <div className='flex-1'>{i18n?.t('Phone')}</div>
                    </div>
                    {data?.members?.length > 0 ? (
                        data?.members?.map((member) => <ListItem key={member?._id} data={member} />)
                    ) : (
                        <Empty />
                    )}
                </div>

            </div>
            <div className='py-3'>
            {
                data?._id && <Button onClick={handleGroupToggle} className="md:hidden !h-fit !py-1 mt-2">
                    {i18n?.t('Leave Group')}
                </Button>
            }
            </div>
        </div>
    );
};

export default FitnessGroupsTable;
