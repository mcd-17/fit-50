'use client';
import React from 'react';
import Image from 'next/image';
import BannerTitle from '../common/banner-title';
import Button from '../common/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '../../app/providers/i18n';

const AboutUs = ({ data }) => {
    const i18n = useI18n();

    const aboutImage = Array.isArray(data?.about_image
    )
        ? data.about_image[0]?.url
        : data?.about_image || '';

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className='container mb-[60px] flex flex-col items-center gap-10 lg:mb-[120px] lg:flex-row xl:gap-[104px] overflow-hidden'>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3 }}
                variants={leftToRightVariant}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='flex w-full items-center justify-center bg-[url("/bg-2.png")] bg-contain bg-center bg-no-repeat lg:basis-1/2 relative'
            >
                <p className='text-element xl:text-[100px] lg:text-[90px] sm:text-[80px] xs:text-[70px] text-[60px] font-montserrat absolute text-white bottom-10'>
                    Gymstick
                </p>
                <Image
                    src={aboutImage}
                    width={1920}
                    height={986}
                    alt='About section image'
                    className='object-fill xs:h-[400px] h-[300px] lg:h-[500px] w-[386px] relative '
                />
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3 }}
                variants={rightToLeftVariant}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='w-full lg:basis-1/2'
            >
                <BannerTitle
                    className={'items-start'}
                    subtitle={i18n?.t('About Us')}
                    title={data?.heading[i18n.langCode]}
                />
                <p className='description mb-10 mt-2 line-clamp-3 text-textBody lg:my-10'>
                    {data?.description[i18n.langCode]}
                </p>
                <Button >
                    <Link href='/about'>{i18n?.t('Read More')}</Link>
                </Button>
            </motion.div>
        </div>
    );
};

export default AboutUs;
