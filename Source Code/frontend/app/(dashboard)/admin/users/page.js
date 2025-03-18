'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { Form, message, Modal, Select } from 'antd';
import { useAction, useFetch } from '../../../helpers/hooks';
import {
    addUser,
    buySubscriptionByAdmin,
    employeePasswordChange,
    fetchUserPaymentMethods,
    fetchUsers,
    removeUser,
    subscriptionPlan,
} from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import PhoneNumberInput from '../../components/form/phoneNumberInput';
import FormSelect from '../../components/form/select';
import { useCurrency } from '../../../contexts/site';
import { columnFormatter } from '../../../helpers/utils';
import FormPassword from '../../../../components/form/password';

const UsersList = () => {
    const [form] = Form.useForm();
    const [resetForm] = Form.useForm();
    const router = useRouter();
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchUsers, { role: 'user' });
    const [payMethods] = useFetch(fetchUserPaymentMethods);
    const [subscriptions] = useFetch(subscriptionPlan);
    const { currencies } = useCurrency();
    const [open, setOpen] = useState(false);
    const [renue, setRenue] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [employeId, setEmployeId] = useState('');

    const columns = [
        {
            text: 'Registered At',
            dataField: 'createdAt',
            formatter: (d) => dayjs(d).format('DD MMM YYYY'),
        },
        { text: 'Name', dataField: 'name' },
        { text: 'Phone', dataField: 'phone' },
        { text: 'Email', dataField: 'email' },
        {
            text: 'Subscription',
            dataField: 'hasSubscription',
            formatter: (_, d) => (
                <span
                    onClick={() => {
                        if (d?.hasSubscription === false) {
                            setOpen(true);
                            setRenue(true);
                            setEmployeId(d?._id);
                        }
                    }}
                    className={` ${d?.hasSubscription ? '' : 'cursor-pointer'} inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize ${d?.hasSubscription && 'bg-green-100 text-green-800'}`}
                >
                    {d?.hasSubscription ? (
                        'Active'
                    ) : (
                        <p className='rounded !border-none bg-red-500 !px-4 !py-[5px] !text-sm text-white !duration-500 hover:bg-red-600'>
                            Renue
                        </p>
                    )}
                </span>
            ),
        },
        {
            text: i18n.t('Password'),
            dataField: 'password',
            formatter: (_, d) => (
                <>
                    {
                        <Button
                            className='border-primary bg-primary text-white !py-[3px] !h-fit !text-xs'
                            onClick={() => {
                                setIsReset(true);
                                setEmployeId(d?._id);
                            }}
                        >
                            {i18n.t('Reset Password')}
                        </Button>
                    }
                </>
            ),
        },
    ];

    const handleResetPassword = async (values) => {
        const submitData = {
            _id: employeId,
            confirm_password: values?.confirm_password,
            new_password: values?.password
        };
        return useAction(
            employeePasswordChange,
            submitData,
            () => {
                setIsReset(false);
                getData();
                resetForm.resetFields();
            },
            i18n.t('Password Changed Successfully')
        );
    };

    const filteredData = {
        ...data,
        docs: data?.docs?.filter((user) => user.role !== 'admin' && user.role !== 'trainer'),
    };

    let action = (
        <>
            <div className='flex gap-2'>
                <Button
                    className='!h-fit !py-[6px]'
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    {i18n?.t('Add Member')}
                </Button>

                <div className='dashboardSelect'>
                    <Select
                        allowClear
                        placeholder={
                            <h3 className='!text-textMain'>{i18n?.t('Filter Subscription')}</h3>
                        }
                        style={{ minWidth: 150 }}
                        onClear={() => getData({ subscription: undefined })}
                        onChange={(value) => getData({ subscription: value })}
                    >
                        <Select.Option value={undefined}>{i18n?.t('All')}</Select.Option>
                        <Select.Option value={'active'}>{i18n?.t('Active')}</Select.Option>
                        <Select.Option value={'inactive'}>{i18n?.t('Inactive')}</Select.Option>
                    </Select>
                </div>
            </div>
        </>
    );

    return (
        <div>
            <PageTitle title={'Member List'} />
            <Table
                columns={columns}
                loading={loading}
                data={filteredData}
                onReload={getData}
                indexed
                pagination
                onView={(data) => {
                    router.push(`/admin/users/view/${data._id}`);
                }}
                action={action}
                onDelete={removeUser}
            />
            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                    setRenue(false);
                    setEmployeId(null);
                }}
                title={renue ? i18n?.t('Renew Subscription') : i18n?.t('Add Member')}
                footer={null}
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={async (values) => {
                        if (renue) {
                            const { error, msg } = await buySubscriptionByAdmin({
                                user: employeId,
                                subscription: values?.subscription,
                                paymentMethod: values?.paymentMethod,
                                subscriptionType: values?.subscriptionType,
                                currency: values?.currency,
                            });
                            if (error === false) {
                                message.success(msg);
                                setRenue(false);
                                setEmployeId(undefined);
                                setOpen(false);
                                getData();
                                form.resetFields();
                            }
                        } else {
                            const { error, msg, data } = await addUser({
                                name: values?.name,
                                phone: values?.phone,
                                email: values?.email,
                                password: values?.password,
                            });
                            if (error === true) {
                                message.error(msg);
                                return;
                            }
                            if (error === false) {
                                await buySubscriptionByAdmin({
                                    user: data?._id,
                                    subscription: values?.subscription,
                                    paymentMethod: values?.paymentMethod,
                                    subscriptionType: values?.subscriptionType,
                                    currency: values?.currency,
                                });
                                message.success(msg);
                                setOpen(false);
                                getData();
                                form.resetFields();
                            }
                        }
                    }}
                    className='mt-5'
                >
                    {!renue && (
                        <>
                            <FormInput name='name' label={'Name'} required={true} placeholder={"Enter Name"}/>
                            <div className='flex flex-col gap-4'>
                                <PhoneNumberInput
                                    name='phone'
                                    label={`${i18n?.t('Phone Number')}`}
                                    required={true}
                                />
                                <FormInput
                                    name='email'
                                    label={'Email'}
                                    required={true}
                                    className='!mt-4'
                                    placeholder={"Enter Email"}
                                />
                            </div>
                            <FormPassword name='password' label={'Password'} required={true} placeholder={"Enter Password"} />
                            <FormPassword
                                name='confirm_password'
                                label={'Confirm Password'}
                                required={true}
                                confirm
                                placeholder={"Enter Confirm Password"}
                            />
                            <h3 className='mb-3 mt-4 font-semibold text-black text-opacity-[88%]'>
                                {i18n?.t('Include Subscription')}
                            </h3>
                        </>
                    )}
                    <FormSelect
                        name='subscription'
                        label={'Subscription'}
                        options={subscriptions?.docs?.map((sub) => ({
                            label: columnFormatter(sub?.name),
                            value: sub?._id,
                        }))}
                        placeholder={'Select Subscription'}
                    />
                    <FormSelect
                        name='subscriptionType'
                        label={'Subscription Type'}
                        options={[
                            { label: 'Yearly', value: 'yearly' },
                            { label: 'Monthly', value: 'monthly' },
                        ]}
                        placeholder={'Select Subscription Type'}
                    />
                    <FormSelect
                        name='paymentMethod'
                        label='Payment Method'
                        options={[
                            ...(payMethods?.docs?.map((method) => ({
                                label: method?.name,
                                value: method?.type,
                            })) || []),
                            { label: 'Cash', value: 'cash' },
                        ]}
                        placeholder={'Select Payment Method'}
                    />{' '}
                    <FormSelect
                        name='currency'
                        label={'Currency'}
                        options={currencies?.map((currency) => ({
                            label: currency?.name,
                            value: currency?.code,
                        }))}
                        placeholder={'Select Currency'}
                    />
                    <Button type='submit' className='mt-2.5 !h-fit !px-10 !py-2'>
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>
            <Modal
                open={isReset}
                onCancel={() => {
                    setIsReset(false);
                    resetForm.resetFields();
                }}
                footer={null}
                title={i18n?.t('Reset Your Password')}
            >
                <Form
                    form={resetForm}
                    onFinish={handleResetPassword}
                    layout='vertical'
                    className='space-y-4'
                >
                    <HiddenInput name='_id' />
                    <FormPassword
                        name='password'
                        label={i18n.t('New Password')}
                        placeholder={i18n.t('New Password')}
                        rules={[{ require: true, message: i18n.t('please enter password') }]}
                    />
                    <FormPassword label={i18n.t('Confirm New Password')} confirm={true} name='confirm_password' placeholder={i18n.t('Confirm Password')} />
                    <Button type='submit' loading={loading}>
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default UsersList;
