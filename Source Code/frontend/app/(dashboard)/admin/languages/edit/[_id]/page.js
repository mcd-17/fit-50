"use client";
import { Form } from 'antd';
import React, { useEffect } from 'react';

import PageTitle from '../../../../components/common/page-title';
import { useFetch } from '../../../../../helpers/hooks';
import { fetchLanguage } from '../../../../../helpers/backend';
import LanguageForm from '../../add/languageForm';
const EditLanguages = ({ params }) => {
    const [form] = Form.useForm();
    const [data, getData] = useFetch(fetchLanguage, {}, false);

    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id });
        }
    }, [params]);

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                ...data,
                rtl: data?.rtl ? true : false,
            });
        }
    }, [data]);

    return (
        <>
            <PageTitle title="Edit Languages" />
            <LanguageForm title="Edit Languages" form={form} />
        </>
    );
};

export default EditLanguages;