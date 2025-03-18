'use client';
import Image from 'next/image';
import React from 'react';
import Button from '../common/button';
import Link from 'next/link';
import { motion } from "framer-motion";
import { useI18n } from '../../app/providers/i18n';

const Hero = ({ data }) => {
    const i18n = useI18n();

    const heading = data?.heading[i18n.langCode] || '';
    const words = heading.split(' ');

    const firstThreeWords = words.slice(0, 3).join(' ');
    const remainingWords = words.slice(3).join(' ');

    const fadeUpVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1 } },
    };
    const fadeUpVariant2 = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 1 } },
    };

    const imageFadeInVariantLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    };

    return (
        <div className='relative overflow-x-hidden '>
            <Image
                src={'/banner.png'}
                width={1920}
                height={986}
                alt='banner'
                className='absolute h-full w-full'
            />
            <div className='relative w-full overflow-hidden bg-[#001223]/90 md:h-[80vh] md:pt-10  md:pb-20 lg:h-[100vh] 0'>
                <Image
                    src={'/banner-vector.png'}
                    width={1920}
                    height={986}
                    alt='banner'
                    className='absolute right-0 hidden h-[55vh] w-[55%] md:top-[78px] md:block lg:top-[111px] xl:top-[112px] 2xl:top-[110px] lg:h-[80vh] '
                />
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={imageFadeInVariantLeft}
                    viewport={{ once: false, amount: 0.3 }}
                    className='hero-content mx-auto flex h-full  '
                >
                    <div className='mx-end relative mt-20 h-[50%] max-w-[1320px]  mx-auto px-4 py-20 md:top-[80px] md:py-0 lg:top-0 lg:h-[83%] xl:h-[86%]  '>
                        <div className='flex h-full flex-col justify-center xl:w-[708px]'>
                            <motion.h1
                                className='largeHeading mb-6  capitalize xl:mb-10 '
                                initial="hidden"
                                whileInView="visible"
                                variants={fadeUpVariant}
                                viewport={{ once: false, amount: 0.3 }}
                            >
                                <span className='text-white'>{firstThreeWords}</span>{' '}
                                <span className='text-primary'>{remainingWords}</span>
                            </motion.h1>
                            <motion.p
                                className='description text-white lg:w-[615px] text-wrap '
                                initial="hidden"
                                whileInView="visible"
                                variants={fadeUpVariant}
                                viewport={{ once: false, amount: 0.3 }}
                            >
                                {data?.description[i18n.langCode]}
                            </motion.p>

                            <div className='mt-10 flex items-center gap-2 md:gap-10 xl:mt-[56px]'>
                                <motion.div
                                    initial={{ x: 20, opacity: .5 }}
                                    animate={{ x: [0, 10, 0], opacity: 1 }}
                                    transition={{
                                        duration: 1,
                                        ease: 'easeInOut',
                                        delay: 2,
                                    }}
                                >
                                    <Button className='button text-white'>
                                        <Link href='/services'>{i18n?.t("Start your journey")}</Link>
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: [0, 10, 0], opacity: 1 }}
                                    transition={{
                                        duration: 1,
                                        ease: 'easeInOut',
                                        delay: 1,
                                    }}
                                >
                                    <Button skipDemo={true} className='button text-white'>
                                        <Link href='/about'>{i18n?.t("Learn More")}</Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeUpVariant2}
                        viewport={{ once: false, amount: 0.3 }}
                        className='hero-img relative top-20 hidden h-[65vh] w-fit flex-col justify-end md:flex lg:top-[130px] xl:right-[4%] 2xl:right-[6%]  lg:h-[100%] 2xl:h-[100%]'
                    >
                        <Image
                            src={data?.image[0]?.url ? data?.image[0]?.url : data?.image}
                            width={788}
                            height={750}
                            alt='hero'
                            className='h-full w-[788px]'
                        />
                    </motion.div>
                </motion.div>
            </div >
        </div >
    );
};

export default Hero;
