'use client'
import React from 'react';
import Image from 'next/image';
import { useI18n } from '../../../../providers/i18n';
import Link from 'next/link';
import { motion } from 'framer-motion';

const ServiceCard = ({ data }) => {
    const i18n = useI18n();
    const slideUpZoomVariant = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    return (
        <motion.div
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: true, amount: 0.3 }}
            // variants={slideUpZoomVariant}
            // transition={{ duration: 0.7, ease: "easeOut" }}
            className='box-shadow transition-all bg-white group rounded-[10px] duration-500 overflow-hidden relative'>
            <div className='w-full lg:h-[400px] h-[300px] bg-white -z-30  overflow-hidden '>
                <Link href={`/services/details/${data?._id}`} >
                    <Image src={data?.image} alt='service' width={1000} height={1000} className='object-cover h-full w-full relative z-0' />
                </Link>
            </div>

            <div className='absolute bg-primary !z-10 w-full lg:h-[250px] h-[200px] lg:-bottom-[160px] -bottom-[120px] group-hover:bottom-0 transition-all duration-700'>
                <div className='rounded-full lg:w-16 lg:h-16 w-14 h-14 duration-700 bottom-8 lg:p-4 p-2 bg-white flex mx-auto relative box-shadow items-center justify-center'>
                    <Image src={data?.icon} width={50} height={50} alt='service' className='object-contain w-[32px]' />
                </div>
                <h4 className='service-heading !-mt-4 group-hover:-mt-0 duration-500 !text-white'>
                    {data?.name[i18n.langCode]}
                </h4>
                <p className='w-full mx-auto mt-4 description !text-white/80 !font-normal line-clamp-4 !text-center h-[51.19px] px-3'>
                    {data?.description[i18n.langCode]}
                </p>
                <div className='mt-8 pb-8 flex space-x-2 items-center justify-center'>
                    <Link href={`/services/details/${data?._id}`} className='text-center service-description w-fit text-white font-semibold hover:underline duration-500'>
                        {i18n?.t('Read More')}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
