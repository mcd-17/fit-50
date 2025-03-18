'use client';

import { Form, Modal, Spin, Switch } from 'antd';
import { useEffect, useState } from 'react';
import {
    delSubscription,
    fetchSubscription,
    postSingleImage,
    postSubscription,
} from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import FormInput, { HiddenInput } from '../../components/form/input';

import { columnFormatter, noSelected } from '../../../helpers/utils';
import Button from '../../../../components/common/button';
import MultipleImageInput from '../../../../components/form/multiImage';
import dayjs from 'dayjs';
import { InfinitySpin } from 'react-loader-spinner';

const page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const { languages, langCode, t } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchSubscription);
    const [edit, setEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [is_active, setIsActive] = useState(null);
    const [selectedLang, setSelectedLang] = useState();
    const [loading2, setLoading2] = useState(false);
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
        { text: 'Image', dataField: 'image', formatter: (_, d) => <TableImage url={d?.image} /> },
        {
            text: 'Name',
            dataField: 'name',
            formatter: (_, d) => <span className='capitalize'>{columnFormatter(d?.name)}</span>,
        },
        {
            text: 'Monthly Price',
            dataField: 'monthly_price',
            formatter: (_, d) => d?.monthly_price,
        },
        { text: 'Yearly Price', dataField: 'yearly_price', formatter: (_, d) => d?.yearly_price },
        {
            text: 'Features',
            dataField: 'features',
            formatter: (features) => (
                <span>
                    {features?.map((feature, index) => (
                        <p key={index}>{columnFormatter(feature)}</p>
                    ))}
                </span>
            ),
        },
        {
            text: 'Status',
            dataField: 'is_active',
            formatter: (d) =>
                d === true ? (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800'>
                        {i18n.t('Active')}
                    </span>
                ) : (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800'>
                        {i18n.t('Inactive')}
                    </span>
                ),
        },
    ];
    const handleEdit = (record) => {
        setEditData(record);
        setEdit(true);
    };

    const handleAddNew = () => {
        form.resetFields();
        setEditData(null);
        setEdit(true);
    };

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                ...editData,
                features: editData?.features,
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
    return (
        <div>
            <PageTitle title='Subscription Plan' />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={<Button onClick={handleAddNew}>{i18n?.t('Add New')}</Button>}
                onEdit={handleEdit}
                onDelete={delSubscription}
                indexed
                pagination
                title='  '
            />
            <Modal
                destroyOnClose={true}
                width={800}
                title={editData ? i18n?.t('Update Plan') : i18n?.t('Add New Plan')}
                open={edit}
                onCancel={() => setEdit(false)}
                footer={null}
            >
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
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={async (values) => {
                        try {
                            let imageUrl = '';
                            if (values?.image?.[0]?.originFileObj) {
                                const image = values.image[0].originFileObj;
                                const { data } = await postSingleImage({
                                    image,
                                    image_name: 'pricing-plan',
                                });
                                imageUrl = data;
                            } else {
                                imageUrl = values?.image?.[0]?.url || '';
                            }

                            const multiLangFields = ['name', 'features'];
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
                                monthly_price: values.monthly_price,
                                yearly_price: values.yearly_price,
                                features: values.features,
                                image: imageUrl,
                                is_active: editData
                                    ? values.is_active || form.getFieldValue('is_active')
                                    : true,
                            };

                            await useAction(postSubscription, submitData, () => {
                                setEdit(false);
                                getData();
                                form.resetFields();
                            });
                        } catch (error) {
                            console.error('Error during form submission:', error);
                        }
                    }}
                >
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
                                <HiddenInput name='_id' />

                                <FormInput
                                    label={('Name')}
                                    name={['name', l.code]}
                                    required
                                    initialValue={editData?.name?.[l.code] || ''}
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
                                    placeholder={"Enter Name"}
                                />

                                <Form.List name={'features'} initialValue={[]}>
                                    {(fields, { add, remove }) => (
                                        <div className='mb-2'>
                                            {fields.map(({ name }, index) => (
                                                <div key={index} className='flex gap-x-2'>
                                                    <div className='w-full'>
                                                        <FormInput
                                                            placeholder={i18n?.t('Enter Feature')}
                                                            name={[name, l.code]}
                                                            label={i18n?.t('Features')}
                                                            required
                                                        />
                                                    </div>
                                                    <div className='!h-fit !w-fit'>
                                                        <button
                                                            className='border p-3 mt-6 rounded-lg'
                                                            type='button'
                                                            onClick={() => remove(index)}
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button
                                                className='mb-5'
                                                type='button'
                                                onClick={() => add()}
                                            >
                                                {i18n?.t('Add Feature')}
                                            </Button>
                                        </div>
                                    )}
                                </Form.List>

                                <div className='grid grid-cols-2 gap-x-2'>
                                    <FormInput
                                        label={'Monthly Price'}
                                        name='monthly_price'
                                        placeholder={'Monthly Price'}
                                        required
                                        rules={[
                                            {
                                                validator(_, value) {
                                                    if (value < 0) {
                                                        return Promise.reject(
                                                            new Error(t("Price can't be negative"))
                                                        );
                                                    }
                                                    if (isNaN(value)) {
                                                        return Promise.reject(
                                                            new Error(t('Price should be number'))
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    />
                                    <FormInput
                                        label={'Yearly Price'}
                                        name='yearly_price'
                                        placeholder={'Yearly Price'}
                                        required
                                        rules={[
                                            {
                                                validator(_, value) {
                                                    if (value < 0) {
                                                        return Promise.reject(
                                                            new Error(t("Price can't be negative"))
                                                        );
                                                    }
                                                    if (isNaN(value)) {
                                                        return Promise.reject(
                                                            new Error(t('Price should be number'))
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    />
                                </div>

                                {editData && (
                                    <Form.Item
                                        name='is_active'
                                        label={t('Active')}
                                        valuePropName='checked'
                                        initialValue={true}
                                    >
                                        <Switch
                                            checkedChildren='Active'
                                            unCheckedChildren='Inactive'
                                            onChange={setIsActive}
                                            className='!rounded-full bg-[#505d69] text-black'
                                        />
                                    </Form.Item>
                                )}
                                <MultipleImageInput label={('Image')} name='image' required />
                                <Button
                                    type='submit'
                                    onClick={() => noSelected({ form, setSelectedLang })}
                                    className={`mt-5 block whitespace-pre rounded border-2 border-primary px-3 py-2 text-sm !font-medium capitalize transition-all duration-300 ease-in-out hover:bg-primary hover:text-white sm:text-base md:px-5 lg:px-6`}
                                >
                                    {t('Submit')}
                                </Button>
                            </div>
                        ))
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default page;
