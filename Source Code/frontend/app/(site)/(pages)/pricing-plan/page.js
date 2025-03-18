'use client'
import React, { useState } from 'react'
import BasicBar from '../../../../components/common/basic-bar'
import PricingCard from '../../../../components/home1/pricingCard'
import { usePathname } from 'next/navigation';
import { subscriptionPlan } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import { motion } from 'framer-motion';

const Page = () => {
    const [activeTab, setActiveTab] = useState('monthly');
    const [data, getData] = useFetch(subscriptionPlan);
    const pathName = usePathname()
    const i18n = useI18n();

    const handleToggleChange = (event) => {
        setActiveTab(event.target.checked ? 'yearly' : 'monthly');
    };

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    const titleVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div>
            <BasicBar heading={i18n?.t('Pricing Plan')} subHeading={i18n?.t('Pricing Plan')} />
            <div className="container lg:py-[140px] sm:py-[100px] py-[50px]">
                <motion.div
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex justify-center  gap-4 relative bottom-3 md:bottom-12 ">
                    <label className="md:flex hidden cursor-pointer items-center  gap-2">
                        <span
                            className={`text-xl font-bold transition-colors duration-300 ${activeTab === 'monthly' ? 'text-primary' : `text-black ${pathName === "/home-3" && "text-white"}`}`}
                        >
                            {i18n?.t('Monthly')}
                        </span>

                        <input
                            type="checkbox"
                            checked={activeTab === 'yearly'}
                            onChange={handleToggleChange}
                            className="toggle"
                        />

                        <span
                            className={`text-xl font-bold transition-colors duration-300 ${activeTab === 'yearly' ? 'text-primary' : `text-black ${pathName === "/home-3" && "text-white"}`}`}
                        >
                            {i18n?.t('Yearly')}
                        </span>
                    </label>
                </motion.div>


                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 '>
                    {data?.docs?.map((price, index) => (
                        <motion.div
                            variants={slideVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <PricingCard
                                key={index}
                                data={price}
                                activeTab={activeTab}
                            />
                        </motion.div>

                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page