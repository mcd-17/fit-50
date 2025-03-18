'use client';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Form, Modal, Switch } from 'antd';
import { fetchCupons, postCupon, delCupon } from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';
import Table from '../../components/form/table';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import FormDatePicker from '../../../../components/form/date_picker';
import FormSelect from '../../../../components/form/select';
import PageTitle from '../../components/common/page-title';
import { useCurrency } from '../../../contexts/site';

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchCupons);
    const {currencySymbol} = useCurrency()
    const [edit, setEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: 'Name',
            dataField: 'name',
            formatter: (_, d) => <div>{d?.name}</div>,
        },
        {
            text: 'code',
            dataField: 'code',
            formatter: (_, d) => <div>{d?.code}</div>,
        },
        {
            text: 'discount',
            dataField: 'discount',
            formatter: (_, d) => <div>{d?.discount}</div>,
        },
        {
            text: 'type',
            dataField: 'type',
            formatter: (_, d) => <div>{d?.type}</div>,
        },
        {
            text: 'usage limit per user',
            dataField: 'usage_limit_per_user',
            formatter: (_, d) => <div>{d?.usage_limit_per_user}</div>,
        },
        {
            text: 'minimum order amount',
            dataField: 'minimum_order_amount',
            formatter: (_, d) => <div>{currencySymbol}{d?.minimum_order_amount}</div>,
        },
        {
            text: 'expire at',
            dataField: 'expire_at',
            formatter: (_, d) => <div>{dayjs(d?.expire_at).format('YYYY-MM-DD')}</div>,
        },
        {
            text: 'Status',
            dataField: 'status',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.status}
                    onChange={async (e) => {
                        await useAction(postCupon, { _id: d._id, status: e }, () => getData());
                    }}
                    className='bg-gray-500'
                />
            ),
        },
    ];

    const handleSubmit = async (values) => {
        const submitData = {
            _id: values?._id,
            name: values?.name,
            code: values?.code,
            discount: values?.discount,
            type: values?.type,
            usage_limit_per_user: values?.usage_limit_per_user,
            minimum_order_amount: values?.minimum_order_amount,
            expire_at: dayjs(values?.expire_at).format('YYYY-MM-DD'),
            status: values?.status,
        };

        return useAction(postCupon, submitData, () => {
            setOpen(false);
            getData();
        });
    };
    return (
        <div>
            <PageTitle title={'Coupon List'} />
            <Table
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                        }}
                    >
                        {i18n?.t('Add Cupon')}
                    </Button>
                }
                onEdit={(values) => {
                    setTimeout(() => {
                        form.setFieldsValue({
                            ...values,
                            _id: values?._id,
                            expire_at: dayjs(values?.expire_at),
                            status: values?.status === 'Active' || values?.status === true,
                            name: values?.name,
                            code: values?.code,
                            discount: values?.discount,
                            type: values?.type,
                            usage_limit_per_user: values?.usage_limit_per_user,
                            minimum_order_amount: values?.minimum_order_amount,
                        });
                    }, 0);

                    setEdit(true);
                    setOpen(true);
                }}
                data={data}
                columns={columns}
                indexed
                pagination
                onReload={getData}
                loading={loading}
                onDelete={delCupon}
            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={edit ? i18n?.t('Edit Coupon') : i18n?.t('Add Coupon')}
                footer={null}
                destroyOnClose
                width={700}
            >
                <Form layout='vertical' form={form} onFinish={handleSubmit}>
                    {edit && <HiddenInput name='_id' />}
                    <div className='grid grid-cols-2 gap-4'>
                        <FormInput
                            placeholder={'Enter name '}
                            name='name'
                            label={i18n?.t('Name')}
                            required={true}
                        />
                        <FormInput
                            placeholder={'Enter code '}
                            name='code'
                            label={i18n?.t('Code')}
                            required={true}
                        />
                        <FormInput
                            placeholder={'Enter discount '}
                            name='discount'
                            type='number'
                            label={i18n?.t('Discount')}
                            required={true}
                        />
                        <FormSelect
                            placeholder={'Enter type '}
                            name='type'
                            type='number'
                            label={i18n?.t('Type')}
                            required={true}
                            options={[
                                { label: i18n?.t('Percentage'), value: 'percentage' },
                                { label: i18n?.t('Flat'), value: 'flat' },
                            ]}
                        />
                        <FormInput
                            placeholder={'Enter usage limit per user '}
                            name='usage_limit_per_user'
                            type='number'
                            label={i18n?.t('Usage limit per user')}
                            required={true}
                        />
                        <FormInput
                            placeholder={'Enter minimum order amount '}
                            name='minimum_order_amount'
                            type='number'
                            label={i18n?.t('Minimum order amount')}
                            required={true}
                        />
                        <FormDatePicker
                            placeholder={'Enter expire at '}
                            name='expire_at'
                            label={i18n?.t('Expire at')}
                            required={true}
                        />
                        <Form.Item name='status' label={'Status'} valuePropName='checked'>
                            <Switch className='!rounded-full bg-[#505d69] text-black' />
                        </Form.Item>
                    </div>
                    <Button className='mt-5' type='submit'>
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Page;
