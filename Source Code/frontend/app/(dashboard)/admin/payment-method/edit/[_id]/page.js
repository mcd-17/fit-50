"use client";
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { useFetch } from '../../../../../helpers/hooks';
import { fetchPaymentMethod } from '../../../../../helpers/backend';
import PageTitle from '../../../../components/common/page-title';
import { PaymentMethodForm } from '../../add/page';
import { useI18n } from '../../../../../providers/i18n';


const EditPaymentMethod = ({ params }) => {
    const [form] = Form.useForm()
    const i18n = useI18n();
    const [data, getData] = useFetch(fetchPaymentMethod, {}, false);
    const [selectedMethod, setSelectedMethod] = useState('');

    useEffect(() => {
        getData({ _id: params?._id });
        if (data) {
            form.setFieldsValue({
                ...data
            });
            setSelectedMethod(data?.type)
        }
    }, [data?._id]);
    return (
        <div>
            <PageTitle title="Edit Payment Method" />
            <PaymentMethodForm title={i18n?.t('Edit Method')} form={form} selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
        </div>
    );
};

export default EditPaymentMethod;