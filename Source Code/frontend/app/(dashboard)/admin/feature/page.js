'use client';
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import Table, { TableImage } from '../../components/form/table';
import Button from '../../../../components/common/button';
import { useAction, useFetch } from '../../../helpers/hooks';
import { fetchFeatures, addFeature, delFeature, postSingleImage } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import FormInput from '../../../../components/form/input';
import { noSelected } from '../../../helpers/utils';
import MultipleImageInput from '../../components/form/multiImage';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchFeatures);
    const [open, setOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [selectedLang, setSelectedLang] = useState(langCode);
    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);

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
                <div className='flex gap-x-3 space-x-1'>
                    <TableImage url={d?.image} />
                </div>
            ),
        },
        {
            text: 'Name',
            dataField: 'name',
            formatter: (value) => value[langCode],
        },
        {
            text: 'Description',
            dataField: 'description',
            formatter: (value) => value[langCode],
        },
    ];

    const handleSubmit = async (values) => {
        if (values?.image[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image: image, image_name: 'feature' });
            values.image = data;
        } else {
            values.image = values?.image[0]?.url;
        }

        const multiLangFields = ['name', 'description', 'image'];
        const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            languages?.docs?.forEach((lang) => {
                if (values[field] && values[field][lang.code]) {
                    acc[field][lang.code] = values[field][lang.code];
                }
                if (values?.image) {
                    acc.image = values?.image?.url;
                }
            });
            return acc;
        }, {});

        const submitData = {
            ...formattedData,
            _id: editingFeature?._id || undefined,
            name: values?.name || 'name',
            description: values?.description || 'description',
            image: values?.image,
        };

        const action = editingFeature ? addFeature : addFeature;

        useAction(action, submitData, () => {
            setOpen(false);
            getData();
            form.resetFields();
            setEditingFeature(null);
        });
    };

    return (
        <>
            <PageTitle title={'Features List'} />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        onClick={() => {
                            setEditingFeature(null);
                            form.resetFields();
                            setOpen(true);
                        }}
                    >
                        {i18n.t('Add New')}
                    </Button>
                }
                onDelete={delFeature}
                onEdit={(feature) => {
                    setEditingFeature(feature);
                    form.setFieldsValue({
                        image: [{ url: feature.image }],
                        name: feature.name,
                        description: feature.description,
                    });
                    setOpen(true);
                }}
                indexed
                pagination
                langCode={langCode}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={editingFeature ? i18n?.t('Edit Feature') : i18n?.t('Add Feature')}
                footer={null}
                destroyOnClose={true}
            >
                <div className='flex flex-wrap justify-start gap-3'>
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
                <Form form={form} layout='vertical' onFinish={handleSubmit} className='mt-5'>
                    {languages?.docs?.map((l, index) => (
                        <div
                            key={index}
                            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                        >
                            <MultipleImageInput name={'image'} label={i18n?.t('Image')} />
                            <FormInput
                            placeholder={i18n?.t('Enter Name')}
                                name={['name', l.code]}
                                label={`${i18n?.t('Name')} (${l.name})`}
                                key={index}
                                required={true}
                            />
                            <FormInput
                            placeholder={i18n?.t('Enter Description')}
                                name={['description', l.code]}
                                label={`${i18n?.t('Description')} (${l.name})`}
                                key={index}
                                required={true}
                            />
                        </div>
                    ))}
                    <Button
                        type='submit'
                        onClick={() => noSelected({ form, setSelectedLang })}
                        className='mt-2.5'
                    >
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default Page;
