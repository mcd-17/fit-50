'use client';
import React, { useEffect } from 'react';
import { groupDetails, joinGroup } from '../../../../helpers/backend';
import { useAction, useFetch } from '../../../../helpers/hooks';
import BasicBar from '../../../../../components/common/basic-bar';
import { columnFormatter } from '../../../../helpers/utils';
import Image from 'next/image';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import Button from '../../../../../components/common/button';
import Link from 'next/link';
import { useI18n } from '../../../../providers/i18n';
import { useUser } from '../../../../contexts/user';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const Page = ({ params }) => {
    const [data, getData, { loading }] = useFetch(groupDetails);
    const { user } = useUser();
    const i18n = useI18n();
    const router = useRouter();

    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);

    const handleJoinGroup = async () => {
        if (!user?._id) {
            message.info(i18n?.t('Please log in to join the group'));
            return router.push('/signin');
        }
        
        if (user?.role !== 'user') {
            message.warning(i18n?.t('Only regular users can join the group'));
            return;
        }

        if (!user?.activeSubscription) {
            message.info(i18n?.t('You need an active subscription to join this group'));
            return router.push('/pricing-plan');
        }

        await useAction(joinGroup, { _id: data?._id }, () => {
            message.success(i18n?.t('Successfully joined the group'));
            getData();
        });
    };

    return (
        <div>
            <BasicBar heading={columnFormatter(data?.name)} subHeading={columnFormatter(data?.name)} />
            <div className='container sm:py-[100px] py-[50px]'>
                <div className="flex justify-between items-center">
                    <h1 className='text-secondary heading capitalize'>{i18n?.t('Gym Fitness Group')}</h1>
                    <div className="flex justify-end">
                        {!user?._id ? (
                            <Button type='submit' onClick={handleJoinGroup}>{i18n?.t('Join Group')}</Button>
                        ) : (
                            data?.in_group ? (
                                <Button type='submit' onClick={handleJoinGroup}>{i18n?.t('Leave Group')}</Button>
                            ) : (
                                <Button type='submit' onClick={handleJoinGroup}>{i18n?.t('Join Group')}</Button>
                            )
                        )}
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-3 mt-16 gap-y-6 lg:gap-6'>
                    <div className='col-span-1 border-[1px] h-fit rounded'>
                        <div className='p-9'>
                            <h1 className='capitalize text-secondary blogtitle mb-4 '>{i18n?.t("All Trainers")}</h1>
                            {data?.assign_trainers?.map((t, index) => (
                                <div key={index} className={`lg:py-6 py-4 border-t`}>
                                    <Link href={`/trainers/view/${t?._id}`} className='flex space-x-3 items-center'>
                                        <FaArrowRight className='text-sm' />
                                        <p className='para1'>{t?.name}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <div className=''>
                        </div>
                        <div className="flex justify-center">
                            <Image className='rounded h-full lg:h-[578px] object-fill' src={data?.image} width={1000} height={1000} alt='image'></Image>
                        </div>
                        <h1 className='capitalize text-2xl font-poppins font-medium text-secondary my-10 '>{columnFormatter(data?.name)}</h1>
                        {data?.facilities?.map((facility, index) => (
                            <div key={index} className="flex items-center my-3 gap-4">
                                <FaCheckCircle size={20} className='text-primary' />
                                <p className='font-poppins'>{columnFormatter(facility)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
