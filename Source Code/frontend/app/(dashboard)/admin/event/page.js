'use client';
import dayjs from 'dayjs';
import { Modal, Switch, DatePicker, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../components/form/input';
import MultipleImageInput from '../../components/form/multiImage';
import { useAction, useFetch } from '../../../helpers/hooks';
import { fetchEvents, postEvents, postSingleImage, deleteEvents } from '../../../helpers/backend';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';

const Page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchEvents);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);
    const onFinish = async (values) => {
        if (values?.image[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image: image, image_name: 'event' });
            values.image = data;
        } else {
            values.image = values?.image[0]?.url;
        }
        const multiLangFields = ['name', 'description'];
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
            ...formattedData,
            _id: values?._id,
            image: values?.image,
            name: values?.name,
            description: values?.description,
            location: values?.location,
            start_date: dayjs(values?.start_date),
            end_date: dayjs(values?.end_date),
            is_active: values?.is_active,
        };
        useAction(postEvents, submitData, () => {
            form.resetFields();
            setOpen(false);
            getData();
        });
    };

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: 'Image',
            dataField: 'image',
            formatter: (_, d) => <TableImage url={d?.image} />,
        },
        {
            text: 'Name',
            dataField: 'name',
            formatter: (_, d) => (
                <span className='line-clamp-2 w-[150px] text-wrap sm:w-[250px]'>
                    {columnFormatter(d?.name)}
                </span>
            ),
        },
        {
            text: 'Location',
            dataField: 'location',
            formatter: (_, d) => (
                <span className='line-clamp-2 w-[150px] text-wrap sm:w-[250px]'>{d?.location}</span>
            ),
        },
    ];
    return (
        <div>
            <PageTitle title={'Events List'} />
            <Table
                indexed
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                            setIsEdit(false);
                        }}
                    >
                        {i18n?.t('Add Event')}
                    </Button>
                }
                data={data?.docs}
                columns={columns}
                getData={getData}
                onEdit={(values) => {
                    form.setFieldsValue({
                        ...values,
                        image: Array.isArray(values?.image)
                            ? values?.image
                            : [{ url: values?.image }],
                        start_date: dayjs(values?.start_date),
                        end_date: dayjs(values?.end_date),
                        description: values?.description,
                        name: values?.name,
                        status: values?.status,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onReload={getData}
                loading={loading}
                onDelete={deleteEvents}
            />

            <Modal
                width={600}
                footer={null}
                title={isEdit ? i18n?.t('Edit Event') : i18n?.t('Add Event')}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <div className='mt-2 flex flex-wrap justify-start gap-3'>
                    {languages?.docs?.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                                l.code === selectedLang
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            key={index}
                        >
                            {l.name}
                        </button>
                    ))}
                </div>
                <Form form={form} onFinish={onFinish} layout='vertical' className='mt-4'>
                    {languages?.docs.map((l, index) => (
                        <div
                            key={index}
                            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                        >
                            {isEdit && <HiddenInput name='_id' />}
                            <MultipleImageInput label='Image' name='image' required />
                            <FormInput
                                label='name'
                                name={['name', l.code]}
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
                                placeholder={'Enter Name'}
                                required
                            />

                            <FormInput
                                label='Location'
                                name='location'
                                required
                                placeholder={'Enter Location'}
                            />
                            <div className='flex flex-col gap-4'>
                                <Form.Item label={i18n?.t('Start Date')} name='start_date'>
                                    <DatePicker
                                        placeholder='Start Date'
                                        format='YYYY-MM-DD HH:mm:ss'
                                        showTime={{
                                            defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label={i18n?.t('End Date')} name='end_date'>
                                    <DatePicker
                                        placeholder='End Date'
                                        format='YYYY-MM-DD HH:mm:ss'
                                        showTime={{
                                            defaultValue: dayjs('00:00:00', 'HH:mm:ss'),
                                        }}
                                    />
                                </Form.Item>
                                <FormInput
                                    label='Description'
                                    textArea={true}
                                    rows={7}
                                    name={['description', l.code]}
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
                                    required
                                    placeholder={'Enter Description'}
                                />
                            </div>
                            <Form.Item
                                name='is_active'
                                label={i18n?.t('Active')}
                                valuePropName='checked'
                            >
                                <Switch className='!rounded-full bg-[#505d69] text-black' />
                            </Form.Item>
                            
                            <Button
                                onClick={() => noSelected({ form, setSelectedLang })}
                                type='submit'
                                className='mt-3'
                            >
                                {i18n?.t('Submit')}
                            </Button>
                        </div>
                    ))}
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
