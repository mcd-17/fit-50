'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFetch } from '../../../../helpers/hooks';
import { fetchFeatures } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { motion } from 'framer-motion';

const ChooseWe = () => {
    const [data, getData] = useFetch(fetchFeatures);
    const i18n = useI18n();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const video = {
        subtitle: i18n?.t('Do IT for you!'),
        title: i18n?.t('Improve your life'),
        description:
            i18n?.t('Welcome to this comprehensive guide on the Apple Vision Pro features, where we delve deep into the innovative advancements of this ground technology.'),
        video: 'https://youtu.be/HQfF5XRVXjU?si=_nOdZBRD_aGU3Q_n',
    };

    const subtitleVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
    };

    const titleVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: i * 0.1 },
        }),
    };

    return (
        <div className='container mb-[60px] text-white lg:mb-[120px] overflow-hidden 2xl:overflow-visible'>
            <div className='flex flex-col items-center gap-[23px] '>
                <motion.h4
                    variants={subtitleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                    className='font-montserrat text-lg font-semibold text-white sm:text-xl'>
                    {i18n?.t('Why Choose us')}
                </motion.h4>
                <motion.h1
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }}
                    className='heading font-montserrat font-bold capitalize text-primary'>
                    {i18n?.t('Who we are and what we do')}
                </motion.h1>
            </div>
            <div className='mt-[56px]'>
                <div className='grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-10 xl:grid-cols-3 xl:gap-5'>
                    <div className='block space-y-[50px] md:block md:space-y-[84px]'>
                        {data?.docs &&
                        data?.docs?.slice(0, 3)?.map((facilitie, index) => (
                            <motion.div
                                key={facilitie.id}
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                custom={index}
                                viewport={{ once: false, amount: 0.3 }}
                                className='flex flex-col lg:items-end items-start'>
                                <div className='flex flex-row-reverse lg:items-start justify-start items-start gap-3 md:flex-row'>
                                    <div>
                                        <h1 className="relative lg:text-[21px] text-2xl 2xl:text-3xl font-semibold">
                                            <span className="absolute inset-0 bg-[#E67529] blur-[10px] h-[15px] mt-3.5"></span>
                                            <span className="relative z-10 montserrat line-clamp-1">
                                                {facilitie?.name[i18n?.langCode]}
                                            </span>
                                        </h1>
                                    </div>
                                    <Image
                                        className='h-[50px] w-[50px] object-fill'
                                        width={50}
                                        height={60}
                                        src={facilitie?.image}
                                        alt={facilitie?.title || "facilitie"}
                                    />
                                </div>
                                <p className='mt-5 line-clamp-3 max-w-[440px] font-poppins text-base font-normal'>
                                    {facilitie?.description[i18n.langCode]}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                    <div className='hidden xl:block'>
                        <Image
                            width={1000}
                            height={1000}
                            src='/ladies.png'
                            alt='Ladies'
                            className='h-[776px]'
                        />
                    </div>
                    <div className='block space-y-[50px] md:block md:space-y-[84px]'>
                        {data?.docs?.slice(3, 6)?.map((facilitie, index) => (
                            <motion.div
                                key={facilitie.id}
                                variants={itemVariants}
                                initial="hidden"
                                whileInView="visible"
                                custom={index}
                                viewport={{ once: false, amount: 0.3 }}
                                className='flex flex-col items-start'>
                                <div className='flex items-end justify-start xl:gap-3 gap-2'>
                                    <Image
                                        className='lg:h-[50px] h-10 lg:w-[50px] w-10'
                                        width={50}
                                        height={60}
                                        src={facilitie?.image}
                                        alt={facilitie?.title || "facilitie"}
                                    />
                                    <div>
                                        <h1 className='relative text-2xl whitespace-pre font-semibold lg:text-[21px] 2xl:text-3xl'>
                                            <span className='absolute inset-0 mt-3.5 h-[15px] bg-[#E67529] blur-[10px]'></span>
                                            <span className='relative z-10 font-montserrat'>
                                                {facilitie?.name[i18n.langCode]?.slice(0, 21)}
                                            </span>
                                        </h1>
                                    </div>
                                </div>
                                <p className='mt-5 line-clamp-3 max-w-[440px] font-poppins text-base font-normal'>
                                    {facilitie?.description[i18n.langCode]}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChooseWe;
