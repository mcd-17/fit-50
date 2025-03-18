'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Form, Modal } from 'antd';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import {
    addUserEmployee,
    deleteEmployee,
    employeePasswordChange,
    fetchRoleList,
    fetchUserEmployee,
    updateUserEmployee,
} from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import { useAction, useFetch } from '../../../../helpers/hooks';
import PhoneNumberInput from '../../../../../components/form/phoneNumberInput';
import FormPassword from '../../../../../components/form/password';
import FormSelect from '../../../../../components/form/select';
const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchUserEmployee);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [employeId, setEmployeId] = useState('');
    const [role] = useFetch(fetchRoleList);

    const columns = [
        {
            text: i18n.t('Registered At'),
            dataField: 'createdAt',
            formatter: (_, d) => <>{dayjs(d?.createdAt).format('DD MMM YYYY')}</>,
        },
        {
            text: i18n.t('Name'),
            dataField: 'name',
        },
        {
            text: i18n.t('Email'),
            dataField: 'email',
        },
        {
            text: i18n.t('Phone'),
            dataField: 'phone',
        },
        {
            text: i18n.t('Role'),
            dataField: 'role',
            formatter: (_, d) => <>{d?.permission?.name}</>,
        },
        {
            text: i18n.t('Password'),
            dataField: 'password',
            formatter: (_, d) => (
                <>
                    {
                        <Button
                            className='!h-fit border-primary bg-primary !py-[3px] !text-xs text-white'
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
    const onFinish = async (values) => {
        const submitData = {
            ...values,
        };
        return useAction(
            values?._id?.length > 5 ? updateUserEmployee : addUserEmployee,
            submitData,
            () => {
                setOpen(false);
                setIsEdit(false);
                getData();
            },
            values?._id
                ? i18n.t('Employee updated successfully')
                : i18n.t('Employee added Successfully')
        );
    };
    const handleResetPassword = async (values) => {
        values._id = employeId;

        return useAction(
            employeePasswordChange,
            {
                ...values,
                new_password: values?.password,
                confirm_password: values?.confirm_password,
            },
            () => {
                setIsReset(false);
                getData();
                form.resetFields();
            },
            i18n.t('Password Changed Successfully')
        );
    };
    return (
        <div>
            <PageTitle title={i18n.t('Employee')} />
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
                        {i18n.t('Add Employee')}
                    </Button>
                }
                data={data}
                columns={columns}
                onReload={getData}
                loading={loading}
                onDelete={deleteEmployee}
                onEdit={(values) => {
                    setIsEdit(true);

                    setOpen(true);
                    if (values?._id) {
                        form.setFieldsValue({
                            ...values,
                            name: values?.name,
                            email: values?.email,
                            phone: values?.phone,
                            permission: values?.permission?._id,
                            _id: values?._id,
                            image: values?.image,
                        });
                    }
                }}
                pagination
            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title={i18n?.t('Employee Details')}
            >
                <Form form={form} onFinish={onFinish} layout='vertical' className='space-y-4'>
                    <HiddenInput name='_id' />
                    <FormInput
                        placeholder={i18n.t('Enter Name')}
                        name='name'
                        label={i18n.t('Name')}
                        rules={[{ require: true, message: i18n.t('please enter name') }]}
                    />
                    <FormInput
                        placeholder={i18n.t('Enter Email')}
                        type='email'
                        name='email'
                        label={i18n.t('Email')}
                        rules={[{ require: true, message: i18n.t('please enter email') }]}
                    />
                    {!isEdit && (
                        <FormPassword
                            placeholder={i18n.t('Enter Password')}
                            name='password'
                            label={i18n.t('Password')}
                            type={'password'}
                            rules={[{ require: true, message: i18n.t('please enter password') }]}
                        />
                    )}
                    {!isEdit && (
                        <FormPassword
                            placeholder={i18n.t('Enter Confrim Password')}
                            name='confirm_password'
                            confirm
                            label={i18n.t('Confrim Password')}
                            rules={[
                                { require: true, message: i18n.t('please enter confrim password') },
                            ]}
                        />
                    )}
                    <PhoneNumberInput
                        placeholder={i18n.t('Enter Phone')}
                        name='phone'
                        label={i18n.t('Phone')}
                        rules={[{ require: true, message: i18n.t('please enter number') }]}
                    />

                    <FormSelect
                        placeholder={i18n.t('Select Role')}
                        required
                        name='permission'
                        label={i18n.t('Role')}
                        options={role?.docs?.map((d) => ({
                            label: d.name,
                            value: d._id,
                        }))}
                    />

                    <Button type='submit' loading={loading}>
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>

            <Modal
                open={isReset}
                onCancel={() => {
                    setIsReset(false);
                    form.resetFields();
                }}
                footer={null}
                title={i18n?.t('Reset Password')}
            >
                <Form onFinish={handleResetPassword} layout='vertical' className='space-y-4'>
                    <HiddenInput name='_id' />
                    <FormPassword
                        placeholder={i18n.t('Enter Password')}
                        name='password'
                        label={i18n.t('New Password')}
                        type={'password'}
                    />
                    <FormPassword
                        placeholder={i18n.t('Enter Confirm Password')}
                        name='confirm_password'
                        label={i18n.t('Confirm Password')}
                        className='mb-4'
                        confirm={true}
                    />
                    <Button type='submit' loading={loading}>
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};
export default Page;
