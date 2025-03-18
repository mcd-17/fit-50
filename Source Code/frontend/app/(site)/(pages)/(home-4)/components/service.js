'use client'
import React from 'react';
import ServiceCard from "../components/serviceCard"
import BannerTitle from '../../../../../components/common/banner-title'
import { useFetch } from '../../../../helpers/hooks';
import { fetchServices } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Service = () => {
    const [data, getData, { loading }] = useFetch(fetchServices);
    const i18n = useI18n();

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    return (
        <div className='container lg:mb-[120px] mb-[60px] overflow-hidden 2xl:overflow-visible'>
            <div className='flex justify-between items-end container  overflow-hidden'>
                <BannerTitle subtitle={i18n?.t('service')} title={i18n?.t("Services We're Offering")}  />
                <Link href={'/services'} className='linktext md:block hidden'>{i18n?.t("All Services")}</Link>
            </div>
            <div className='grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6 gap-4 lg:mt-[56px] mt-5'>
                {
                    data?.docs?.slice(0, 8)?.map((service) => (
                        <motion.div
                            // variants={slideVariants}
                            // initial="hidden"
                            // whileInView="visible"
                            // viewport={{ once: false, amount: 0.3 }}
                            // transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <ServiceCard key={service._id} data={service} />
                        </motion.div>

                    ))
                }
            </div>
            <Link href={'/services'} className='linktext block md:hidden mt-5 mx-auto w-fit'>{i18n?.t("All Services")}</Link>
        </div>
    );
};

export default Service;