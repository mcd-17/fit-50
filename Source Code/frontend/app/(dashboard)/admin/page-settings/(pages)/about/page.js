"use client";
import { Card, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchSinglePage, postPage, postSingleImage } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import MultipleImageInput from '../../../../../../components/form/multiImage';
import { noSelected } from '../../../../../helpers/utils';
import Button from '../../../../../../components/common/button';

const AboutPageSetting = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { langCode, languages } = useI18n();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    const [selectedLang, setSelectedLang] = useState();
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        getPage({ slug: slug });
    }, [slug]);

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode])

    useEffect(() => {
        if (page?._id) {
            const initialFormValues = {
                _id: page._id,
                title: page.title,
                slug: page.slug,
                mission_image1: Array.isArray(page?.content?.about_page?.mission?.mission_image1)
                    ? page.content?.about_page?.mission?.mission_image1?.map(image => ({ url: image.url }))
                    : [{ url: page.content?.about_page?.mission?.mission_image1 }],
                mission_image2: Array.isArray(page.content?.about_page?.mission?.mission_image2)
                    ? page.content?.about_page?.mission?.mission_image2.map(image => ({ url: image.url }))
                    : [{ url: page.content?.about_page?.mission?.mission_image2 }],
                vision_image1: Array.isArray(page.content?.about_page?.vision?.vision_image1)
                    ? page.content?.about_page?.vision?.vision_image1.map(image => ({ url: image.url }))
                    : [{ url: page.content?.about_page?.vision?.vision_image1 }],
                vision_image2: Array.isArray(page.content?.about_page?.vision?.vision_image2)
                    ? page.content?.about_page?.vision?.vision_image2.map(image => ({ url: image.url }))
                    : [{ url: page.content?.about_page?.vision?.vision_image2 }],
                values_image1: Array.isArray(page.content?.about_page?.values?.values_image1)
                    ? page.content?.about_page?.values?.values_image1.map(image => ({ url: image.url }))
                    : [{ url: page.content?.about_page?.values?.values_image1 }],
                values_image2: Array.isArray(page.content?.about_page?.values?.values_image2)
                    ? page.content?.about_page?.values?.values_image2.map(image => ({ url: image.url }))
                    : [{ url: page.content?.about_page?.values?.values_image2 }],
            };

            if (Array.isArray(languages?.docs)) {
                languages.docs.forEach(lang => {
                    initialFormValues.about_page = initialFormValues.about_page || {};
                    initialFormValues.about_page.heading = initialFormValues.about_page.heading || {};
                    initialFormValues.about_page.heading[lang.code] = page.content?.about_page?.heading?.[lang.code] || '';

                    initialFormValues.about_page.description = initialFormValues.about_page.description || {};
                    initialFormValues.about_page.description[lang.code] = page.content?.about_page?.description?.[lang.code] || '';

                    initialFormValues.about_page.mission = initialFormValues.about_page.mission || {};
                    initialFormValues.about_page.mission.text = initialFormValues.about_page.mission.text || {};
                    initialFormValues.about_page.mission.text[lang.code] = page?.content?.about_page?.mission.text?.[lang.code] || {};

                    initialFormValues.about_page.vision = initialFormValues.about_page.mission || {};
                    initialFormValues.about_page.vision.text = initialFormValues.about_page.vision.text || {};
                    initialFormValues.about_page.vision.text[lang.code] = page?.content?.about_page?.vision.text?.[lang.code] || {};

                    initialFormValues.about_page.values = initialFormValues.about_page.mission || {};
                    initialFormValues.about_page.values.text = initialFormValues.about_page.values.text || {};
                    initialFormValues.about_page.values.text[lang.code] = page?.content?.about_page?.values.text?.[lang.code] || {};


                });
            }
            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page]);

    useEffect(() => {
        form.setFieldsValue(formValues);
    }, [selectedLang, formValues]);

    const handleValuesChange = (changedValues, allValues) => {
        setFormValues(allValues);
    };
    return (
        <div>
            <Card>
                <h6 className="text-secondary py-2 header_4">{i18n?.t('About Page')}</h6>
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
                    onFinish={async (values) => {
                        const uploadImage = async (imageField, imageName) => {
                            if (values?.[imageField]?.[0]?.originFileObj) {
                                const image = { image: values[imageField][0].originFileObj, image_name: imageName };
                                const { data } = await postSingleImage(image);
                                values[imageField] = data;
                            }
                        };
                        await uploadImage('mission_image1', 'about_page');
                        await uploadImage('mission_image2', 'about_page');
                        await uploadImage('vision_image1', 'about_page');
                        await uploadImage('vision_image2', 'about_page');
                        await uploadImage('values_image1', 'about_page');
                        await uploadImage('values_image2', 'about_page');
                        const formData = {
                            title: values?.title || 'About',
                            slug: values?.slug || page?.slug,
                            content: {
                                about_page: {
                                    heading: values?.about_page?.heading,
                                    description: values?.about_page?.description,
                                    mission: {
                                        text: values?.about_page?.mission?.text,
                                        mission_image1: values.mission_image1 || '',
                                        mission_image2: values.mission_image2 || '',
                                    },
                                    vision: {
                                        text: values?.about_page?.vision?.text,
                                        vision_image1: values.vision_image1 || '',
                                        vision_image2: values.vision_image2 || '',
                                    },
                                    values: {
                                        text: values?.about_page?.values?.text,
                                        values_image1: values.values_image1 || '',
                                        values_image2: values.values_image2 || '',
                                    },
                                },
                            },
                            content_type: 'json',
                        };

                        if (values?._id) {
                            formData._id = page?._id;
                        }
                        postPage(formData).then((res) => {
                            if (res?.error === false) {
                                message.success(res?.msg);
                                getPage({ slug: slug });
                            }
                        });
                    }}
                >
                    <HiddenInput name="slug" />
                    <HiddenInput name="_id" />
                    <div className="border p-3 rounded mt-5">
                        {languages?.docs?.map((l, index) => (
                            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                <h2 className='font-semibold text-lg mb-4 border-b'>{i18n?.t('About Page')}</h2>
                                <label className="text-secondary">{i18n?.t('Heading')}</label>
                                <FormInput name={["about_page", "heading", l.code]} placeholder="Enter heading" />
                                <label className="text-secondary">{i18n?.t('Description')}</label>
                                <FormInput name={["about_page", "description", l.code]} placeholder="Enter description" textArea />
                                <div className='grid grid-cols-1 2xl:grid-cols-3 lg:grid-cols-2 2xl:gap-4 '>
                                    <div>
                                        <label className="text-secondary">{i18n?.t('Mission')}</label>
                                        <FormInput name={["about_page", "mission", "text", l.code]} placeholder="Enter mission" textArea />
                                        <div className='grid grid-cols-2 gap-5'>
                                            <MultipleImageInput name="mission_image1" label={i18n?.t("Mission Image 1")} />
                                            <MultipleImageInput name="mission_image2" label={i18n?.t("Mission Image 2")} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-secondary">{i18n?.t('Vision')}</label>
                                        <FormInput name={["about_page", "vision", "text", l.code]} placeholder="Enter vision" textArea />
                                        <div className='grid grid-cols-2 gap-5'>
                                            <MultipleImageInput name="vision_image1" label={i18n?.t("Vision Image 1")} />
                                            <MultipleImageInput name="vision_image2" label={i18n?.t("Vision Image 2")} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-secondary">{i18n?.t('Values')}</label>
                                        <FormInput name={["about_page", "values", "text", l.code]} placeholder="Enter values" textArea />
                                        <div className='grid grid-cols-2 gap-5'>
                                            <MultipleImageInput name="values_image1" label={i18n?.t("Values Image 1")} />
                                            <MultipleImageInput name="values_image2" label={i18n?.t("Values Image 2")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button type="submit" onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">
                        {i18n?.t("Submit")}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default AboutPageSetting;
