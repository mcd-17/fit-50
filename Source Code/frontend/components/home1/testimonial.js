'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import TestimonialCard from './testimonialCard';
import BannerTitle from '../common/banner-title';
import { allTestimonial } from '../../app/helpers/backend';
import { useFetch } from '../../app/helpers/hooks';
import { useI18n } from '../../app/providers/i18n';
import { motion } from 'framer-motion';
import { useCurrency } from '../../app/contexts/site';

const Testimonial = () => {
    const swiperRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [data] = useFetch(allTestimonial);
    const {findDefaultTheme} = useCurrency()

    const i18n = useI18n();

    const handleSlideChange = (swiper) => {
        setCurrentSlide(swiper.snapIndex);    
    };
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

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className='container my-[60px] lg:my-[120px] overflow-x-hidden'>
            <div className='flex w-full flex-col-reverse gap-11 lg:flex-row'>
                <motion.div
                    // initial="hidden"
                    // whileInView="visible"
                    // viewport={{ amount: 0.3 }}
                    // variants={leftToRightVariant}
                    // transition={{ duration: 0.6, ease: "easeOut" }}
                    className='w-full overflow-hidden lg:w-3/5'>
                    <div className='me-4 flex items-center justify-end gap-6 lg:hidden'>
                        <button
                            onClick={goPrev}
                            className={`box-shadow flex h-[30px] w-[30px] items-center justify-center rounded-full text-primary duration-500 hover:bg-primary hover:text-white ${currentSlide === 0
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary'
                                }`}
                        >
                            <MdKeyboardArrowLeft size={25} />
                        </button>
                        <button
                            onClick={goNext}
                            className={`box-shadow flex h-[30px] w-[30px] items-center justify-center rounded-full text-primary duration-500 hover:bg-primary hover:text-white ${currentSlide === 1
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary'
                                }`}
                        >
                            <MdKeyboardArrowRight size={25} />
                        </button>
                    </div>
                    <Swiper
                        ref={swiperRef}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 0,
                            },
                        }}
                        className='!px-1'
                        onSlideChange={handleSlideChange}
                    >
                        {data?.docs.map((allreview, index) => (
                            <SwiperSlide key={index}>
                                <TestimonialCard allreview={allreview} pathName={findDefaultTheme}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
                <motion.div
                    // initial="hidden"
                    // whileInView="visible"
                    // viewport={{ amount: 0.3 }}
                    // variants={rightToLeftVariant}
                    // transition={{ duration: 0.6, ease: "easeOut" }}
                    className='lg:w-2/5'>
                    <BannerTitle
                    home3={findDefaultTheme?.name==="home3" ? true : false}
                        className={''}
                        subtitle={i18n?.t('Testimonial')}
                        title={i18n?.t('our client feedback')}
                    />
                    <p className={`description mt-5 !font-poppins lg:mt-1 ${findDefaultTheme?.name === "home3" ? "text-white" : "text-textMain"}`}>
                        {i18n?.t("I have been hiring people in this space for a number of years and I have never seen this level of professionalism. It really feels like you are working with a team that understands your needs.")}
                    </p>
                    <div className='mt-6 hidden items-center gap-6 lg:flex'>
                        <button
                            onClick={goPrev}
                            className={`box-shadow flex h-[40px] w-[40px] items-center justify-center rounded-full text-primary duration-500 hover:bg-primary hover:text-white ${currentSlide === 0
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary'
                                }`}
                        >
                            <MdKeyboardArrowLeft size={30} />
                        </button>
                        <button
                            onClick={goNext}
                            className={`box-shadow flex h-[40px] w-[40px] items-center justify-center rounded-full text-primary duration-500 hover:bg-primary hover:text-white ${currentSlide === 1
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary'
                                }`}
                        >
                            <MdKeyboardArrowRight size={30} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Testimonial;
