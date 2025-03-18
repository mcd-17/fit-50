import React, { useState, useEffect } from 'react';
import { Form, Switch } from 'antd';
import { useAction } from '../../../../helpers/hooks';
import { postMarketingSettings } from '../../../../helpers/backend';
import { Loader } from '../../../../../components/common/loader';
import Button from '../../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../components/form/input';
import { useI18n } from '../../../../providers/i18n';
import FormPassword from '../../../components/form/password';


const SendGridMarketing = ({ settings, getSettings, loading }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            _id: settings?._id,
            host: settings?.email?.sendgrid?.host,
            port: settings?.email?.sendgrid?.port,
            username: settings?.email?.sendgrid?.username,
            password: settings?.email?.sendgrid?.password,
            sender_email: settings?.email?.sendgrid?.sender_email,
        })
        setDefaultEmail(settings?.email?.default)
    }, [settings])


    const onFinish = async (values) => {
        const postData = {
            _id: values._id,
            email: {
                sendgrid: {
                    host: values?.host,
                    port: values?.port,
                    username: values?.username,
                    password: values?.password,
                    sender_email: values?.sender_email
                },
                default: defaultEmail?.length > 3 ? defaultEmail : settings?.email?.default,
                gmail: {
                    auth_email: settings?.email?.gmail?.auth_email,
                    password: settings?.email?.gmail?.password,
                    service_provider: settings?.email?.gmail?.service_provider
                },
                other: {
                    host: settings?.email?.other?.host,
                    port: settings?.email?.other?.port,
                    address: settings?.email?.other?.address,
                    password: settings?.email?.other?.password,
                    provider_name: settings?.email?.other?.provider_name
                },
            },
            email_template: settings?.email_template
        }
        return useAction(postMarketingSettings, { ...postData }, () => {
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
                    <FormInput
                        label={i18n?.t('Email Host')}
                        name={'host'}
                        placeholder={i18n?.t('Please input email host')}
                        required
                    />
                    <FormInput
                        label={i18n?.t('Email Port')}
                        name={'port'}
                        placeholder={i18n?.t('Please input email port')}
                        required
                    />
                    <FormInput
                        label={i18n?.t('Email Username')}
                        name={'username'}
                        placeholder={i18n?.t('Please input email username')}
                        required
                    />
                    <FormPassword
                        label={i18n?.t('Email Password')}
                        name={'password'}
                        placeholder={i18n?.t('Please input email password')}
                        required
                    />
                    <FormInput
                        label={i18n?.t('Sender Email')}
                        name={'sender_email'}
                        placeholder={i18n?.t('Please input sender email')}
                        required
                    />
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

export default SendGridMarketing;