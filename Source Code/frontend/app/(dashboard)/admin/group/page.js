'use client';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Form, Modal, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    fetchGroups,
    delGroup,
    addGroup,
    groupTrainers,
    postSingleImage,
} from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import Table, { TableImage } from '../../components/form/table';
import { useI18n } from '../../../providers/i18n';
import { columnFormatter, getStatusClass, noSelected } from '../../../helpers/utils';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import FormSelect from '../../../../components/form/select';
import MultipleImageInput from '../../../../components/form/multiImage';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';

const page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchGroups);
    const [trainers] = useFetch(groupTrainers);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(langCode);
    const [formData, setFromData] = useState([]);

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
            text: 'Name',
            dataField: 'name',
            formatter: (_, d) => <div>{columnFormatter(d?.name)}</div>,
        },
        {
            text: 'Image',
            dataField: 'image',
            formatter: (_, d) => <TableImage url={d?.image ? d?.image : '/defaultimg.jpg'} />,
        },
        {
            text: 'status',
            dataField: 'status',
            formatter: (_, d) => (
                <div className={getStatusClass(d?.status == true ? 'active' : 'rejected')}>
                    {i18n.t(d?.status == true ? 'Active' : 'Inactive')}
                </div>
            ),
        },
    ];

    const onFinish = async (values) => {
        if (values?.image[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image: image, image_name: 'feature' });
            values.image = data;
        } else {
            values.image = values?.image[0]?.url;
        }
        const multiLangFields = ['name', 'facilities'];
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
            facilities: values?.facilities,
            assign_trainers: values?.assign_trainers,
            status: values?.status,
        };
        useAction(addGroup, submitData, () => {
            setOpen(false);
            getData();
            form.resetFields();
        });
    };

    return (
        <div>
            <PageTitle title={'Group List'} />
            <Table
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                        }}
                    >
                        {i18n?.t('Add Group')}
                    </Button>
                }
                onEdit={(values) => {
                    form.setFieldsValue({
                        ...values,
                        assign_trainers: values?.assign_trainers?.map((t) => t?._id),
                        name: values?.name,
                        image: Array.isArray(values?.image)
                            ? values?.image
                            : [{ url: values?.image }],
                        facilities: values?.facilities,
                        status: values?.status,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                data={data}
                columns={columns}
                onDelete={delGroup}
                indexed
                pagination
                onReload={getData}
                loading={loading}
            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={isEdit ? i18n?.t('Edit Group') : i18n?.t('Add Group')}
                footer={null}
            >
                <div className='flex flex-wrap justify-start gap-3'>
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
                <Form form={form} layout='vertical' onFinish={onFinish} className='mt-5'>
                    {languages?.docs.map((l, index) => (
                        <div
                            key={index}
                            style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                        >
                            {isEdit && <HiddenInput name='_id' />}
                            <MultipleImageInput label={'Images'} name={'image'} required />
                            <FormInput
                                name={['name', l.code]}
                                label={`${i18n?.t('Name')}`}
                                placeholder={i18n?.t('Enter Name')}
                                key={index}
                                required
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
                            <Form.List name={'facilities'}>
                                {(fields, { add, remove }) => (
                                    <div className='mb-2'>
                                        {fields.map(({ name }, index) => (
                                            <div key={index} className='flex items-center gap-x-2'>
                                                <div className='w-full'>
                                                    <FormInput
                                                        name={[name, l.code]}
                                                        placeholder={i18n?.t('Enter Facilities')}
                                                        label={'Facilities'}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: i18n?.t(
                                                                    'Please provide a facility'
                                                                ),
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                                <div className='!mt-3'>
                                                    <Button
                                                        onClick={() => remove(index)}
                                                        className='h-[40px] w-[40px] rounded-full border'
                                                    >
                                                        <RiDeleteBin6Line className='relative right-[8px] text-xl text-primary duration-500 group-hover:text-white' />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            className='text-whiterounded-full mb-5 rounded bg-primary px-4 py-2 text-sm font-medium text-white'
                                            type='button'
                                            onClick={() => add()}
                                        >
                                            {i18n?.t('Add Facilities')}
                                        </button>
                                    </div>
                                )}
                            </Form.List>
                            <div className='multiselect'>
                                <FormSelect
                                    placeholder={i18n?.t('Select Trainer')}
                                    name={'assign_trainers'}
                                    className='!overflow-auto'
                                    label={i18n?.t('Trainer')}
                                    required
                                    options={trainers?.map((trainer) => ({
                                        label: trainer.name,
                                        value: trainer._id,
                                    }))}
                                    multi={true}
                                />
                            </div>
                            <Form.Item name='status' label={'Status'} valuePropName='checked'>
                                <Switch className='!rounded-full bg-[#505d69] text-black' />
                            </Form.Item>
                            <br />
                            <Button
                                type='submit'
                                onClick={() => noSelected({ form, setSelectedLang })}
                                className='mt-2.5'
                            >
                                {i18n.t('Submit')}
                            </Button>
                        </div>
                    ))}
                </Form>
            </Modal>
        </div>
    );
};

export default page;
