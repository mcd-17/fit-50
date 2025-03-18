'use client';
import React, { useState } from 'react';
import BannerTitle from '../common/banner-title';
import PricingCard from './pricingCard';
import { useFetch } from '../../app/helpers/hooks';
import { subscriptionPlan } from '../../app/helpers/backend';
import { useI18n } from '../../app/providers/i18n';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCurrency } from '../../app/contexts/site';
import { usePathname } from 'next/navigation';

const Pricing = () => {
    const [activeTab, setActiveTab] = useState('monthly');
    const {findDefaultTheme} = useCurrency()
    const pathName = usePathname();

    const i18n = useI18n();
    const [data] = useFetch(subscriptionPlan);
    const handleToggleChange = (event) => {
        setActiveTab(event.target.checked ? 'yearly' : 'monthly');
    };

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    return (
        <section className={`container mx-auto`}>
             <div className='flex justify-between items-end container overflow-hidden '>
             <BannerTitle home3={findDefaultTheme?.name==="home3" && pathName === "/" ? true : false} className={''} title={i18n?.t('Choose the best plans')} subtitle={i18n?.t('Pricing')} />
                <Link href={'/pricing-plan'} className='linktext md:block hidden'>{i18n?.t("All Pricing")}</Link>
            </div>
            <div className="md:mt-10">
                <label className="flex md:hidden cursor-pointer items-center my-5 w-fit mx-auto gap-2">
                    <span
                        className={`font-poppins ${activeTab === 'monthly' ? 'text-primary' : 'text-textMain'}`}
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
                        className={`font-poppins ${activeTab === 'yearly' ? 'text-primary' : 'text-textMain'}`}
                    >
                        {i18n?.t('Yearly')}
                    </span>
                </label>
                <div
                    className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                >
                    {data?.docs?.slice(0, 3).map((price, index) => (
                        <motion.div
                            variants={slideVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            key={index} exit="exit">
                            <PricingCard
                                data={price}
                                activeTab={activeTab}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
