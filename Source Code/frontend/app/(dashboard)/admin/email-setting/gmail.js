import React, { useState, useEffect } from 'react';
import { Form, Input, message, Switch } from 'antd';
import { useAction } from '../../../helpers/hooks';
import { postEmailSettings } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import { Loader } from '../../../../components/common/loader';
import HiddenInput from '../../components/form/input'
import { useI18n } from '../../../providers/i18n';


const GmailEmailProvider = ({ settings, getSettings, loading, setCheckedValue }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                gmail: {
                    auth_email: settings.gmail?.auth_email,
                    password: settings.gmail?.password,
                    service_provider: settings.gmail?.service_provider
                }
            })

            if (settings?.default === 'gmail') {
                setDefaultEmail('gmail');
                form.setFieldsValue({ default: 'gmail' });
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
                host: settings?.sendgrid?.host,
                port: settings?.sendgrid?.port,
                username: settings?.sendgrid?.username,
                password: settings?.sendgrid?.password,
                sender_email: settings?.sendgrid?.sender_email
            },
            default: defaultEmail,
            gmail: {
                auth_email: values?.gmail?.auth_email,
                password: values?.gmail?.password,
                service_provider: values?.gmail?.service_provider
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
                <div className='p-3 space-y-3'>
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">
                        {i18n?.t("Gmail SMTP")}
                    </p>
                    <div className='hidden'>
                        <HiddenInput name="_id" />
                    </div>

                    <Form.Item
                        name={['gmail', 'auth_email']}
                        label={i18n?.t("Email Username")}
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email username!'),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t("Please input email username")} type='text' />
                    </Form.Item>
                    <Form.Item
                        name={['gmail', 'password']}
                        label={i18n?.t("Email Password")}
                        className='mt-1'
                        rules={[
                            {
                                required: true,
                                message: i18n?.t('Please input email password!'),
                            },
                        ]}
                        
                    >
                        <Input.Password placeholder={i18n?.t("Please input email password")} type='password' />

                    </Form.Item>

                    <Form.Item
                        className='mt-1'
                        name={['gmail', 'service_provider']}
                        label={i18n?.t("Service Provider")}
                        rules={[
                            {
                                required: true,
                                message: ('Please input service provider!'),
                            },
                        ]}
                    >
                        <Input placeholder={i18n?.t("Please input service provider")} />
                    </Form.Item>

                    <Form.Item
                        className='mt-1'
                        name='default'
                        label={i18n?.t("Set Default")}
                    >
                        <Switch
                            checked={defaultEmail === 'gmail'}
                            onChange={(checked) => {
                                setDefaultEmail(checked ? 'gmail' : '')
                            }}
                            className={defaultEmail === 'gmail' ? 'bg-primary' : 'bg-blue-500'}
                            checkedChildren={<span className="text-white">{i18n?.t("On")}</span>}
                            unCheckedChildren={<span className="text-white">{i18n?.t("Off")}</span>}
                        />
                    </Form.Item>

                    <div className='relative mt-2'>
                        <Button type='submit' className="mt-2.5">{i18n?.t("Submit")}</Button>
                    </div>
                </div>
            </Form>

        </div>
    );
};


export default GmailEmailProvider;