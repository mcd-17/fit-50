"use client";
import React from 'react';
import { motion } from 'framer-motion';
import BannerTitle from '../common/banner-title';
import ServiceCard from "./serviceCard";
import { useFetch } from '../../app/helpers/hooks';
import { fetchServices } from '../../app/helpers/backend';
import Link from 'next/link';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';
import { usePathname } from 'next/navigation';

const Services = () => {
    const i18n = useI18n();
    const [data] = useFetch(fetchServices);
    const {findDefaultTheme} = useCurrency()
    const pathName = usePathname();
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className='container lg:mb-[120px] mb-[60px] overflow-hidden  '>
            <div className='flex justify-between items-end container  overflow-hidden '>
                <BannerTitle home3={findDefaultTheme?.name==="home3" && pathName === "/" ? true : false} subtitle={i18n?.t('Services')} title={i18n?.t("Services We're Offering")} className={''} />
                <Link href={'/services'} className='linktext md:block hidden'>{i18n?.t("All Services")}</Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:mt-[50px] mt-[30px] pb-2 px-1'>
                {data?.docs?.slice(0, 8)?.map((service, index) => (
                    <motion.div
                        key={index}
                        initial="hidden"
                        whileInView="visible"
                        variants={cardVariants}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <ServiceCard index={index} service={service} />
                    </motion.div>
                ))}
            </div>
            <Link href={'/services'} className='linktext block md:hidden mt-5 mx-auto w-fit'>{i18n?.t("All Services")}</Link>
        </div>
    );
};

export default Services;
