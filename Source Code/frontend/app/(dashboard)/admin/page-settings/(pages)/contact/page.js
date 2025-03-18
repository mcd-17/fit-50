'use client';
import React, { useEffect, useState } from 'react';
import { Card, Form, message } from 'antd';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import Button from '../../../../../../components/common/button';
import { fetchSinglePage, postPage } from '../../../../../helpers/backend';
import { noSelected } from '../../../../../helpers/utils';

const ContactPage = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [formValues, setFormValues] = useState({});
    const [selectedLang, setSelectedLang] = useState(langCode);

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode])

    useEffect(() => {
        getPage({ slug: slug });
    }, [slug]);

    useEffect(() => {
        if (page?._id) {
            const initialFormValues = {
                _id: page._id,
                title: page.title,
                slug: page.slug,
                map: page.content.map || '',
            };

            languages?.docs?.forEach(lang => {
                ['heading', 'address', 'email', 'phone'].forEach(field => {
                    initialFormValues[field] = initialFormValues[field] || {};
                    initialFormValues[field][lang.code] = page.content[field]?.[lang.code] || '';
                });
            });

            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page]);

    useEffect(() => {
        form.setFieldsValue(formValues);
    }, [selectedLang, formValues]);

    const handleValuesChange = (allValues) => {
        setFormValues(allValues);
    };

    const handleSubmit = (values) => {
        const multiLangFields = ['heading', 'address', 'email', 'phone'];
        const content = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            if (Array.isArray(languages?.docs)) {
                languages.docs.forEach(lang => {
                    if (values[field] && values[field][lang.code]) {
                        acc[field][lang.code] = values[field][lang.code];
                    }
                });
            }

            return acc;
        }, {});

        content.map = values.map;

        const submitData = {
            title: values.title || 'Contact Us',
            slug: values.slug || page?.slug,
            content: content,
            content_type: 'json',
            _id: values?._id ? values?._id : undefined
        };

        postPage(submitData).then((res) => {
            if (res?.error === false) {
                message.success(res?.msg);
                getPage({ slug: slug });
            } else {
                message.error(res?.msg || 'Failed to submit data.');
            }
        });
    };
    return (
        <div>
            <Card>
                <div className="flex justify-start flex-wrap gap-3 mb-4 mt-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                ? 'bg-primary text-white cursor-pointer'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                }`}
                            key={index}
                        >
                            {l.name}
                        </div>
                    ))}
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleValuesChange}
                    onFinish={handleSubmit}
                >
                    <HiddenInput name="slug" />
                    <HiddenInput name="_id" />
                    {languages?.docs?.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                label={i18n?.t("Heading")}
                                name={['heading', l.code]}
                                placeholder="Enter Heading"
                            />
                            <FormInput
                                label={i18n?.t("Address")}
                                name={['address', l.code]}
                                placeholder="Enter Address"
                            />
                            <FormInput
                                label={i18n?.t("Email")}
                                name={['email', l.code]}
                                placeholder="Enter Email"
                            />
                            <FormInput
                                label={i18n?.t("Phone")}
                                name={['phone', l.code]}
                                placeholder="Enter Phone"
                            />
                        </div>
                    ))}
                    <div className='border p-3 rounded mt-3'>
                        <h1 className='text-dark_text text-lg'>{i18n?.t('Google Map Address')}</h1>
                        <FormInput name={'map'} placeholder="Enter Google Map Address" />
                    </div>
                    <Button onClick={() => noSelected({ form, setSelectedLang })} type='submit' className="mt-2.5">{i18n?.t('Submit')}</Button>
                </Form>
            </Card>
        </div>
    );
};

export default ContactPage;

