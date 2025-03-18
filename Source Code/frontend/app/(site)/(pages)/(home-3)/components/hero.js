'use client'
import Image from 'next/image';
import React from 'react';
import Button from '../../../../../components/common/button';
import { motion } from "framer-motion";
import Link from 'next/link';
import { useI18n } from '../../../../providers/i18n';
import { columnFormatter } from '../../../../helpers/utils';


const Hero = ({ data }) => {
    const i18n = useI18n()
    const heading =columnFormatter(data?.heading || '') ;
    const words = heading.split(' ');
    const firstThreeWords = words.slice(0, 3).join(' ');
    const remainingWords = words.slice(3).join(' ');
    const imageFadeInVariantLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    };

    return (
        <div className="relative lg:pt-[121px] pt-[75px] h-fit overflow-hidden " >
            <Image src={data?.image[0]?.url || data?.image} width={1920} height={986} alt='banner' className='absolute w-full lg:h-screen h-[475px] hidden sm:block   ' />
            <div className='w-full h-full relative bg-black/40 sm:pb-[113px ]'>
                <div className='flex relative container overflow-x-hidden  h-full lg:pt-[150px] lg:pb-[180px] sm:pt-[80px] md:pb-[100px] pt-[60px] '>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={imageFadeInVariantLeft}
                        viewport={{ once: false, amount: 0.3 }}
                        className='xl:w-[60%] sm:w-[70%] w-full '>
                        <h1 className='largeHeading mb-6 line-clamp-3 capitalize xl:mb-10 '>
                            <span className='text-white'>{firstThreeWords}</span>
                            <span className='text-primary ml-4 '>{remainingWords}</span>
                        </h1>
                        <p className=' text-white font-poppins w-[75%]'>{data?.description[i18n.langCode]}</p>
                        <div className='xl:mt-[56px] mt-10 flex items-center md:gap-10 gap-2'>
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
                                <Button className='button text-white'>
                                    <Link href='/about'>{i18n?.t("Learn More")}</Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;