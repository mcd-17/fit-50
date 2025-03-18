'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Switch, Tooltip, Form } from 'antd';
import { useRouter } from 'next/navigation';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import { useAction, useActionConfirm, useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import { blogCategoryList, delBlog, fetchBlogsList, fetchPopularBlog, fetchPublicBlog, fetchTagsList, postBlog, postSingleImage } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import JodiEditor from '../../../../components/form/jodiEditor';
import MultipleImageInput from '../../../../components/form/multiImage';
import dayjs from 'dayjs';


const AdminBlogCreate = () => {
    const { push } = useRouter();
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { languages, langCode } = useI18n();

    const [data, getData, { loading }] = useFetch(fetchBlogsList);
    const [category, getCategory] = useFetch(blogCategoryList);
    const [tags, getTags] = useFetch(fetchTagsList);

    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedLang, setSelectedLang] = useState();
    let imageUrl = '';

    const handleEdit = (record) => {
        setEditData(record);
        setEdit(true);
    };
    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])
    const handleAddNew = () => {
        form.resetFields();
        setEditData(null);
        setEdit(true);
    };

    useEffect(() => {
        getCategory();
        getTags();
    }, []);

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                ...editData,
                category: editData?.category?._id,
                tags: editData?.tags?.map((tag) => tag._id),
                image: editData?.image
                    ? [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: editData?.image,
                        },
                    ]
                    : [],
            });
        }
    }, [editData]);

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: 'Image',
            dataField: 'image',
            formatter: (_, d) => (
                <div className='flex space-x-1'>
                    <TableImage url={d?.image} />
                </div>
            ),
        },
        {
            text: 'Title',
            dataField: 'title',
            formatter: (title) => (
                <span className=''>
                    <Tooltip title={columnFormatter(title)?.length > 30 ? columnFormatter(title) : ''}>
                        <span className='cursor-help'>
                            {title[langCode]?.length > 30
                                ? columnFormatter(title)?.slice(0, 30) + '...'
                                : columnFormatter(title)}
                        </span>
                    </Tooltip>
                </span>
            ),
        },
        {
            text: 'Category',
            dataField: 'category',
            formatter: (_, d) => <span>{columnFormatter(d?.category?.name)}</span>,
        },
        {
            text: 'Tags',
            dataField: 'tags',
            formatter: (_, d) => <span>{d?.tags?.map((d) => columnFormatter(d?.name)).join(', ')}</span>,
        },
        {
            text: 'Status',
            dataField: 'published',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.published}
                    onChange={async (e) => {
                        await useActionConfirm(fetchPublicBlog, { _id: d._id }, getData, 'Are you sure you want to change published status?', 'Yes, Change');
                    }}
                    className='bg-gray-500'
                />
            ),
        },
        {
            text: 'Popular',
            dataField: 'add_to_popular',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.add_to_popular}
                    onChange={async (e) => {
                        await useActionConfirm(fetchPopularBlog, { _id: d._id }, getData, 'Are you sure you want to change add popular status?', 'Yes, Change');
                    }}
                    className='bg-gray-500'
                />
            ),
        },
    ];

    const handleSubmit = async (values) => {
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
            push('/admin/blog');
            setEdit(false);
            getData();
            form.resetFields();
        });
    };
    return (
        <div>
            <PageTitle title='Blog List' />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                onDelete={delBlog}
                action={
                    <Button onClick={handleAddNew}>
                        {i18n?.t('Add New')}
                    </Button>
                }
                onEdit={handleEdit}
                onView={(data) => push(`/admin/blog/view/${data?._id}`)}
                indexed
                pagination
                langCode={langCode}
            />
            <Modal
                width={800}
                title={editData ? i18n?.t('Update Blog') : i18n?.t('Add Blog')}
                open={edit}
                onCancel={() => setEdit(false)}
                footer={null}
            >
                <div>
                    <div className='flex flex-wrap justify-start gap-3 mt-10'>
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

                    <Form layout='vertical' form={form} onFinish={handleSubmit}>
                        <HiddenInput name='_id' />
                        <div className='mt-4'>
                            {languages?.docs?.map((l, index) => (
                                <div
                                    key={index}
                                    style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                                >
                                    <FormInput
                                        label={('Title')}
                                        name={['title', l.code]}
                                        required
                                        initialValue={editData?.title?.[l.code] || ''}
                                        placeholder={i18n?.t('Enter Title')}
                                    />
                                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 '>
                                        {category && (
                                            <FormSelect
                                                label={i18n?.t('Blog Category')}
                                                placeholder={'Select Category'}
                                                name={'category'}
                                                required
                                                options={category?.docs?.map((cat) => ({
                                                    label: cat?.name[l.code] ?? cat?.name["en"],
                                                    value: cat?._id,
                                                }))}
                                            />
                                        )}
                                        {tags && (
                                            <div className='multiselect'>
                                                <FormSelect
                                                    label={i18n?.t('Blog Tags')}
                                                    name={'tags'}
                                                    placeholder={i18n?.t('Select Tags')}
                                                    required
                                                    multi={true}
                                                    className='!overflow-auto'
                                                    options={tags?.docs?.map((tag) => ({
                                                        label: tag?.name[l.code] ?? tag?.name['en'],
                                                        value: tag?._id,
                                                    }))}
                                                />
                                            </div>

                                        )}
                                    </div>
                                    <FormInput
                                        label={('Short Description')}
                                        name={['short_description', l.code]}
                                        placeholder={i18n?.t('Enter Short Description')}
                                        textArea
                                        initialValue={editData?.short_description?.[l.code] || ''}
                                        required
                                    />
                                    <JodiEditor
                                        label={('Details')}
                                        name={['details', l.code]}
                                        placeholder={i18n?.t('Enter Details')}
                                        required
                                        initialValue={editData?.details?.[l.code] || ''}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                            <Form.Item
                                name="add_to_popular"
                                label={("Add to popular")}
                                valuePropName="checked"
                            >
                                <Switch className="text-black bg-[#505d69] !rounded-full" />
                            </Form.Item>
                            <Form.Item
                                name="published"
                                label={("Published")}
                                valuePropName="checked"
                            >
                                <Switch className="text-black bg-[#505d69] !rounded-full" />
                            </Form.Item>
                            <MultipleImageInput label={("Images")} name={"image"} required />
                        </div>
                        <div className='flex gap-4 mt-10'>
                            <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })}>
                                {editData ? i18n.t('Update') : i18n.t('Submit')}
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default AdminBlogCreate;
