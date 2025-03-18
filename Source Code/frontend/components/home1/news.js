"use client";
import React from 'react';
import BannerTitle from '../common/banner-title';
import NewsCard from './newsCard';
import Link from 'next/link';
import { fetchBlogsListUser } from '../../app/helpers/backend';
import { useFetch } from '../../app/helpers/hooks';
import { useI18n } from '../../app/providers/i18n';
import { motion } from 'framer-motion';
import { useCurrency } from '../../app/contexts/site';

const BlogNews = () => {
    const [data] = useFetch(fetchBlogsListUser);
    const i18n = useI18n();
    const {findDefaultTheme} = useCurrency()

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };
    return (
        <section className='container lg:my-[120px] my-[60px] overflow-hidden'>
            <div className='flex justify-between items-end '>
                <BannerTitle home3={findDefaultTheme?.name==="home3" ? true : false} subtitle={i18n?.t('blog  and news')} title={i18n?.t('our latest news')} className={''} />
                <Link href={'/blog'} className='text-primary text-base underline cursor-pointer sm:block hidden capitalize'>{i18n?.t('All Blogs')}</Link>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-6 lg:mt-[50px] mt-[30px] pb-2 px-1'>
                {data?.docs?.slice(0, 3).map((news, index) => (
                    <motion.div
                        // variants={slideVariants}
                        // initial="hidden"
                        // whileInView="visible"
                        // viewport={{ once: false, amount: 0.3 }}
                        // transition={{ duration: 0.5, ease: "easeOut" }}
                        exit="exit"
                    >
                        <NewsCard key={index} data={news} />
                    </motion.div>

                ))}
            </div>
            <Link href={'/blog'} className='linktext block md:hidden mt-5 mx-auto w-fit'>{i18n?.t("All Blogs")}</Link>
        </section>
    );
};

export default BlogNews;