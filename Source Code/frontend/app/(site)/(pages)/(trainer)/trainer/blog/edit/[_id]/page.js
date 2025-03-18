'use client';
import { Form } from 'antd';
import { useI18n } from '../../../../../../../providers/i18n';
import { useEffect, useState } from 'react';
import { useAction, useFetch } from '../../../../../../../helpers/hooks';
import {
    blogCategoryList,
    fetchBlogTrainerdetails,
    fetchTagsList,
    postBlog,
    postSingleImage,
} from '../../../../../../../helpers/backend';
import JodiEditor from '../../../../../../../../components/form/jodiEditor';
import MultipleImageInput from '../../../../../../../../components/form/multiImage';
import { useRouter } from 'next/navigation';
import FormInput, { HiddenInput } from '../../../../../../../../components/form/input';
import Button from '../../../../../../../../components/common/button';
import FormSelect from '../../../../../../../../components/form/select';
import { noSelected } from '../../../../../../../helpers/utils';
import { InfinitySpin } from 'react-loader-spinner';

const page = ({ params }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [edit, setEdit] = useState(false);
    const [data, getData] = useFetch(fetchBlogTrainerdetails);
    const { push } = useRouter();
    const { languages, langCode } = useI18n();
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [category] = useFetch(blogCategoryList);
    const [tags] = useFetch(fetchTagsList);
    const [loading2, setLoading2] = useState(false);
    const [formData, setFromData] = useState([]);
    let imageUrl = '';
    const handleFinish = async (values) => {
        if (values?.image?.[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image, image_name: 'blog' });
            imageUrl = data;
        } else {
            imageUrl = values?.image?.[0]?.url || '';
        }

        const multiLangFields = ['title', 'short_description', 'details'];
        const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            languages.docs.forEach((lang) => {
                if (values[field] && values[field][lang.code]) {
                    acc[field][lang.code] = values[field][lang.code];
                }
            });
            return acc;
        }, {});

        const submitData = {
            _id: values?._id,
            ...formattedData,
            category: values.category,
            tags: values.tags,
            add_to_popular: values.add_to_popular,
            published: values.published,
            image: imageUrl,
        };

        return useAction(edit ? postBlog : postBlog, submitData, () => {
            push('/trainer/blog');
            setEdit(false);
            getData();
            form.resetFields();
        });
    };
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                ...data,
                category: data?.category?._id,
                tags: data?.tags?.map((tag) => tag._id),
                image: data?.image
                    ? [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: data?.image,
                        },
                    ]
                    : [],
            });
        }
    }, [data]);

    useEffect(() => {
        getData({ _id: params?._id });
    }, [data?._id]);



    return (
        <div>
            <div className='flex items-center justify-between'>
                <h1 className='text-[20px] font-medium leading-[24px] text-textBody'>
                    {i18n.t('Update Blog')}
                </h1>
            </div>
            <div className='mb-4 mt-10 flex flex-wrap justify-start gap-3'>
                {languages?.docs?.map((l, index) => (
                    <button
                        onClick={() => setSelectedLang(l.code)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        key={index}
                    >
                        {l.name}
                    </button>
                ))}
            </div>

            <Form layout='horizontal' form={form} onFinish={handleFinish}>
                <HiddenInput name='_id' />
                {loading2 ? (
                    <div className='flex min-h-[20vh] items-center justify-center'>
                        <InfinitySpin width='140' color='#E67529' />
                    </div>
                ) : (
                    languages?.docs?.map((l, index) => (
                        <div
                            key={index}
                            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                        >
                            <FormInput
                                label={('Title')}
                                name={['title', l.code]}
                                required
                                initialValue={data?.title?.[l.code] || ''}
                                onBlur={(e) => {
                                    if (formData?.length === 0) {
                                        setFromData([
                                            { lang: selectedLang, value: e.target.value },
                                        ]);
                                    } else {
                                        const uniqueData = formData?.filter(
                                            (data) => data?.lang !== selectedLang
                                        );
                                        const moreData = [
                                            ...uniqueData,
                                            { lang: selectedLang, value: e.target.value },
                                        ];
                                        setFromData(moreData);
                                    }
                                }}
                            />
                            <FormSelect
                                label={i18n?.t('Blog Category')}
                                name='category'
                                required
                                options={category?.docs?.map((cat) => ({
                                    label: cat?.name[l.code] ?? cat?.name['en'],
                                    value: cat?._id,
                                }))}
                            />
                            <div className='multiselect'>
                                <FormSelect
                                    label={('Blog Tags')}
                                    name='tags'
                                    required
                                    multi
                                    options={tags?.docs?.map((tag) => ({
                                        label: tag?.name[l.code] ?? tag?.name['en'],
                                        value: tag?._id,
                                    }))}
                                />
                            </div>

                            <FormInput
                                label={i18n?.t('Short Description')}
                                name={['short_description', l.code]}
                                textArea
                                required
                                initialValue={data?.short_description?.[l.code] || ''}
                            />

                            <JodiEditor
                                label={i18n?.t('Details')}
                                name={['details', l.code]}
                                required
                                initialValue={data?.details?.[l.code] || ''}
                            />
                        </div>
                    ))
                )}

                <MultipleImageInput label={i18n?.t('Images')} name='image' required />

                <div className='mt-10 flex justify-between gap-4'>
                    <Button className='!h-fit !py-2' onClick={() => setEdit(false)}>{i18n.t('Cancel')}</Button>
                    <Button
                        type='submit'
                        onClick={() => noSelected({ form, setSelectedLang })}
                        className='mt-2.5 !h-fit !py-2'
                    >
                        {i18n?.t('Update')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default page;
