"use client"
import { Card, Form, Input, message } from 'antd';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { HiOutlineMailOpen } from 'react-icons/hi';
import TextArea from 'antd/es/input/TextArea';
import { useFetch } from '../../../../helpers/hooks';
import { fetchContactDetail, replyContact } from '../../../../helpers/backend';
import { HiddenInput } from '../../../../../components/form/input';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';

const ContactReply = () => {
    const i18n = useI18n()
    const params = useParams()
    const [form] = Form.useForm();
    const [contactMsg, getcontactMsg] = useFetch(fetchContactDetail, {}, false)

    useEffect(() => {
        if (params?._id) {
            getcontactMsg({
                _id: params?._id
            })
        }
    }, [params?._id])

    useEffect(() => {
        if (contactMsg?.email) {
            form.setFieldsValue({
                _id: contactMsg?._id,
                email: contactMsg?.email,
                subject: contactMsg?.subject || `${i18n?.t('Reply From Gymstick')}`,
                message: contactMsg?.reply?.message || ``,
            })
        }
    }, [contactMsg?.email])

    return (
        <div>
            <Card title={i18n?.t('Contact Us SMS Reply')} className={'shadow-sm'}>
                <div className="flex justify-between lg:flex-row flex-col gap-x-8 mt-8">
                    <div className="flex flex-col lg:w-[680px] ">
                        <div className='bg-secondary_gray relative rounded'>
                            <div className='h-12 bg-gray-200'>
                                <div className='absolute w-16 h-16 bg-primary shadow-md rounded flex items-center justify-center text-white -top-5'>
                                    <span> <HiOutlineMailOpen size={35} /> </span>
                                </div>
                                <span className='capitalize ml-20 text-[18px] font-bold'>
                                    {i18n?.t("View Quote Details Information")}
                                </span>
                            </div>
                            <div className='px-[5%] py-[3%] bg-gray-200 rounded flex flex-col space-y-2'>
                                <p className='text-[14px] font-mono'>{i18n?.t("Status")} :
                                    {contactMsg?.status == false ? <span className='bg-red-500 text-white px-2 py-1 rounded ml-2'>
                                        {i18n?.t('Pending')}
                                    </span> : <span className='bg-green-500 text-white px-2 py-1 rounded ml-2'>
                                        {i18n?.t('Replied')}
                                    </span>}
                                </p>
                                <p className='text-[14px] font-mono'>{i18n?.t("Client Name")} : {contactMsg?.name}</p>
                                <p className='text-[14px] font-mono'>{i18n?.t("Client Email")} : {contactMsg?.email}</p>
                                <p className='text-[14px] font-mono'>{i18n?.t("Client Phone")} : {contactMsg?.phone}</p>
                                <p className='text-[14px] font-mono'>{i18n?.t("Subject")} : {contactMsg?.subject}</p>
                                <p className='text-[14px] font-mono'>{i18n?.t("Message")} :</p>
                                <div className='px-[4%] py-[2%] rounded bg-gray-50 text-[14px] text-justify'>
                                    {contactMsg?.message}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col lg:mt-0 mt-8 w-full">
                        <div className='bg-gray-200 relative rounded'>
                            <div className='h-12'>
                                <div className='absolute w-16 h-16 bg-primary shadow-md rounded flex items-center justify-center text-white -top-5'>
                                    <span> <HiOutlineMailOpen size={35} /> </span>
                                </div>
                                <span className='capitalize ml-20 text-[18px] font-bold'>
                                    {i18n?.t("Query")}
                                </span>
                            </div>
                            <div className='p-[2%] bg-gray-200 rounded'>
                                <div className='bg-gray-50 px-[4%] py-[2%] rounded shadow'>
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={async (values) => {
                                            let payload = {
                                                _id: contactMsg?._id,
                                                email: contactMsg?.email,
                                                subject: contactMsg?.subject,
                                                message: values?.message
                                            }
                                            const res = await replyContact(payload)
                                            if (res?.error === false) {
                                                message.success(res?.msg);
                                                getcontactMsg({
                                                    _id: params?._id
                                                })
                                            } else {
                                                message.error(res?.message);
                                            }
                                        }}
                                        autoComplete="off"
                                    >
                                        <HiddenInput name="_id" />
                                        <Form.Item
                                            name="email"
                                            label={i18n?.t('Email To')}
                                        >
                                            <Input disabled={contactMsg?.status === true} />
                                        </Form.Item>
                                        <Form.Item name="subject" label={i18n?.t('Subject')} >
                                            <Input disabled={contactMsg?.status === true} />
                                        </Form.Item>
                                        <Form.Item name="message" label={i18n?.t('Message')} className='mb-3' >
                                            <TextArea type='text-area' disabled={contactMsg?.status === true} />
                                        </Form.Item>
                                        {
                                            contactMsg?.status === false &&
                                            <Button type="submit" className="!w-fit !py-[6px]" >
                                                {i18n?.t('Send')}
                                            </Button>
                                        }
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ContactReply;