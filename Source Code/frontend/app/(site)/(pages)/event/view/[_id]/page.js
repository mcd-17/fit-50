'use client';
import React, { useEffect, useState } from 'react';
import BasicBar from '../../../../../../components/common/basic-bar';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { columnFormatter } from '../../../../../helpers/utils';
import { eventdetail, intersted } from '../../../../../helpers/backend';
import Image from 'next/image';
import Button from '../../../../../../components/common/button';
import { CiStar } from "react-icons/ci";
import { FaStar } from 'react-icons/fa';
import { useI18n } from '../../../../../providers/i18n';
import dayjs from 'dayjs';
import { FaMapLocationDot } from 'react-icons/fa6';
import { useUser } from '../../../../../contexts/user';

const Page = ({ params }) => {
    const [data, getData] = useFetch(eventdetail, {}, false);
    const [isInterested, setIsInterested] = useState(false);
    const {user} = useUser();
    console.log("🚀 ~ Page ~ user:", user)

    const i18n = useI18n();
    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);

    useEffect(() => {
        if (data?.is_interested) {
            setIsInterested(true);
        } else {
            setIsInterested(false);
        }
    }, [data]);

    const intersted1 = () => {
        useAction(intersted, { _id: data?._id }, () => {
            getData();
            setIsInterested(!isInterested);
        });
    };

    return (
        <div>
            <BasicBar heading={columnFormatter(data?.name)} subHeading={columnFormatter(data?.name)} />
            <div className='container lg:py-[140px] sm:py-[100px] py-[50px]'>
                <div className=''>
                    <div className="flex justify-center items-center">
                        <Image className='rounded h-full lg:h-[550px] object-fill w-full' src={data?.image} width={1000} height={1000} alt='image' />
                    </div>
                    <div className='flex justify-between flex-wrap mt-4'>
                    <div className="flex items-center text-textBody text-base font-poppins">
                        <FaMapLocationDot size={24} className="mr-1" />
                        <span>{data?.location}</span>
                    </div>
                    <div className="flex gap-1 text-textBody text-base font-poppins">
                        <span className="font-semibold">{i18n?.t('Start Date')} : </span>
                        <span className="">{dayjs(data?.start_date).format('DD-MM-YYYY, hh:mm A')}</span>
                    </div>
                    <div className="flex gap-1 text-textBody text-base font-poppins">
                        <span className="font-semibold">{i18n?.t('End Date')} : </span>
                        <span className="!text-base">{dayjs(data?.end_date).format('DD-MM-YYYY, hh:mm A')}</span>
                    </div>
                    </div>
                    <h1 className='capitalize blogtittle my-10 '>{columnFormatter(data?.name)}</h1>
                    <p className='para1 text-justify font-poppins'>{columnFormatter(data?.description)}</p>
                </div>
                <div className="flex justify-between lg:mt-10 mt-6">
                    <Button type='submit' className={`flex gap-2 items-center ${data?.is_interest===true ? '!bg-primary !text-white' : ''}`} onClick={intersted1}>
                        <div className="flex justify-center items-center">
                            {isInterested ? <FaStar size={20} /> : <CiStar size={20} />}
                        </div>
                        {i18n?.t('Interested')}
                    </Button>
                    <Button type='submit'>{i18n?.t('Interested People')} ({data?.total_interested_users})</Button>
                </div>
            </div>
        </div>
    );
};


export default Page;