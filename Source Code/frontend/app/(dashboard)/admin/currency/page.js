'use client';
import { Form, Modal, Switch } from 'antd';
import React, { useState } from 'react';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import { useAction, useActionConfirm, useFetch } from '../../../helpers/hooks';
import {
    delCurrency,
    fetchCurrency,
    postCurrency
} from '../../../helpers/backend';
import FormSelect from '../../../../components/form/select';
import dayjs from 'dayjs';


const Currency = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchCurrency);
    
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        { text: 'Name', dataField: 'name' },
        { text: 'Symbol', dataField: 'symbol' },
        { text: 'Code', dataField: 'code' },
        { text: 'Placement', dataField: 'placement' },
        { text: 'Rate', dataField: 'rate' },
        {
            text: 'Default',
            dataField: 'default',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Default')}
                    unCheckedChildren={i18n?.t('Not Default')}
                    checked={d?.default}
                    onChange={async (e) => {
                        await useActionConfirm(
                            postCurrency,
                            { _id: d._id, default: e },
                            () => getData(),
                            i18n?.t('Are you sure you want to change default status?'),
                            'Yes, Change'
                        );

                    }}
                    className='bg-gray-500' />
            ),
        },
    ];
    return (
        <div>
            <PageTitle title='Currency List' />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                            setIsEdit(false);
                        }}>
                        {i18n?.t('Add New')}
                    </Button>
                }
                onEdit={(values) => {
                    form.resetFields();
                    form.setFieldsValue({
                        ...values,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delCurrency}
                indexed
                title={<h1 className='opacity-0'>{i18n?.t('Currencies')}</h1>}

            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={isEdit ? i18n?.t('Edit Currency') : i18n?.t('Add Currency')}
                footer={null}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={(values) => {
                        return useAction(
                            values?._id ? postCurrency : postCurrency,
                            {
                                ...values,
                            },
                            () => {
                                setOpen(false);
                                getData();
                            }
                        );
                    }}
                >
                    {isEdit && <HiddenInput name='_id' />}
                    <FormInput placeholder={('Enter Name')} label={('Name')} name='name' required />
                    <FormInput placeholder={('Enter Symbol')} label={('Symbol')} name='symbol' required />
                    <FormInput placeholder={('Enter Code')} label={('Code')} name='code' required />
                    <FormSelect
                        name='placement'
                        label={'Select a placement'}
                        required={true}
                        placeholder={'Select a placement'}
                        options={[
                            { label: i18n?.t("Before"), value: 'Before' },
                            { label: i18n?.t("After"), value: 'After' },
                        ]}
                    />
                    <FormInput placeholder={('Enter Rate')} label={'Rate'} name='rate' type='number' required />
                    <Button type='submit' className='mt-2.5'>{i18n.t('Submit')}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Currency;