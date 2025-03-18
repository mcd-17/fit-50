'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GroupCard from './groupCard';
import { fetchGroupList } from '../../../../helpers/backend';
import BannerTitle from '../../../../../components/common/banner-title';
import { useI18n } from '../../../../providers/i18n';
import { useFetch } from '../../../../helpers/hooks';

const GroupList = () => {
    const [data, getData, { loading }] = useFetch(fetchGroupList);
    const i18n = useI18n();

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className='container lg:mt-[120px] mb-[60px] overflow-hidden '>
            <div className='flex justify-between items-end '>
                <BannerTitle subtitle={i18n?.t('Groups')} title={i18n?.t('Group List')} className={''} />
                <Link href={'/group'} className='linktext md:block hidden '>{i18n?.t("All Groups")}</Link>
            </div>
            <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-4 lg:mt-[50px] mt-[30px] pb-2 px-1'>
                {data?.docs?.slice(0, 4)?.map((group, index) => (
                    <motion.div
                        // variants={slideVariants}
                        // initial="hidden"
                        // whileInView="visible"
                        // viewport={{ once: false, amount: 0.3 }}
                        // transition={{ duration: 0.5, ease: "easeOut" }}
                        key={index} exit="exit">

                        <GroupCard key={index} index={index} group={group} />
                    </motion.div>

                ))}
            </div>
            <Link href={'/group'} className='linktext block md:hidden w-fit mx-auto  mt-5'>{i18n?.t("All Groups")}</Link>
        </div>
    );
};

export default GroupList;