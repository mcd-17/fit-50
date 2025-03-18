import React, { useState, useEffect } from 'react';
import { Form, Input, Switch } from 'antd';
import { useAction } from '../../../helpers/hooks';
import { postEmailSettings } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import { Loader } from '../../../../components/common/loader';
import HiddenInput from '../../components/form/input'
import { useI18n } from '../../../providers/i18n';


const SendGridManageEmail = ({ settings, getSettings, loading, setCheckedValue }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');


    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                sendgrid: {
                    host: settings?.sendgrid?.host,
                    port: settings?.sendgrid?.port,
                    username: settings?.sendgrid?.username,
                    password: settings?.sendgrid?.password,
                    sender_email: settings?.sendgrid?.sender_email
                }
            })

            if (settings?.default === 'sendgrid') {
                setDefaultEmail('sendgrid');
                form.setFieldsValue({ default: 'sendgrid' });
                setCheckedValue(true);
            } else {
                setDefaultEmail('');
                form.setFieldsValue({ default: '' });
                setCheckedValue(false);
            }
        }
    }, [settings])


    const onFinish = async (values) => {
        const postData = {
            _id: values._id,
            sendgrid: {
                host: values?.sendgrid?.host,
                port: values?.sendgrid?.port,
                username: values?.sendgrid?.username,
                password: values?.sendgrid?.password,
                sender_email: values?.sendgrid?.sender_email
            },
            default: defaultEmail,
            gmail: {
                auth_email: settings?.gmail?.auth_email,
                password: settings?.gmail?.password,
                service_provider: settings?.gmail?.service_provider
            },
            other: {
                host: settings?.other?.host,
                port: settings?.other?.port,
                address: settings?.other?.address,
                password: settings?.other?.password,
                provider_name: settings?.other?.provider_name
            },
        }
        return useAction(postEmailSettings, { ...postData }, () => {
            getSettings();
        })
    };

    if (loading) {
        return <div className='flex justify-center items-center h-[300px]'>
            <Loader />
        </div>
    }


    return (
        <div className='pt-0'>

            <Form
                form={form}
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
            >
                <div className='p-3'>
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">{i18n?.t('SendGrid SMTP')}</p>
                    <div className='hidden'>
                        <HiddenInput name="_id" />
                    </div>
                    <Form.Item
                        name={['sendgrid', 'host']}
                        label={i18n?.t('Email Host')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email host!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t("Please input email host")} />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'port']}
                        label={i18n?.t('Email Port')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email port!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t("Please input email port")} />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'username']}
                        label={i18n?.t('Email Username')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email username!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email username')} />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'password']}
                        label={i18n?.t('Email Password')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t("Please input email password!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email password')} type='password' />
                    </Form.Item>
                    <Form.Item
                        name={['sendgrid', 'sender_email']}
                        label={i18n?.t('Sender Email')}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input sender email!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input sender email')} />
                    </Form.Item>
                    <Form.Item
                        name='default'
                        label={(i18n?.t('Set Default'))}
                    >
                        <Switch
                            checked={defaultEmail === 'sendgrid'}
                            onChange={(checked) => {
                                setDefaultEmail(checked ? 'sendgrid' : '')
                            }}
                            className={defaultEmail === 'sendgrid' ? 'bg-primary mt-1' : 'bg-blue-500 mt-1'}
                            checkedChildren={<span className="text-white">{i18n?.t('On')}</span>}
                            unCheckedChildren={<span className="text-white">{i18n?.t('Off')}</span>}
                        />
                    </Form.Item>
                    <div className='relative'>
                        <Button type='submit' className="mt-2.5">{i18n?.t('Submit')}</Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default SendGridManageEmail;