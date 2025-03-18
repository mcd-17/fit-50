'use client';
import Image from 'next/image';
import BannerTitle from '../../../../../components/common/banner-title';
import { fetchShedule } from '../../../../helpers/backend';
import { useFetch } from '../../../../helpers/hooks';
import { useI18n } from '../../../../providers/i18n';
import { motion } from 'framer-motion';
import { Modal, Tooltip } from 'antd';
import { useCurrency } from '../../../../contexts/site';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const ClassRoutine = () => {
    const [schedule, getSchedule] = useFetch(fetchShedule);
    const [open, setOpen] = useState(false);
    const [trainer, setTrainer] = useState(null);
    const { findDefaultTheme } = useCurrency()
    const pathName = usePathname()

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
        const title = found?.[day]?.event[langCode] || '-';
        const trainer = found?.[day]?.trainer?.name || '';
        const data = found?.[day]?.trainer || ''
        return { title, trainer, data };
    };

    const rowVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
    };
    return (
        <div className='relative'>
            <Image
                src='/schedule_svg.png'
                width={305}
                height={266}
                alt='image'
                className='absolute bottom-[333.53px] right-0 hidden h-[253.66px] w-[305.01px] object-fill md:block'
            />
            <Image
                src='/schedule_svg2.png'
                width={168.36}
                height={158.59}
                alt='image'
                className='absolute bottom-[181.41px] left-0 hidden h-[158.59px] w-[168.36px] object-fill 2xl:block'
            />
            <div className='bg-[url(/run-gym.png)] bg-cover bg-no-repeat'>
                <div className='h-full w-full bg-black bg-opacity-[70%] pb-[47px] pt-[60px] lg:pt-[130px]'>
                    <div className='container w-full'>
                        <BannerTitle
                            className={'items-center'}
                            title={i18n?.t('Our Schedule')}
                            subtitle={i18n?.t('Class Schedule')}
                            home3={findDefaultTheme?.name === "home3" && pathName === "/" ? true : false}
                        />

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
                                            variants={rowVariants}
                                            initial='hidden'
                                            whileInView='visible'
                                            viewport={{ once: false, amount: 0.3 }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                            key={index}
                                        >
                                            <td className='whitespace-pre border bg-primary px-3 py-4 text-sm font-medium text-white sm:px-4 lg:py-6'>
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
                                                const { title, trainer, data } = findScheduleByTime(
                                                    time,
                                                    day
                                                );
                                                return (
                                                    <td
                                                        onClick={() => { setTrainer(data); setOpen(true) }}
                                                        className={`scheduleTableTD cursor-pointer group text-center ${title !== '-' ? 'hover:bg-primary' : 'bg-transparent'} `}
                                                        key={day}
                                                    >
                                                        {title.length > 20 ? (
                                                            <Tooltip
                                                                className='cursor-pointer'
                                                                title={title}
                                                            >
                                                                <h4 className='scheduleTableTitle text-center !text-white'>
                                                                    {title.substring(0, 20) + '...'}
                                                                </h4>
                                                            </Tooltip>
                                                        ) : (
                                                            <h4 className='scheduleTableTitle text-center !text-white'>
                                                                {title}
                                                            </h4>
                                                        )}
                                                        {trainer && (
                                                            <p className='mt-1 text-xs !text-white'>
                                                                {i18n?.t('Trainer')}: {trainer}
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
            </div>
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                closable={false}
                width={300}
                className='trainerModal'
            >
                <div className='relative bg-white rounded-t-[40px] rounded-[20px] overflow-hidden'>
                    <div className='w-full h-[100px] bg-primary  flex items-center justify-center'>
                        <div className='z-20 rounded-full w-[100px] h-[100px] overflow-hidden relative top-[50%] bg-white'>
                            <Image src={trainer?.image ? trainer?.image : "/defaultimg.jpg"} alt={trainer?.name} width={600} height={400} className='object-cover rounded-full w-full h-full' />
                        </div>
                    </div>
                    <div className='mt-16 px-5'>
                        <div className='flex flex-col gap-1'>
                            <h1 className='capitalize text-textMain font-medium text-base'>{i18n?.t("Name")}: {trainer?.name ? trainer?.name : 'N/A'}</h1>
                            <h1 className='capitalize text-textMain font-medium text-base'>{i18n?.t("Email")}: {trainer?.email ? trainer?.email : 'N/A'}</h1>
                            <h1 className='capitalize text-textMain font-medium text-base'>{i18n?.t("experience")}: {trainer?.experience ? trainer?.experience : 'N/A'}</h1>
                        </div>
                        <p className='text-textMain font-normal text-sm line-clamp-4 mt-6'>{trainer?.about}</p>
                    </div>
                    <button className='w-full mt-6 cursor-pointer text-lg font-semibold py-3 bg-primary/90 text-white hover:bg-primary ' onClick={() => push(`/trainers/view/${trainer?._id}`)}>{i18n?.t('View Details')} </button>
                </div>
            </Modal>
        </div>
    );
};

export default ClassRoutine;
