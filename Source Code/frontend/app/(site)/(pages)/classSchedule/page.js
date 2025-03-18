'use client';
import React from 'react';
import BasicBar from '../../../../components/common/basic-bar';
import { fetchShedule } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import { motion } from 'framer-motion';
import { Tooltip } from 'antd';

const Page = () => {
    const [schedule, getSchedule] = useFetch(fetchShedule);
    const i18n = useI18n();
    const { langCode } = useI18n();

    const staticTimes = [
        '9:00 am',
        '10:00 am',
        '11:00 am',
        '12:00 pm',
        '1:00 pm',
        '2:00 pm',
        '3:00 pm',
        '4:00 pm',
        '5:00 pm',
        '6:00 pm',
        '7:00 pm',
        '8:00 pm',
    ];

    const findScheduleByTime = (time, day) => {
        const found = schedule?.find((sch) => sch.time === time);
        const event = found?.[day]?.event[langCode] || '-';
        const trainer = found?.[day]?.trainer?.name || '';
        return { event, trainer };
    };

    const titleVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rowVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <div>
            <BasicBar heading={i18n?.t('Class Schedule')} subHeading={i18n?.t('Class Schedule')} />
            <div className='container my-10 md:my-20 lg:my-[120px]'>
                <motion.h1
                    variants={titleVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className='shop-heading'
                >
                    {i18n?.t('Class Schedule')}
                </motion.h1>
                <div className='mt-10 overflow-x-auto'>
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='bg-[#f0f0f0] text-[#827F7F]'>
                                <th className='p-4 font-medium'></th>
                                <th className='p-4 font-medium'>{i18n?.t('Monday')}</th>
                                <th className='p-4 font-medium'>{i18n?.t('Tuesday')}</th>
                                <th className='p-4 font-medium'>{i18n?.t('Wednesday')}</th>
                                <th className='p-4 font-medium'>{i18n?.t('Thursday')}</th>
                                <th className='p-4 font-medium'>{i18n?.t('Friday')}</th>
                                <th className='p-4 font-medium'>{i18n?.t('Saturday')}</th>
                                <th className='p-4 font-medium'>{i18n?.t('Sunday')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staticTimes.map((time, index) => (
                                <motion.tr
                                    key={index}
                                    variants={rowVariants}
                                    initial='hidden'
                                    whileInView='visible'
                                    viewport={{ once: false, amount: 0.3 }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                >
                                    <td className='whitespace-pre border bg-primary px-4 py-4 text-sm font-medium text-white sm:px-6 lg:py-10'>
                                        {time}
                                    </td>
                                    {[
                                        'Monday',
                                        'Tuesday',
                                        'Wednesday',
                                        'Thursday',
                                        'Friday',
                                        'Saturday',
                                        'Sunday',
                                    ].map((day) => {
                                        const { event, trainer } = findScheduleByTime(time, day);
                                        return (
                                            <td
                                                className='scheduleTableTD group text-center'
                                                key={day}
                                            >
                                                {event.length > 20 ? (
                                                    <Tooltip
                                                        className='cursor-pointer'
                                                        title={event}
                                                    >
                                                        <h4 className='scheduleTableTitle text-center capitalize group-hover:!text-textMain'>
                                                            {event.substring(0, 20) + '...'}
                                                        </h4>
                                                    </Tooltip>
                                                ) : (
                                                    <h4 className='scheduleTableTitle text-center capitalize group-hover:!text-textMain'>
                                                        {event}
                                                    </h4>
                                                )}
                                                {trainer && (
                                                    <p className='mt-1 text-xs text-textBody'>
                                                        {trainer}
                                                    </p>
                                                )}
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Page;
