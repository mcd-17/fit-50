'use client';
import React, { useEffect, useState } from 'react';
import { Card, Form, message } from 'antd';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import { fetchSinglePage, postPage } from '../../../../../helpers/backend';
import { HiddenInput } from '../../../../../../components/form/input';
import Button from '../../../../../../components/common/button';
import JodiEditor from '../../../../../../components/form/jodiEditor';
import { noSelected } from '../../../../../helpers/utils';

const PrivacyPage = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [selectedLang, setSelectedLang] = useState(langCode);

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode])

    useEffect(() => {
        getPage({ slug: slug });
    }, [slug]);

    useEffect(() => {
        form.setFieldsValue({
            _id: page?._id,
            title: page?.title,
            slug: page?.slug || slug,
            content: page?.content
        })
    }, [page])

    const handleSubmit = (values) => {
        const submitData = {
            _id: values?._id ? values?._id : undefined,
            title: values?.title || 'Privacy Policy',
            slug: values?.slug || page?.slug,
            content_type: "json",
            content: values.content
        };
        postPage(submitData).then((res) => {
            if (res?.error === false) {
                message.success(res?.msg);
                getPage({ slug: slug });
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
                    onFinish={handleSubmit}
                >
                    <HiddenInput name="_id" />
                    <HiddenInput name="slug" />
                    {languages?.docs?.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <JodiEditor
                                name={['content', l.code]}
                                label={i18n?.t('Content')}
                                required={l?.code === langCode}
                            />
                        </div>
                    ))}
                    <Button onClick={() => noSelected({ form, setSelectedLang })} type='submit' className="mt-2.5">{i18n?.t('Submit')}</Button>
                </Form>
            </Card>
        </div>
    );
};

export default PrivacyPage;