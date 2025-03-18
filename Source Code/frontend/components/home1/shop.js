'use client';
import React from 'react';
import BannerTitle from '../common/banner-title';
import ShopCard from './shopCard';
import Button from '../common/button';
import { allProducts } from '../../app/helpers/backend';
import { useFetch } from '../../app/helpers/hooks';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../app/providers/i18n';
import { motion } from 'framer-motion';
import { useCurrency } from '../../app/contexts/site';

const Shop = () => {
    const i18n = useI18n();
    const router = useRouter();
    const [allproducts, getAllProducts, { loading }] = useFetch(allProducts, {});
    const {findDefaultTheme} = useCurrency()

    const slideVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className='container lg:mt-[120px] mt-[60px] overflow-x-hidden'>
            <BannerTitle home3={findDefaultTheme?.name==="home3" ? true : false} className={"items-center"} title={i18n?.t('here you can buy any thing')} subtitle={i18n?.t('Shop')} />
            <div className=" mx-auto mt-[56px]">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-6 gap-2 mt-[56px]">
                    {allproducts?.docs?.slice(0, 8)?.map((data) => (
                        <motion.div
                            // variants={slideVariants}
                            // initial="hidden"
                            // whileInView="visible"
                            // viewport={{ once: false, amount: 0.3 }}
                            // transition={{ duration: 0.5, ease: "easeOut" }}
                            exit="exit"
                        >
                            <ShopCard key={data?._id} data={data} getData={getAllProducts}/>
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-center my-8">
                    <Button pathName={findDefaultTheme?.name} onClick={() => router.push('/shop')} className="hover:text-white hover:bg-primary">
                        {i18n?.t('View All Products')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Shop;