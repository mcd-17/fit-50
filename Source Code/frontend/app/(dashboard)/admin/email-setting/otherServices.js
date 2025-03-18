import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch } from 'antd';
const { Option } = Select;
import { useAction } from '../../../helpers/hooks';
import { HiddenInput } from '../../components/form/input';
import { postEmailSettings } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import { Loader } from '../../../../components/common/loader';
import { useI18n } from '../../../providers/i18n';


const OtherProviderManageEmail = ({ settings, getSettings, loading, setCheckedValue }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [defaultEmail, setDefaultEmail] = useState('');

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
            form.setFieldsValue({
                ...settings,
                other: {
                    address: settings?.other?.address,
                    host: settings?.other?.host,
                    password: settings?.other?.password,
                    port: settings?.other?.port,
                    provider_name: settings?.other?.provider_name
                }
            });

            if (settings?.default === 'others') {
                setDefaultEmail('others');
                form.setFieldsValue({ default: 'others' });
                setCheckedValue(true);
            } else {
                setDefaultEmail('');
                form.setFieldsValue({ default: '' });
                setCheckedValue(false);
            }
        }
    }, [settings]);


    const onFinish = async (values) => {
        const postData = {
            _id: values._id,
            other: {
                address: values?.other?.address,
                host: values?.other?.host,
                password: values?.other?.password,
                port: values?.other?.port,
                provider_name: values?.other?.provider_name
            },
            default: defaultEmail,
            sendgrid: {
                host: settings?.sendgrid?.host,
                port: settings?.sendgrid?.port,
                username: settings?.sendgrid?.username,
                password: settings?.sendgrid?.password,
                sender_email: settings?.sendgrid?.sender_email
            },
            gmail: {
                auth_email: settings?.gmail?.auth_email,
                password: settings?.gmail?.password,
                service_provider: settings?.gmail?.service_provider
            }
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
                    <p className="text-[16px] mb-6 border-b-[1px] border-b-[#21ec5e]">
                        {i18n?.t('Other Provider')}
                    </p>
                    <div className='hidden'>

                        <HiddenInput name="_id" />
                    </div>

                    <Form.Item
                        name={['other', 'host']}
                        label={i18n?.t('Email Host')}
                        rules={[
                            {
                                required: true,
                                message: ("Please input email host!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email host')} />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'port']}
                        label={("Email Port")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input email port!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email port')} />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'address']}
                        label={("Email Address")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input email address!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email address')} />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'password']}
                        label={("Email Password")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input email password!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Input placeholder={i18n?.t('Please input email password')} type='password' />
                    </Form.Item>

                    <Form.Item
                        name={['other', 'provider_name']}
                        label={("Service Provider")}
                        rules={[
                            {
                                required: true,
                                message: ("Please input service provider!"),
                            },
                        ]}
                        className='mt-1'
                    >
                        <Select
                            placeholder={i18n?.t('Please input service provider')}
                            allowClear
                        >
                            <Option value="gmail">{i18n?.t('Gmail')}</Option>
                            <Option value="sendgrid">{i18n?.t('SendGrid')}</Option>
                            <Option value="other">{i18n?.t('Other')}</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name='default'
                        label={("Set Default")}
                        className='mt-1'
                    >
                        <Switch
                            checked={defaultEmail === 'others'}
                            onChange={(checked) => {
                                setDefaultEmail(checked ? 'others' : '')
                            }}
                            className={defaultEmail === 'others' ? 'bg-primary mt-1' : 'bg-blue-500 mt-1'}
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


export default OtherProviderManageEmail;