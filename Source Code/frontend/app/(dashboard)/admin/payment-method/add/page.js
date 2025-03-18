"use client";
import { Card, Checkbox, Form, message } from 'antd';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '../../../components/common/page-title';
import { useI18n } from '../../../../providers/i18n';
import { postPaymentMethod } from '../../../../helpers/backend';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import FormSelect from '../../../../../components/form/select';
import Button from '../../../../../components/common/button';

const AddPaymentMethods = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [selectedMethod, setSelectedMethod] = useState('');
    return (
        <div>
            <PageTitle title="Add Payment Method" />
            <PaymentMethodForm title={i18n?.t('Add Method')} form={form} selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
        </div>
    );
};

export default AddPaymentMethods;

export const PaymentMethodForm = ({ title, form, selectedMethod, setSelectedMethod }) => {
    const { push } = useRouter()
    const i18n = useI18n()

    const handleFinish = async (values) => {
        const config = (values.config);
        const payload = {
            ...values,
            config: config,
        }
        console.log("🚀 ~ handleFinish ~ config:", config)
        const res = await postPaymentMethod(payload)
        if (res?.error === false) {
            message.success(res?.msg)
            push('/admin/payment-method')
        } else {
            message.error(res?.msg)
        }
    }
    return (
        <>
            <Card>
                <div className="body">
                    <Form form={form} layout="vertical" onFinish={handleFinish}>
                        {
                            title !== "Add Method" && <HiddenInput name="_id" />
                        }
                        <div className="md:w-1/2">
                            <FormInput placeholder={i18n?.t('Enter Name')} name="name" label={"Name"} required />
                        </div>
                        <div className="md:w-1/2">
                            <FormSelect placeholder={i18n?.t('Select Method Type')} name="type" label={'Method Type'}
                                onChange={(e) => {
                                    setSelectedMethod(e)
                                }}
                                options={[
                                    {
                                        value: 'paypal',
                                        label: i18n?.t('Paypal')
                                    },
                                    {
                                        value: 'stripe',
                                        label: i18n?.t('Stripe')
                                    },
                                    {
                                        value: 'razorpay',
                                        label: i18n?.t('Razorpay')
                                    },
                                    {
                                        value: 'sslcommerz',
                                        label: i18n?.t('sslcommerz')
                                    },
                                    {
                                        value: 'mollie',
                                        label: i18n?.t('Mollie')
                                    },
                                ]}
                                allowClear
                            />
                        </div>
                        {
                            selectedMethod === 'paypal' &&
                            <>
                                <div className="md:w-1/2">
                                    <FormInput required name={['config', 'clientId']} label={'Paypal Client ID'} placeholder={''} />
                                    <FormInput required name={['config', 'clientSecret']} label={'Paypal Client Secret'} placeholder={''} />
                                    <FormSelect required name={['config', 'mode']} label={"Paypal Mode"} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                                </div>
                            </>
                        }
                        {
                            selectedMethod === 'stripe' &&
                            <>
                                <div className="md:w-1/2">
                                    <FormInput required name={['config', 'clientId']} label={'Stripe Secret Key'} placeholder={''} />
                                    <FormInput required name={['config', 'clientSecret']} label={'Stripe Webhook Endpoint secret'} placeholder={''} />
                                    <FormSelect required name={['config', 'mode']} label={'Stripe Mode'} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                                </div>
                            </>
                        }
                        {
                            selectedMethod === 'razorpay' &&
                            <>
                                <div className="md:w-1/2">
                                    <FormInput required name={['config', 'clientId']} label={'Razorpay Key ID'} placeholder={''} />
                                    <FormInput required name={['config', 'clientSecret']} label={'Razorpay Key Secret'} placeholder={''} />
                                    <FormSelect required name={['config', 'mode']} label={'Razorpay Mode'} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                                </div>
                            </>
                        }
                        {
                            selectedMethod === 'sslcommerz' &&
                            <>
                                <div className="md:w-1/2">
                                    <FormInput required name={['config', 'clientId']} label={'Store ID'} placeholder={''} />
                                    <FormInput required name={['config', 'clientSecret']} label={'Store Password'} placeholder={''} />
                                    <FormSelect required name={['config', 'mode']} label={'SSLCommerz Mode'} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                                    <Form.Item
                                        name={['config', 'is_live']}
                                        valuePropName="checked"
                                        initialValue={false}
                                    >
                                        <Checkbox
                                            onChange={(e) => {
                                                form.setFieldsValue({ ['config.is_live']: e.target.checked })
                                            }}>
                                            {i18n.t("Is Live")}
                                        </Checkbox>
                                    </Form.Item>
                                </div>
                            </>
                        }
                        {
                            selectedMethod === 'mollie' &&
                            <>
                                <div className="md:w-1/2">
                                    <FormInput required name={['config', 'clientId']} label={'Mollie API Key'} placeholder={''} />
                                    <FormSelect required name={['config', 'mode']} label={'Mollie Mode'} options={[{ value: 'sandbox', label: i18n?.t('Sandbox') }, { value: 'live', label: i18n?.t('Live') }]} />
                                </div>
                            </>
                        }
                        <Button type='submit' className='mt-5'>
                            {title === "Add Method" ? "Submit" : "Update"}
                        </Button>
                    </Form>
                </div>
            </Card>
        </>
    )
}