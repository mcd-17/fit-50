'use client'
import React from 'react';
import ProductCard from '../../../../components/shop/productCard';
import BasicBar from '../../../../components/common/basic-bar';
import { useFetch } from '../../../helpers/hooks';
import { fatchWishlist } from '../../../helpers/backend';
import { Empty } from 'antd';
import Link from 'next/link';
import { useI18n } from '../../../providers/i18n';

const Page = () => {
    const i18n = useI18n()
    const [wishlist, getWaishlist] = useFetch(fatchWishlist);
    return (
        <section className=' '>
            <BasicBar heading={i18n?.t('wish List')} subHeading={i18n?.t('wish List')} />
            <div className='container lg:my-[120px] my-[60px]'>
                <p className='shop-heading font-montserrat capitalize'>{i18n?.t("wish List")}</p>
                <div className='w-full'>
                    {
                        wishlist?.docs[0]?.products?.length > 0 ? (<div className='w-full grid grid-cols-1 lg:grid-cols-2  gap-5'>
                            {
                                wishlist?.docs[0]?.products?.map((data, index) => (
                                    <ProductCard
                                        getWaishlist={getWaishlist}
                                        key={index}
                                        data={data}
                                    />
                                ))
                            }
                        </div>) : (
                            <div className='flex justify-center items-center h-[60vh] font-montserrat'><Empty description={<div>
                                <p className='text-1 font-bold text-[28px]'>{i18n?.t('Your wishlist is empty')}</p>
                                <Link href='/shop' className='mt-2 text-2xl font-light text-[#534C4C] underline' >{i18n?.t('Start Shopping')}</Link>
                            </div>} />
                            </div>
                        )
                    }
                </div>

            </div>
        </section>
    );
};

export default Page;