"use client";
import React from 'react';
import { Form } from 'antd';
import PageTitle from '../../../components/common/page-title';
import LanguageForm from './languageForm';
const AddLanguage = () => {
    const [form] = Form.useForm();
    return (
        <>
            <PageTitle title="Add Languages" />
            <LanguageForm title="Add Languages" form={form} />
        </>
    );
};

export default AddLanguage;

