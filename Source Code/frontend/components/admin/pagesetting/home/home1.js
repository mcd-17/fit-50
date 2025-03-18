import { Card, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useFetch } from '../../../../app/helpers/hooks';
import { fetchSinglePage, postPage, postSingleImage } from '../../../../app/helpers/backend';
import { useI18n } from '../../../../app/providers/i18n';
import FormInput, { HiddenInput } from '../../../form/input';
import MultipleImageInput from '../../../form/multiImage';
import Button from '../../../common/button';
import { noSelected } from '../../../../app/helpers/utils';


const Home1 = ({ slug }) => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { langCode, languages } = useI18n();
    const [page, getPage] = useFetch(fetchSinglePage);
    const [selectedLang, setSelectedLang] = useState();
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

    useEffect(() => {
        getPage({ slug: slug });
        if (page?._id) {
            const initialFormValues = {
                _id: page._id,
                title: page.title,
                slug: page.slug,
                image: Array.isArray(
                    page.content?.home1Content?.hero_section?.image
                )
                    ? page.content?.home1Content?.hero_section?.image.map((image) => ({
                        url: image.url,
                    }))
                    : [{ url: page.content?.home1Content?.hero_section?.image }],
                about_image: Array.isArray(page.content?.home1Content?.about_section?.about_image)
                    ? page.content.home1Content?.about_section.about_image.map((about_image) => ({ url: about_image.url }))
                    : [{ url: page.content?.home1Content?.about_section?.about_image }],
            };

            if (Array.isArray(languages?.docs)) {
                languages?.docs?.forEach((lang) => {
                    initialFormValues.hero_section = initialFormValues?.home1Content?.hero_section || {};
                    initialFormValues.hero_section.heading =
                        initialFormValues.home1Content?.hero_section.heading || {};
                    initialFormValues.hero_section.heading[lang.code] =
                        page.content?.home1Content?.hero_section?.heading?.[lang.code] || '';
                    initialFormValues.hero_section.description =
                        initialFormValues.home1Content?.hero_section.description || {};
                    initialFormValues.hero_section.description[lang.code] =
                        page.content?.home1Content?.hero_section?.description?.[lang.code] || '';

                    initialFormValues.about_section = initialFormValues?.home1Content?.about_section || {};
                    initialFormValues.about_section.heading =
                        initialFormValues.home1Content?.about_section.heading || {};
                    initialFormValues.about_section.heading[lang.code] =
                        page.content?.home1Content?.about_section?.heading?.[lang.code] || '';
                    initialFormValues.about_section.description =
                        initialFormValues.home1Content?.about_section.description || {};
                    initialFormValues.about_section.description[lang.code] =
                        page.content?.home1Content?.about_section?.description?.[lang.code] || '';
                });
            } else {
                console.error('languages is not an array:', languages);
            }
            setFormValues(initialFormValues);
            form.setFieldsValue(initialFormValues);
        }
    }, [page?.slug]);

    useEffect(() => {
        form.setFieldsValue(formValues);
    }, [selectedLang, formValues]);

    const handleValuesChange = (allValues) => {
        setFormValues(allValues);
    };

    return (
        <div>
            <Card>
                <Form
                    form={form}
                    layout='vertical'
                    onValuesChange={handleValuesChange}
                    onFinish={async (values) => {
                        const uploadImage = async (imageField, imageName) => {
                            if (values?.[imageField]?.[0]?.originFileObj) {
                                const image = {
                                    image: values[imageField][0].originFileObj,
                                    image_name: imageName,
                                };
                                const { data } = await postSingleImage(image);
                                values[imageField] = data;
                            }
                        };
                        await uploadImage('image', 'hero_section');
                        await uploadImage('about_image', 'about_section');
                        let existingContent = page?.content || {};
                        let newContent = {
                            home1Content: {
                                hero_section: {
                                    heading: values?.hero_section?.heading,
                                    description: values?.hero_section?.description,
                                    image: values.image || undefined,
                                },
                                about_section: {
                                    heading: values?.about_section?.heading,
                                    description: values?.about_section?.description,
                                    about_image: values?.about_image || undefined,
                                },
                            }
                        };

                        let mergedContent = {
                            ...existingContent,
                            ...newContent,
                        };

                        let formData = {
                            title: values.title || 'Home',
                            slug: values.slug || slug,
                            content: mergedContent,
                            content_type: 'json',
                        };

                        if (values?._id) {
                            formData._id = page?._id;
                        }

                        postPage(formData).then((res) => {
                            if (res?.error === false) {
                                message.success(res?.msg);
                            }
                        });
                    }}
                >
                    <HiddenInput name='slug' />
                    <HiddenInput name='_id' />

                    <h6 className='text-xl font-semibold font-montserrat'>{i18n?.t('Home Page')}</h6>
                    <div className='mb-4 mt-4 flex flex-wrap justify-start gap-3'>
                        {languages?.docs?.map((l, index) => (
                            <div
                                onClick={() => setSelectedLang(l.code)}
                                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                    ? 'cursor-pointer bg-primary text-white'
                                    : 'cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                key={index}
                            >
                                {l.name}
                            </div>
                        ))}
                    </div>
                    {/* hero section  */}
                    <div className='rounded border p-3'>
                        {languages?.docs?.map((l, index) => (
                            <div
                                key={index}
                                style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                            >
                                <h2 className='mb-4 border-b text-lg font-semibold'>
                                    {i18n?.t('Hero Section')}
                                </h2>
                                <label className='text-secondary'>{i18n?.t('Heading')}</label>
                                <FormInput
                                    name={['hero_section', 'heading', l.code]}
                                    placeholder='Enter heading'
                                />
                                <label className='text-secondary'>{i18n?.t('Description')}</label>
                                <FormInput
                                    name={['hero_section', 'description', l.code]}
                                    placeholder='Enter description'
                                    textArea
                                    rows={4}
                                />
                            </div>
                        ))}

                        <div className='grid grid-cols-2 gap-4 xl:grid-cols-4'>
                            <div className='col-span-1'>
                                <MultipleImageInput
                                    name='image'
                                    label={i18n?.t('Hero Image')}
                                />
                            </div>
                        </div>
                    </div>
                    {/* about section  */}
                    <div className='mt-5 rounded border p-3'>
                        {languages?.docs?.map((l, index) => (
                            <div
                                key={index}
                                style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                            >
                                <h2 className='mb-4 border-b text-lg font-semibold'>
                                    {i18n?.t('About Section')}
                                </h2>
                                <label className='text-secondary'>{i18n?.t('heading')}</label>
                                <FormInput
                                    name={['about_section', 'heading', l.code]}
                                    placeholder='Enter heading'
                                />
                                <label className='text-secondary'>{i18n?.t('Description')}</label>
                                <FormInput
                                    name={['about_section', 'description', l.code]}
                                    placeholder='Enter description'
                                    textArea
                                    rows={4}
                                />
                                <MultipleImageInput name='about_image' label='About Image' />

                            </div>
                        ))}
                    </div>
                    <Button
                        type='submit'
                        onClick={() => noSelected({ form, setSelectedLang })}
                        className='mt-2.5'
                    >
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Home1;