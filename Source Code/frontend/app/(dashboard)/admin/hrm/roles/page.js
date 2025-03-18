'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Form, Modal } from 'antd';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { deleteRole, fetchRoleList, postRole } from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { useRouter } from 'next/navigation';
import { FiPlus } from "react-icons/fi";

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchRoleList);
    const [open, setOpen] = useState(false);
    const { push } = useRouter();
    const columns = [
        {
            text: i18n.t('Created At'),
            dataField: 'createdAt',
            formatter: (_, d) => <>{dayjs(d?.createdAt).format('DD MMM YYYY')}</>,
        },
        {
            text: i18n.t('Name'),
            dataField: 'name',
        }
    ];
    const onFinish = async (values) => {
        const submitData = {
            ...values,
        };
        return useAction(postRole, submitData, () => {
            setOpen(false);
            getData();
        });
    };
    return (
        <div>
            <PageTitle title={i18n.t('Roles & Permissions')} />
            <Table
                indexed
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                        }}
                    >
                        {i18n.t('Add Role')}
                    </Button>
                }
                actions={(rowData) => {
                    return (
                        <button
                            className='btn btn-outline-success btn-sm rounded border border-blue-700 p-2 text-blue-700 hover:bg-blue-700 hover:text-white focus:shadow-none'
                            title='View'
                            onClick={() => {
                                push(`/admin/hrm/permission/${rowData?._id}`);
                            }}
                        >
                            <FiPlus />
                        </button>
                    );
                }}
                data={data}
                columns={columns}
                onReload={getData}
                loading={loading}
                onDelete={deleteRole}
                onEdit={(values) => {
                    setOpen(true);
                    if (values?._id) {
                        form.setFieldsValue({
                            ...values,
                            name: values?.name,
                        });
                    }
                }}
                pagination
            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title={i18n?.t('Add Role & Permission')}
            >
                <Form form={form} onFinish={onFinish} layout='vertical' className='space-y-4'>
                    <HiddenInput name="_id"/>
                    <FormInput
                        name='name'
                        placeholder={i18n.t('Enter Name')}
                        label={i18n.t('Name')}
                        rules={[{ require: true, message: i18n.t('please enter name') }]}
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
