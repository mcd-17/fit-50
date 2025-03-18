'use client'
import React, { useEffect } from 'react';
import { useFetch } from '../../../../../../../helpers/hooks';
import { singleTrainerWorkout } from '../../../../../../../helpers/backend';
import dayjs from "dayjs"
import { Typography } from 'antd';
import { useI18n } from '../../../../../../../providers/i18n';
import Button from '../../../../../../../../components/common/button';
import { useRouter } from 'next/navigation';
const { Title } = Typography;

const Details = ({ params }) => {
    const [data, getData] = useFetch(singleTrainerWorkout, {}, false);
    const {push} =useRouter()
    const i18n = useI18n();
    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);
    return (
        <div className='w-full'>
            <div className='flex justify-between'>
                <h3 className='profileHeading' >{i18n?.t("View workout schedule")}</h3>
                <Button onClick={() => push('/trainer/assigned-workout')} className='!h-fit !py-1'>{i18n?.t("Back")}</Button>
            </div>
            <hr />
            <div className='w-[684px] md:w-full lg:w-[684px] xl:w-full overflow-x-scroll hide-scrollbar mt-4'>
                <div className='grid grid-cols-5 w-full px-5 bg-primary text-white font-medium text-base py-4 '>
                    <p className='whitespace-pre text-center capitalize'>{i18n?.t("Day Name")}</p>
                    <p className='whitespace-pre text-center capitalize'>{i18n?.t("Description")}</p>
                    <p className='whitespace-pre text-center capitalize'>{i18n?.t("Workouts")}</p>
                    <p className='whitespace-pre text-center capitalize'>{i18n?.t("Start Date")}</p>
                    <p className='whitespace-pre text-center capitalize'>{i18n?.t("End Date")}</p>
                </div>
                <div className='grid grid-cols-5 w-full  font-medium text-base   '>
                    <div className='flex flex-col text-center items-center border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{data?.selected_days?.map(day => (<span>{day}</span>))}</div>
                    <div className='flex flex-col text-center items-center  border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{data?.description[i18n.langCode]}</div>
                    <div className='flex flex-col text-center items-center  border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{data?.workouts?.map(day => (<span>{day?.name[i18n.langCode]}</span>))}</div>
                    <div className='flex flex-col text-center items-center border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{dayjs(data?.start_date)?.format('DD-MM-YYYY')}</div>
                    <div className='flex flex-col text-center items-center border-[1px] text-base font-medium text-[#534C4C] capitalize py-4 gap-[14px] border-[#D9D9D9]'>{dayjs(data?.end_date)?.format('DD-MM-YYYY')}</div>
                </div>
            </div>
        </div>
    );
};

export default Details;