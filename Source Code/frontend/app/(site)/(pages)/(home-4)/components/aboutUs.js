'use client'
import Image from 'next/image';
import BannerTitle from '../../../../../components/common/banner-title';
import Button from '../../../../../components/common/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useI18n } from '../../../../providers/i18n';
import { useState } from 'react';

const AboutUsSection = ({ data }) => {
    const [activeSection, setActiveSection] = useState('Mission');
    const i18n = useI18n();

    const sectionContent = {
        Mission: {
            text: data?.mission?.text[i18n.langCode],
            image: data?.mission?.image[0]?.url ? data?.mission?.image[0]?.url : data?.mission?.image
        },
        Vision: {
            text: data?.vision?.text[i18n.langCode],
            image: data?.vision?.image[0]?.url ? data?.vision?.image[0]?.url : data?.vision?.image
        },
        Values: {
            text: data?.values?.text[i18n.langCode],
            image: data?.values?.image[0]?.url ? data?.values?.image[0]?.url : data?.values?.image
        }
    };

    const { text, image } = sectionContent[activeSection];

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row-reverse mx-auto container overflow-hidden 2xl:overflow-visible lg:my-[120px] my-[60px] gap-[100px]">
            <motion.div
                // initial="hidden"
                // whileInView="visible"
                // viewport={{ amount: 0.3 }}
                // variants={leftToRightVariant}
                // transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:w-1/2">
                <BannerTitle className={''} title={data?.heading[i18n.langCode]} subtitle={i18n?.t('about us')} />
                <p className="description !text-textBody !font-poppins md:mt-10 mt-5 line-clamp-6">
                    {data?.description[i18n.langCode]}
                </p>
                <div className="flex text-lg font-semibold md:gap-[56px] gap-8 md:my-10 my-5">
                    <button
                        className={`${activeSection === 'Mission' ? 'text-primary underline font-bold font-poppins' : 'text-textMain font-poppins hover:text-primary'}`}
                        onClick={() => setActiveSection('Mission')}
                    >
                        {i18n?.t('Mission')}
                    </button>
                    <button
                        className={`${activeSection === 'Vision' ? 'text-primary underline font-bold font-poppins' : 'text-textMain font-poppins hover:text-primary'}`}
                        onClick={() => setActiveSection('Vision')}
                    >
                        {i18n?.t('Vision')}
                    </button>
                    <button
                        className={`${activeSection === 'Values' ? 'text-primary underline font-bold font-poppins' : 'text-textMain font-poppins hover:text-primary'}`}
                        onClick={() => setActiveSection('Values')}
                    >
                        {i18n?.t('Values')}
                    </button>
                </div>
                <motion.div
                    // initial="hidden"
                    // whileInView="visible"
                    // viewport={{ amount: 0.3 }}
                    // variants={rightToLeftVariant}
                    // transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-[80%] flex sm:my-14 xs:my-10 my-8 relative lg:hidden xs:mx-auto items-center justify-center  ">
                    <div className='bg-primary absolute w-full sm:h-[450px] xs:h-[340px] h-[310px]'></div>
                    <div className='w-full sm:h-[400px] xs:h-[300px] h-[280px] bg-gray-400 relative z-40 sm:left-6 xs:left-5  left-4 '>
                        <Image
                            width={500}
                            height={400}
                            src={image}
                            alt={activeSection}
                            className="w-full h-full object-contain relative"
                        />
                    </div>
                </motion.div>
                <p className="description mb-10 text-textBody font-poppins line-clamp-6">{text}</p>
                <Link href={'/services'}>
                    <Button  >
                        {i18n?.t('Service')}
                    </Button>
                </Link>
            </motion.div>
            <motion.div
                // initial="hidden"
                // whileInView="visible"
                // viewport={{ amount: 0.3 }}
                // variants={rightToLeftVariant}
                // transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-[600px] lg:flex mt-8 md:mt-0 relative hidden items-center justify-center ">
                <div className='bg-primary absolute w-full h-[565px]'></div>
                <div className='w-full h-[500px] bg-gray-400 relative z-40 left-8'>
                    <Image
                        width={900}
                        height={800}
                        src={image}
                        alt={activeSection}
                        className="w-full h-full object-fit relative"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default AboutUsSection;
