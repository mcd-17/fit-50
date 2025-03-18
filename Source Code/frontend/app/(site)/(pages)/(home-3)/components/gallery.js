'use client';
import { Image } from 'antd';
import Link from 'next/link';
import React from 'react';
import BannerTitle from '../../../../../components/common/banner-title';
import { fetchAdminGallery } from '../../../../helpers/backend';
import { useFetch } from '../../../../helpers/hooks';
import { useI18n } from '../../../../providers/i18n';
import { motion } from 'framer-motion';
import { useCurrency } from '../../../../contexts/site';
import { usePathname } from 'next/navigation';

const ImageContainer = ({ imgSrc, alt }) => {

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: false, amount: 0.3 }}
            className='relative z-10 w-full !h-fit gallary-image'>
            <Image
                src={imgSrc}
                alt={"images"}
                preview={true}
                className='w-full md:!h-[350px] !h-[290px]  object-cover'
                style={{
                    borderRadius: '4px',
                    width: '100%',
                    height: '350px',
                    objectFit: 'cover'
                }}
            />
        </motion.div>
    )
};

const Gallery = () => {
    const [data] = useFetch(fetchAdminGallery);
    const {findDefaultTheme} = useCurrency()
    const pathName = usePathname()

    const i18n = useI18n();
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };


    return (
        <div className='container overflow-hidden 2xl:overflow-visible'>
            <BannerTitle home3={findDefaultTheme?.name==="home3" && pathName==="/" ? true : false} subtitle={i18n?.t("Gallery")} title={i18n?.t("All Gallery Photo")} className={'items-start'} />
            <div className='grid grid-cols-2 md:grid-cols-3 gap-6 mt-14 '>
                {data?.docs?.map((image, index) => (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={cardVariants}
                        viewport={{ once: false, amount: 0.3 }}
                        className="w-full">
                        <ImageContainer key={index} imgSrc={image.image} alt={image.alt} />
                    
                     </motion.div>
                ))}
            </div>
            <Link href='/gallary' className='button mt-10 border-b w-fit mx-auto border-primary text-primary flex justify-center'>
                {i18n?.t('View All')}
            </Link>
        </div>
    );
};

export default Gallery;