import React, { useEffect, useState } from 'react';
import { fetchSinglePage, postPage, postSingleImage } from '../../../../app/helpers/backend';
import { Card, Form, message } from 'antd';
import { useI18n } from '../../../../app/providers/i18n';
import { useFetch } from '../../../../app/helpers/hooks';
import FormInput, { HiddenInput } from '../../../form/input';
import MultipleImageInput from '../../../form/multiImage';
import Button from '../../../common/button';
import { noSelected } from '../../../../app/helpers/utils';

const Home3 = ({ slug }) => {
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
                    page.content?.home3Content?.hero_section?.image
                )
                    ? page.content?.home3Content?.hero_section?.image.map((image) => ({
                        url: image.url,
                    }))
                    : [{ url: page.content?.home3Content?.hero_section?.image }],

                introduction_image: Array.isArray(page.content?.home3Content?.introduction?.introduction_image)
                    ? page.content?.home3Content?.introduction?.introduction_image.map((image) => ({
                        url: image.url,
                    }))
                    : [{ url: page.content?.home3Content?.introduction?.introduction_image }],
                introduction_logo: Array.isArray(page.content?.home3Content?.introduction?.introduction_logo)
                    ? page.content?.home3Content?.introduction?.introduction_logo.map((image) => ({
                        url: image.url,
                    }))
                    : [{ url: page.content?.home3Content?.introduction?.introduction_logo }],
                mission_image: Array.isArray(page.content?.home3Content?.introduction?.mission?.image)
                    ? page.content?.home3Content?.introduction?.mission?.image.map((image) => ({
                        url: image.url,
                    }))
                    : [{ url: page.content?.home3Content?.introduction?.mission?.image }],
                story_image: Array.isArray(page.content?.home3Content?.introduction?.story?.image)
                    ? page.content?.home3Content?.introduction?.story?.image.map((image) => ({ url: image.url }))
                    : [{ url: page.content?.home3Content?.introduction?.story?.image }],
                approach_image: Array.isArray(page.content?.home3Content?.introduction?.approach?.image)
                    ? page.content?.home3Content?.introduction?.approach?.image.map((image) => ({
                        url: image.url,
                    }))
                    : [{ url: page.content?.home3Content?.introduction?.approach?.image }],
            };

            if (Array.isArray(languages?.docs)) {
                languages?.docs?.forEach((lang) => {
                    initialFormValues.hero_section = initialFormValues.home3Content?.hero_section || {};
                    initialFormValues.hero_section.heading =
                        initialFormValues.home3Content?.hero_section.heading || {};
                    initialFormValues.hero_section.heading[lang.code] =
                        page.content?.home3Content?.hero_section?.heading?.[lang.code] || '';
                    initialFormValues.hero_section.description =
                        initialFormValues.home3Content?.hero_section.description || {};
                    initialFormValues.hero_section.description[lang.code] =
                        page.content?.home3Content?.hero_section?.description?.[lang.code] || '';

                    initialFormValues.introduction = initialFormValues.home3Content?.introduction || {};
                    initialFormValues.introduction.mission =
                        initialFormValues.home3Content?.introduction.mission || {};
                    initialFormValues.introduction.mission.text =
                        initialFormValues.home3Content?.introduction.mission.text || {};
                    initialFormValues.introduction.mission.text[lang.code] =
                        page.content?.home3Content?.introduction?.mission?.text?.[lang.code] || '';

                    initialFormValues.introduction.mission.description =
                        initialFormValues.home3Content?.introduction.mission.description || {};
                    initialFormValues.introduction.mission.description[lang.code] =
                        page.content?.home3Content?.introduction?.mission?.description?.[lang.code] || '';

                    initialFormValues.introduction.story =
                        initialFormValues.home3Content?.introduction.story || {};
                    initialFormValues.introduction.story.text =
                        initialFormValues.home3Content?.introduction.story.text || {};
                    initialFormValues.introduction.story.text[lang.code] =
                        page.content?.home3Content?.introduction?.story?.text?.[lang.code] || '';

                    initialFormValues.introduction.story.description =
                        initialFormValues.home3Content?.introduction.story.description || {};
                    initialFormValues.introduction.story.description[lang.code] =
                        page.content?.home3Content?.introduction?.story?.description?.[lang.code] || '';

                    initialFormValues.introduction.approach =
                        initialFormValues.home3Content?.introduction.approach || {};
                    initialFormValues.introduction.approach.text =
                        initialFormValues.home3Content?.introduction.approach.text || {};
                    initialFormValues.introduction.approach.text[lang.code] =
                        page.content?.home3Content?.introduction?.approach?.text?.[lang.code] || '';

                    initialFormValues.introduction.approach.description =
                        initialFormValues.home3Content?.introduction.approach.description || {};
                    initialFormValues.introduction.approach.description[lang.code] =
                        page.content?.home3Content?.introduction?.approach?.description?.[lang.code] || '';
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
                        await uploadImage('introduction_logo', 'introduction');
                        await uploadImage('introduction_image', 'introduction');
                        await uploadImage('mission_image', 'introduction');
                        await uploadImage('story_image', 'introduction');
                        await uploadImage('approach_image', 'introduction');
                        const mergedContent = {
                            ...page?.content,
                            home3Content: {
                                hero_section: {
                                    heading: values?.hero_section?.heading,
                                    description: values?.hero_section?.description,
                                    image:
                                        values.image || undefined,
                                },

                                introduction: {
                                    mission: {
                                        text: values?.introduction?.mission?.text,
                                        description: values?.introduction?.mission?.description,
                                        image: values?.mission_image || undefined,
                                    },
                                    story: {
                                        text: values?.introduction?.story?.text,
                                        description: values?.introduction?.story?.description,
                                        image: values?.story_image || undefined,
                                    },
                                    approach: {
                                        text: values?.introduction?.approach?.text,
                                        description: values?.introduction?.approach?.description,
                                        image: values?.approach_image || undefined,
                                    },
                                    introduction_logo: values?.introduction_logo || undefined,
                                    introduction_image: values?.introduction_image || undefined,
                                },
                            }
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

                    <h6 className=' text-xl font-semibold font-montserrat'>{i18n?.t('Home Page')}</h6>
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
                                    label={i18n?.t('Dark Banner Image')}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Introduction  */}
                    <div className='mt-5 rounded border p-3'>
                        {languages?.docs?.map((l, index) => (
                            <div
                                key={index}
                                style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                            >
                                <h2 className='mb-4 border-b text-lg font-semibold'>
                                    {i18n?.t('Introduction Section')}
                                </h2>
                                <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
                                    <MultipleImageInput
                                        name='introduction_image'
                                        label={i18n?.t('Introduction Image')}
                                    />
                                    <MultipleImageInput
                                        name='introduction_logo'
                                        label={i18n?.t('Introduction Logo')}
                                    />
                                </div>
                                <div className='mt-5 grid gap-5 lg:grid-cols-3'>
                                    <div>
                                        <label className='text-secondary mb-1'>
                                            {i18n?.t('Mission Heading')}
                                        </label>
                                        <FormInput
                                            name={['introduction', 'mission', 'text', l.code]}
                                            placeholder='Enter mission'
                                            textArea
                                            rows={4}
                                        />
                                        <label className='text-secondary'>
                                            {i18n?.t('Mission Description')}
                                        </label>
                                        <FormInput
                                            name={[
                                                'introduction',
                                                'mission',
                                                'description',
                                                l.code,
                                            ]}
                                            placeholder='Enter mission'
                                            textArea
                                            rows={4}
                                        />
                                        <MultipleImageInput
                                            name='mission_image'
                                            label={i18n?.t('Mission Image')}
                                        />
                                    </div>

                                    <div>
                                        <label className='text-secondary mb-1'>
                                            {i18n?.t('Story Heading')}
                                        </label>
                                        <FormInput
                                            name={['introduction', 'story', 'text', l.code]}
                                            placeholder='Enter vision'
                                            textArea
                                            rows={4}
                                        />
                                        <label className='text-secondary'>
                                            {i18n?.t('Story Description')}
                                        </label>
                                        <FormInput
                                            name={['introduction', 'story', 'description', l.code]}
                                            placeholder='Enter vision'
                                            textArea
                                            rows={4}
                                        />
                                        <MultipleImageInput
                                            name='story_image'
                                            label={i18n?.t('Story Image')}
                                        />
                                    </div>

                                    <div>
                                        <label className='text-secondary mb-1'>
                                            {i18n?.t('Approach Heading')}
                                        </label>
                                        <FormInput
                                            name={['introduction', 'approach', 'text', l.code]}
                                            placeholder='Enter values'
                                            textArea
                                            rows={4}
                                        />
                                        <label className='text-secondary'>
                                            {i18n?.t('Approach Description')}
                                        </label>
                                        <FormInput
                                            name={[
                                                'introduction',
                                                'approach',
                                                'description',
                                                l.code,
                                            ]}
                                            placeholder='Enter values'
                                            textArea
                                            rows={4}
                                        />
                                        <MultipleImageInput
                                            name='approach_image'
                                            label={i18n?.t('Approach Image')}
                                        />
                                    </div>
                                </div>
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

export default Home3;