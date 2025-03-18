'use client';
import Image from 'next/image';
import React from 'react';
import { FiMapPin, FiPhoneCall } from 'react-icons/fi';
import { LuMailCheck } from 'react-icons/lu';

import { Form, message } from 'antd';
import BasicBar from '../../../../components/common/basic-bar';
import FormInput from '../../../../components/form/input';
import Button from '../../../../components/common/button';
import { fetchAdminSettings, postContactUs } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';

const Page = () => {
    const [data, getData] = useFetch(fetchAdminSettings);
    const i18n = useI18n();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const res = await postContactUs(values);
        if (res?.error === false) {
            message.success(res?.msg);
            form.resetFields();
        } else {
            message.error(res?.message);
        }
    };
    return (
        <div>
            <BasicBar heading={i18n?.t('Contact Us')} subHeading={i18n?.t('Contact Us')} />
            <div className='container  lg:py-[140px] sm:py-[100px] py-[50px] contact flex flex-col lg:flex-row'>
                <div className='w-full px-6 lg:w-1/2'>
                    <h3 className='font-montserrat text-[48px] font-bold text-textMain' >{i18n?.t('Contact')}</h3>
                    <ul className='text-secondary mt-8 font-medium'>
                        <div className='space-y-8 text-textMain font-poppins'>
                            <p className='flex'>
                                <span>
                                    <FiPhoneCall className='mr-2 mt-1 text-xl' />{' '}
                                </span>
                                +{data?.phone}
                            </p>
                            <p className='flex'>
                                <span>
                                    <LuMailCheck className='mr-2 mt-1 text-xl' />{' '}
                                </span>
                                {data?.email}
                            </p>
                            <p className='flex lg:w-[370px]'>
                                <span>
                                    <FiMapPin className='mr-2 mt-1 text-xl' />{' '}
                                </span>
                                {data?.address}
                            </p>
                        </div>
                    </ul>
                    <div className='mt-16 flex flex-col justify-center gap-6 md:flex-row'>
                        <Image
                            className='max-h-[419px] max-w-[312px] rounded'
                            src={`https://appstick.s3.ap-southeast-1.amazonaws.com/gymstick-storage/image/9QTWXM5V-handsome-african-bodybuider-with-perfect-body-male-sportsman-sits-bech-with-dumbbell-near-legs_116317-8428.jpg`}
                            width={312}
                            height={419}
                            alt='image'
                        />
                        <Image
                            className='mt-20 max-h-[367px] max-w-[254px] rounded'
                            src={`https://appstick.s3.ap-southeast-1.amazonaws.com/gymstick-storage/image/XAX8LSXV-female-bodybuilder-posing-with-sledgehammer.jpg`}
                            width={254}
                            height={367}
                            alt='image'
                        />
                    </div>
                </div>
                <div className='w-full px-6  lg:w-1/2'>
                    <p className='text-[20px] font-bold capitalize'>{i18n?.t('Get In Touch')}</p>
                    <p className='mt-6 text-[32px] font-montserrat font-semibold capitalize text-primary md:text-[48px]'>
                        {i18n?.t('Join Today!')}
                    </p>
                    <div className='contact'>
                        <Form form={form} onFinish={onFinish} className='mt-16 w-full space-y-6'>
                            <div className='grid grid-cols-1 items-center gap-6 md:grid-cols-2'>
                                <FormInput
                                    label='Name'
                                    name='name'
                                    type='text'
                                    placeholder={i18n?.t('Name')}
                                    rules={[
                                        { required: true, message: i18n?.t('Please provide your Name') },
                                    ]}
                                    className='w-full rounded p-[18px] font-poppins'
                                />
                                <FormInput
                                    label='subject'
                                    name='subject'
                                    type='text'
                                    placeholder={i18n?.t('subject')}
                                    rules={[
                                        { required: true, message: i18n?.t('Please provide your subject') },
                                    ]}
                                    className='w-full rounded p-[18px]'
                                />
                                <FormInput
                                    label='Email'
                                    name='email'
                                    type='email'
                                    placeholder={i18n?.t('Email')}
                                    rules={[
                                        { required: true, message: i18n?.t('Please provide your Email') },
                                    ]}
                                    className='w-full rounded p-[18px]'
                                />
                                <FormInput
                                    label='Phone Number'
                                    name='phone'
                                    type='number'
                                    placeholder='Phone Number'
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n?.t('Please provide your Phone Number'),
                                        },
                                    ]}
                                    className='w-full rounded p-[18px]'
                                />
                            </div>
                            <FormInput
                                label='Message'
                                name='message'
                                textArea
                                type='text'
                                placeholder={i18n?.t('Message')}
                                rules={[{ required: true, message: i18n?.t('Please provide your message') }]}
                                className='h-32 w-full rounded'
                            />
                            <Button className='w-fit' type='submit'>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
