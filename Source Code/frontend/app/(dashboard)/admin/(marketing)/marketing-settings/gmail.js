import React, { useState, useEffect } from 'react';
import { Form, Switch } from 'antd';
import { useAction } from '../../../../helpers/hooks';
import { postMarketingSettings } from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { Loader } from '../../../../../components/common/loader';
import { useI18n } from '../../../../providers/i18n';
import FormInput from '../../../components/form/input';
import FormPassword from '../../../components/form/password';

const GmailEmailProvider = ({ settings, getSettings, loading }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            auth_email: settings?.email?.gmail?.auth_email,
            password: settings?.email?.gmail?.password,
            service_provider: settings?.email?.gmail?.service_provider
        })

        if (settings?.email?.default === 'gmail') {
            setDefaultEmail('gmail');
            form.setFieldsValue({ default: 'gmail' });
        }
    }, [settings])


    const onFinish = async (values) => {
        const postData = {
            email: {
                sendgrid: {
                    host: settings?.email?.sendgrid?.host,
                    port: settings?.email?.sendgrid?.port,
                    username: settings?.email?.sendgrid?.username,
                    password: settings?.email?.sendgrid?.password,
                    sender_email: settings?.email?.sendgrid?.sender_email
                },
                default: defaultEmail?.length > 3 ? defaultEmail : settings?.email?.default,
                gmail: {
                    auth_email: values?.auth_email,
                    password: values?.password,
                    service_provider: values?.service_provider
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
                layout='vertical'
            >
                <div className='p-3 space-y-3'>
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">
                        {i18n?.t("Gmail Provider")}
                    </p>
                    <FormInput
                        label={i18n?.t("Email Address")}
                        name={'auth_email'}
                        placeholder={i18n?.t("Please input email username")}
                        required={true}
                    />
                    <FormPassword
                        label={i18n?.t("Email Password")}
                        name={'password'}
                        placeholder={i18n?.t("Please input email password")}
                        required={true}

                    />
                    <FormInput
                        label={i18n?.t("Service Provider")}
                        initialValue={"gmail"}
                        name={'service_provider'}
                        placeholder={i18n?.t("Please input email username")}
                        readOnly={true}
                    />
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