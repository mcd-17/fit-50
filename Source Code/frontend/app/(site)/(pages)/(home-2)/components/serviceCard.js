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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUpZoomVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className='hover:md:scale-105 box-shadow transition-all bg-white hover:bg-primary group rounded duration-500'>
            <div className='w-full h-[230px] bg-white  '>
                <Link href={`/services/details/${data?._id}`} >
                    <Image src={data?.image} alt='service' width={1000} height={1000} className='object-cover h-full w-full  ' />
                </Link>
            </div>
            <div className='rounded-full w-16 h-16 duration-700 bottom-8 p-4 bg-white flex mx-auto relative box-shadow bg'>
                <Image src={data?.icon} width={50} height={50} alt='service' className='object-contain w-[32px]' />
            </div>
            <h4 className='service-heading group-hover:text-white text-textMain'>
                {data?.name[i18n.langCode]}
            </h4>
            <p className=' max-w-[296px] mx-auto mt-4 description !font-normal line-clamp-2 h-[51.19px] !text-textBody group-hover:!text-white px-3'>
                {data.description[i18n.langCode]}
            </p>
            <div className='mt-8 pb-8 flex space-x-2 items-center justify-center'>
                <Link href={`/services/details/${data?._id}`} className='text-center service-description w-fit group-hover:text-white hover:!underline'>
                    {i18n?.t('Read More')}
                </Link>
            </div>

        </motion.div>
    );
};

export default ServiceCard;