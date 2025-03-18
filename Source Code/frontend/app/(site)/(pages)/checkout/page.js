"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CheckOutCard from '../../../../components/shop/chackoutCard';
import { Form, message, Radio } from 'antd';
import BasicBar from '../../../../components/common/basic-bar';
import FormInput from '../../../../components/form/input';
import { useActionConfirm, useFetch } from '../../../helpers/hooks';
import { applyCoupon, fetchCartlist, fetchUserPaymentMethods, postOrder } from '../../../helpers/backend';
import { useCurrency } from '../../../contexts/site';
import { useI18n } from '../../../providers/i18n';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Button from '../../../../components/common/button';
import { set } from 'nprogress';
import PhoneNumberInput from '../../../../components/form/phoneNumberInput';



const Page = () => {
    const [data, getData] = useFetch(fetchCartlist)
    const [payMethods, getPaymethods] = useFetch(fetchUserPaymentMethods)
    const router = useRouter()
    const { currencySymbol, convertAmount, currency } = useCurrency();
    let { langCode } = useI18n();
    const [subtotal, setSubtotal] = useState(0)
    const [savedMoney, setSavedMoney] = useState(0)
    const [coupon, setCoupon] = useState('')
    const [couponStatus, setCouponStatus] = useState(false)
    const i18n = useI18n();
    useEffect(() => {
        let subtotal = data?.products?.map((item) => item?.price * item?.quantity).reduce((a, b) => a + b, 0)
        setSubtotal(subtotal)
    }, [data])


    const [value, setValue] = useState(undefined);
    const [form] = Form.useForm();

    let productList = data?.products?.map((item) => {
        return {
            productId: item?._id,
            quantity: item?.quantity,
            variantId: item?.variant?._id
        }
    })
    const handlePlaceOrder = async (values) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to proceed with checkout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, checkout',
            cancelButtonText: 'No, cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!value) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Method Required',
                        text: 'Please select a payment method to proceed.',
                    });
                    return;
                }

                let payload = {
                    ...values,
                    currency: currency,
                    langCode: langCode,
                    method: value,
                    subtotal: parseFloat(convertAmount(subtotal)),
                    items: productList,
                    discount_coupon: coupon ? coupon : null
                };
                let { data, error, msg } = await postOrder(payload);
                if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Order Failed',
                        text: msg || 'Something went wrong while placing the order. Please try again.',
                    });
                } else {
                    router.push(data);
                }
            }
        });
    };

    const applyCouponHandler = async () => {
        if (couponStatus) {
            return message.error('Coupon already applied')
        }
        let payload = {
            code: coupon,
            sub_total: subtotal
        };
        let { data, error, msg } = await applyCoupon(payload);
        if (error) {
            message.error(msg || 'Something went wrong while applying coupon. Please try again.');
        } else {
            setSavedMoney(data?.saved_money)
            setSubtotal(data?.current_subtotal)
            setCouponStatus(true)
            message.success('Coupon applied successfully.');
        }
    };


    return (
        <section>
            <BasicBar heading={i18n?.t('Check Out')} subHeading={i18n?.t('Check Out')} />
            <div className='container lg:my-[120px] my-[60px]'>
                {
                    data?.products?.length > 0 ? (
                        <Form form={form} onFinish={handlePlaceOrder}>
                            <div className='flex flex-col md:flex-row space-x-0 md:space-x-[90px] lg:space-x-[136px] mt-4'>
                                <div className='w-full md:w-2/3'>
                                    <p className='shop-heading '>{i18n?.t('Check Out')}</p>
                                    <div className='checkout'>
                                        <div className='lg:mt-16 sm:mt-10 mt-6 w-full space-y-2'>
                                            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                                                <FormInput
                                                    label='FullName'
                                                    name='name'
                                                    type="text"
                                                    placeholder='Enter Your Full Name'
                                                    rules={[{ required: true, message: i18n?.t('Please provide your Full Name') }]}
                                                    className=" w-full p-[18px] rounded font-poppins"
                                                />
                                                <FormInput
                                                    label='Email'
                                                    name='email'
                                                    type="email"
                                                    isEmail={true}
                                                    placeholder='Enter Your Email'
                                                    rules={[{ required: true, message: i18n?.t('Please provide your Email') }]}
                                                    className=" w-full p-[18px] rounded "

                                                />
                                            </div>
                                            <div className="border-none1">
                                            <PhoneNumberInput
                                                label='Phone Number'
                                                name='phone'
                                                rules={[{ required: true, message: i18n?.t('Please provide your Phone Number') }]}
                                                className=" w-full p-[18px] rounded "
                                                />
                                                </div>
                                            <FormInput
                                                label='Location'
                                                name='location'
                                                type="text"
                                                placeholder='Location'
                                                rules={[{ required: true, message: i18n?.t('Please provide your Location') }]}
                                                className=" w-full p-[18px] rounded"
                                            />

                                            <div className='grid grid-cols-1 md:grid-cols-2 items-center  md:space-x-6'>
                                                <FormInput
                                                    label='Town/City'
                                                    name='city'
                                                    type="text"
                                                    placeholder='Town/City'
                                                    rules={[{ required: true, message: i18n?.t('Please provide your Town/City') }]}
                                                    className=" w-full p-[18px] rounded"
                                                />
                                                <FormInput
                                                    label='Zip Code'
                                                    name='zip_code'
                                                    type="number"
                                                    placeholder='Zip Code'
                                                    rules={[{ required: true, message: i18n?.t('Please provide your Zip Code') }]}
                                                    className=" w-full p-[18px] rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className='my-10 text-1 font-semibold text-[24px]'>{i18n?.t('Payment Method')}</p>
                                    <Radio.Group className='grid grid-cols-1 text-[16px] font-poppins border' onChange={e => setValue(e.target.value)} value={value}>
                                        {
                                            payMethods?.docs?.map((method, index) => (
                                                <Radio required key={method?._id} className={`p-4 font-poppins border-[#D9D9D9] border-b w-full`} value={method?.type}>{method?.name}</Radio>
                                            ))
                                        }
                                    </Radio.Group>
                                </div>
                                <div className='w-full md:w-1/3'>
                                    <div>
                                        <p className='text-1 font-bold text-[28px]'>{i18n?.t('Order Summary')}</p>
                                        <div className='mt-16'>
                                            {data?.products?.map((product, index) => (
                                                <CheckOutCard key={index} {...product} currencySymbol={currencySymbol} convertAmount={convertAmount} />
                                            ))}
                                        </div>
                                        <div className='flex  gap-1' >
                                            <div className='w-[80%]'>
                                                <FormInput
                                                    name='coupon'
                                                    type="text"
                                                    placeholder={i18n?.t('Coupon Code')}
                                                    className=" !w-full p-[18px] rounded"
                                                    onChange={(e) => setCoupon(e.target.value)}
                                                    disabled={couponStatus}
                                                />
                                            </div>
                                            <div className='!w-[12%]'>
                                                <Button disabled={couponStatus} className='!py-[6px] !h-fit !w-fit !px-2' onClick={applyCouponHandler}>{couponStatus ? 'Applied' : 'Apply'}</Button>
                                            </div>
                                        </div>
                                        <div className='p-6 mt-[45px] rounded text-[18px] font-light text-[#534C4C] border border-[#D9D9D9]'>
                                            <div className='flex justify-between pb-[18px] font-poppins items-center'><p>{i18n?.t('SubTotal')}</p><p>{currencySymbol}{convertAmount(subtotal + savedMoney)}</p></div>
                                            <div className='flex justify-between py-[18px] font-poppins text-primary items-center'><p>{i18n?.t('Coupon Discount')}</p><p>-{currencySymbol}{convertAmount(savedMoney)}</p></div>
                                            <div className='flex justify-between items-center py-[18px] font-poppins '><p className='font-semibold text-1'>{i18n?.t('Total')}</p><p>{currencySymbol}{convertAmount(subtotal)}</p></div>
                                            <p className='mt-4 text-base font-poppins'>{i18n?.t('Shopping cost calculated at checkout *')}</p>
                                        </div>
                                        
                                    </div>
                                    <button className='process-button'>{i18n?.t('Place Order')}</button>
                                </div>
                            </div>
                        </Form>
                    ) :
                        <div className='flex justify-center items-center'>
                            <p className='text-1'>{i18n?.t('No items in cart')}</p>
                            <Link href='/' className='text-1 font-semibold ml-2'>{i18n?.t('Shop Now')}</Link>
                        </div>
                }
            </div>
        </section>
    );
};

export default Page;
