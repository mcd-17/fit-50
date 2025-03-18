"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BasicBar from '../../../../components/common/basic-bar';
import ProductCard from '../../../../components/shop/productCard';
import { Empty } from 'antd';
import { useI18n } from '../../../providers/i18n';
import { useCurrency } from '../../../contexts/site';
import Button from '../../../../components/common/button';

const Page = () => {
    const i18n = useI18n()
    const { currencySymbol, convertAmount, cartItems, getCartItems } = useCurrency();

    const [subtotal, setSubtotal] = useState(0)
    useEffect(() => {
        let subtotal = cartItems?.products?.map((item) => item?.price * item?.quantity).reduce((a, b) => a + b, 0)
        setSubtotal(subtotal)
    }, [cartItems])
    return (
        <section className=''>
            <BasicBar heading={i18n?.t('shopping cart')} subHeading={i18n?.t('shopping cart')} />
            <div className='container lg:my-[120px] my-[60px]'>
                <p className='shop-heading font-montserrat'>{i18n?.t('shopping cart')}</p>
                {
                    cartItems?.products?.length > 0 ?
                        <div className='flex flex-col lg:flex-row space-x-0 xl:space-x-[136px] md:space-x-10 mt-8'>
                            <div className='w-full lg:w-2/3 flex flex-col lg:gap-6 gap-3 '>
                                {
                                    cartItems?.products?.map((product, index) => (
                                        <>
                                            <div className="">
                                                <ProductCard
                                                    key={index}
                                                    data={product}
                                                    getData={getCartItems}
                                                />
                                            </div>
                                        </>
                                    ))
                                }
                            </div>
                            <div className='mt-8 lg:mt-0 w-full lg:w-1/3 '>
                                <div className='rounded p-6 border border-[#D9D9D9]'>
                                    <p className='text-1 font-montserrat'>{i18n?.t('Cart Total')}</p>
                                    <div className='mt-14 text-[18px] font-light text-[#534C4C] font-poppins'>
                                        <div className='flex justify-between pb-[18px] border-[#D9D9D9] border-b'>
                                            <p>{i18n?.t('Subtotal')}</p>
                                            <p>{currencySymbol} {convertAmount(subtotal)}</p>
                                        </div>
                                        <div className='flex justify-between py-[18px] border-[#D9D9D9] border-b'>
                                            <p className='font-semibold '>{i18n?.t('Total')}</p>
                                            <p>{currencySymbol}{convertAmount(subtotal)}</p>
                                        </div>
                                        <p className='mt-4'>{i18n?.t('Shopping cost calculate at checkout')} *</p>
                                    </div>
                                </div>
                                <Link href='/checkout'> <Button className='process-button font-poppins'>{i18n?.t('Proceed to checkout')}</Button></Link>
                            </div>
                        </div> :
                        <div className='flex justify-center items-center h-[60vh] font-montserrat'><Empty description={<div>
                            <p className='text-1 font-bold text-[28px]'>{i18n?.t('Your cart is empty')}</p>
                            <Link href='/shop' className='mt-2 text-2xl font-light text-[#534C4C] underline' >{i18n?.t(' ')}</Link>
                        </div>} />
                        </div>
                }
            </div>
        </section>
    );
};

export default Page;