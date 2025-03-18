import React from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Link from 'next/link';
import Button from '../../../../../components/common/button';

const HeroSwiper = ({ i18n, data }) => {
    return (
        <Swiper
            spaceBetween={30}
            loop={true}
            pagination={{ clickable: true }}
            // autoplay={{
            //     delay: 3000,
            //     disableOnInteraction: false,
            // }}
            modules={[Pagination, Autoplay]}
            className='!h-full'
        >
            {
                data?.map((i, index) => (
                    <SwiperSlide key={index} className="lg:pt-[100px] xl:pb-[400px] pb-[100px]" >
                        <div className="relative h-full w-full xl:mt-[200px] lg:mt-[100px] md:mt-[150px] mt-[100px] container  ">
                            <h1 className="text-white xl:mb-10 mb-6 sm:text-[50px] text-center lg:w-[70%] w-full xl:w-[95%] mx-auto text-[26px] xl:text-[84px] font-extrabold uppercase xl:leading-[102.4px] lg:leading-[60px] leading-[40px] sm:leading-[60px] md:leading-[70px] tracking-[4%]">
                                {i?.heading[i18n.langCode]}
                            </h1>
                            <p className=" text-white capitalize w-full sm:w-[60%]  text-wrap line-clamp-2 mx-auto text-center text-base lg:text-xl font-poppins font-medium">
                                {i?.description[i18n.langCode]}      
                            </p>

                            <div className='mt-7 lg:mt-10 grid sm:w-fit mx-auto w-full grid-cols-2 sm:gap-6 gap-2 xl:mt-[56px] '>
                                <div className='w-full'>
                                    <Button className=' !w-full  text-white md:!px-[32px] !text-xs sm:!text-base !py-3 sm:!py-[14px] '>
                                        <Link href='/services'>
                                            {i18n?.t('Start your journey')}
                                        </Link>
                                    </Button>
                                </div>

                                <div className='w-full'>
                                    <Button skipDemo={true} className=' !w-full  text-white md:!px-[32px] !text-xs sm:!text-base !py-3 sm:!py-[14px] '>
                                        <Link href='/contact'>{i18n?.t('Contact Us')}</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }


        </Swiper>
    );
};

export default HeroSwiper;
