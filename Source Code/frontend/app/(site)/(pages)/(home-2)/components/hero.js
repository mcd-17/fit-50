'use client';
import Image from 'next/image';
import React from 'react';
import Button from "../../../../../components/common/button";
import { useI18n } from '../../../../providers/i18n';
import { useFetch } from '../../../../helpers/hooks';
import { fetchFeatures } from '../../../../helpers/backend';
import { columnFormatter } from '../../../../helpers/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero = ({ data }) => {
    const [data1, getData1] = useFetch(fetchFeatures);
    const i18n = useI18n();

    const heading = data?.heading[i18n.langCode] || '';
    const firstWord = heading.split(' ')[2];
    const remainingWords = heading.split(' ').slice(2).join(' ');

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 1 } },
    };

    const zoomUpVariant = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 1 } },
    };

    return (
        <>
            <div className="relative overflow-hidden 2xl:overflow-visible">
                <Image
                    src={'/bg2.png'}
                    width={1920}
                    height={986}
                    alt="banner"
                    className="absolute w-full h-full z-[-1] "
                />
                <div className="relative container w-full lg:h-[100vh] h-full overflow-hidden">
                    <div className="flex lg:flex-row flex-col h-full items-center gap-5">
                        <motion.div
                            className="lg:w-1/2 h-full flex flex-col justify-center pt-[110px] z-10"
                            initial="hidden"
                            whileInView="visible"
                            variants={leftToRightVariant}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <motion.h1
                                className="!text-primary bannertittle uppercase line-clamp-1"
                                initial="hidden"
                                whileInView="visible"
                                variants={leftToRightVariant}
                            >
                                {firstWord}
                            </motion.h1>
                            <motion.h1
                                className="text-white xl:mb-10 mb-6 largeHeading uppercase line-clamp-2"
                                initial="hidden"
                                whileInView="visible"
                                variants={leftToRightVariant}
                            >
                                {remainingWords}
                            </motion.h1>
                            <motion.p
                                className="text-white md:text-2xl description w-[90%]"
                                initial="hidden"
                                whileInView="visible"
                                variants={leftToRightVariant}
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
                                    <Button className='button text-white'>
                                        <Link href='/about'>{i18n?.t("Learn More")}</Link>
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="lg:w-1/2 h-full flex items-end"
                            initial="hidden"
                            whileInView="visible"
                            variants={rightToLeftVariant}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <Image
                                src={data?.image[0]?.url || data?.image}
                                width={602}
                                height={751}
                                alt="hero2"
                                className="w-full h-[50vh] lg:h-[80vh] "
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
            <motion.div
                className='2xl:w-[70%] rounded lg:w-[95%] w-full mx-auto lg:h-[187px] h-[100px] border relative -top-20 !z-40 px-3 bg-white overflow-x-scroll hide-scrollbar md:grid grid-cols-5 box-shadow flex gap-8 items-center'
                initial="hidden"
                whileInView="visible"
                variants={zoomUpVariant}
                viewport={{ once: true, amount: 0.5 }}
            >
                {data1?.docs?.slice(0, 5)?.map((gym) => (
                    <motion.div
                        key={gym?._id}
                        className='flex flex-col items-center justify-center lg:gap-6 gap-3'
                        initial="hidden"
                        whileInView="visible"
                        variants={zoomUpVariant}
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <Image
                            src={gym?.image}
                            width={500}
                            height={400}
                            alt='sehedul'
                            className='lg:w-[39px] sm:w-8 w-[25px] object-contain'
                        />
                        <h2 className='feturetitle'>{columnFormatter(gym?.name)}</h2>
                    </motion.div>
                ))}
            </motion.div>
        </>
    );
};

export default Hero;
