'use client';
import React, { useEffect, useRef } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { motion } from 'framer-motion';

import BannerTitle from '../../../../../components/common/banner-title';
import { useFetch } from '../../../../helpers/hooks';
import { fetchTrainerList } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import ExpartCard from './teamCard';
import { useCurrency } from '../../../../contexts/site';

const Team = () => {
    const i18n = useI18n();
    const [data, getData] = useFetch(fetchTrainerList, { limit: 10 });
    const {findDefaultTheme} = useCurrency()

    const swiperRef = useRef(null);
    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.update();
        }
    }, []);
    const goNext = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };
    const goPrev = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    return (
        <div className='container h-fit overflow-x-hidden'>
            <div className='flex justify-between items-center pr-3 '>
                <BannerTitle home3={findDefaultTheme} subtitle={i18n?.t('team')} title={i18n?.t("meet the pros")} className={''} />
                <div className='flex items-center gap-6 mt-6 '>
                    <button onClick={goPrev} className='w-[40px] h-[40px] rounded-full box-shadow flex items-center justify-center text-primary hover:bg-primary hover:text-white duration-500'><MdKeyboardArrowLeft size={30} /></button>
                    <button onClick={goNext} className='w-[40px] h-[40px] rounded-full box-shadow flex items-center justify-center text-primary hover:bg-primary hover:text-white duration-500'><MdKeyboardArrowRight size={30} /></button>
                </div>
            </div>
            <div className='overflow-hidden mt-10'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    pagination={{
                        clickable: true,
                    }}
                    breakpoints={{
                        415: {
                            slidesPerView: 2,
                            spaceBetween: 10
                        },
                        600: {
                            slidesPerView: 3,
                            spaceBetween: 24
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 24
                        },
                    }}
                    className='!p-1'
                    ref={swiperRef}
                >
                    {data?.docs?.map((team, index) => (
                        <SwiperSlide key={team._id} className='' >
                            <motion.div
                                // variants={slideVariants}
                                // initial="hidden"
                                // whileInView="visible"
                                // viewport={{ once: false, amount: 0.3 }}
                                // transition={{ duration: 0.5, ease: "easeOut" }}
                                key={index} exit="exit"
                                >

                                <ExpartCard team={team} />
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Team;