'use client'
import { useState } from 'react';
import Image from 'next/image';
import BannerTitle from '../../../../../components/common/banner-title';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import { motion } from 'framer-motion';
import Link from 'next/link';

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
        <div className="flex flex-col lg:flex-row mx-auto container xl:gap-[172px] lg:mt-10 overflow-hidden 2xl:overflow-visible">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3 }}
                variants={leftToRightVariant}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:w-1/2">
                <BannerTitle className={''} title={data?.heading[i18n.langCode]} subtitle={i18n?.t('about us')} />
                <p className="description !text-textBody !font-poppins md:mt-10 mt-5">
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
                <p className="description mb-10 text-textBody font-poppins">{text}</p>
                <Link href={'/services'}>
                    <Button  >
                        {i18n?.t('Service')}
                    </Button>
                </Link>
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3 }}
                variants={rightToLeftVariant}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:w-1/2 flex mt-8 md:mt-0 relative items-center justify-center">
                <Image
                    width={500}
                    height={400}
                    src={'/polygon .png'}
                    alt="Polygon Background"
                    className="w-full h-[70vh] object-contain absolute"
                />
                <Image
                    width={500}
                    height={400}
                    src={image}
                    alt={activeSection || "about us"}
                    className="w-full h-[70vh] object-contain relative"
                />
            </motion.div>
        </div>
    );
};

export default AboutUsSection;
