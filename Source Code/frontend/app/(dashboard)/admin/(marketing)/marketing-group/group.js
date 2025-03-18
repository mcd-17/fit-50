import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Table from '../../../components/form/table';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';
import { Form, Modal, Switch } from 'antd';
import FormSelect from '../../../../../components/form/select';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { delMarketingGroup, fetchGroups, postMarketingGroup } from '../../../../helpers/backend';
import { noSelected } from '../../../../helpers/utils';
import { useRouter } from 'next/navigation';

const Group = ({ data, getData, loading }) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const { langCode, i18n } = useI18n();
    const [editingFeature, setEditingFeature] = useState(null);
    const [groups, getGroups] = useFetch(fetchGroups);
    const router = useRouter()

    useEffect(() => {
        if (!open) {
            form.resetFields();
        }
    }, [open]);

    const handleSubmit = async (values) => {
        const submitData = {
            _id: editingFeature ? editingFeature._id : undefined,
            type: 'email',
            name: values?.name,
            status: values?.status,
        };
        const action = editingFeature ? postMarketingGroup : postMarketingGroup;
        try {
            await useAction(action, submitData, () => {
                setOpen(false);
                getData();
            });
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: 'Name',
            dataField: 'name',
            formatter: (_, d) => d?.name,
        },
        {
            text: 'Contact',
            dataField: 'contact',
            formatter: (_, d) => <Button onClick={()=>{
                router.push(`/admin/marketing-group/${d?._id}`)
            }} className='!py-1 !text-medium !text-base'>Manage Contact</Button>,
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
                        await useAction(postMarketingGroup, { _id: d._id, status: e }, () => getData());
                    }}
                    className='bg-gray-500'
                />
            ),
        },
    ];

    return (
        <div>
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
                        <span>{('Add New')}</span>
                    </Button>
                }
                onEdit={(data) => {
                    setEditingFeature(data);
                    form.setFieldsValue({
                        name: data?.name,
                        groups: data?.groups,
                        status: data?.status,
                    });
                    setOpen(true);
                }}
                indexed
                pagination
                onDelete={delMarketingGroup}
                langCode={langCode}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={editingFeature ? ('Edit Marketing Group') : ('Add Marketing Group')}
                footer={null}
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleSubmit}
                    className='mt-5'
                >
                    {editingFeature && <HiddenInput name="_id" />}
                    <div>
                        <FormInput
                            placeholder={('Enter Name')}
                            name="name"
                            label={i18n?.('Name')}
                            required={true}
                        />
                        <Form.Item name="status" label={i18n?.t('Status')} valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>
                    <Button
                        type='submit'
                        onClick={() => noSelected({ form })}
                        className='mt-2.5'
                    >
                        {('Submit')}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Group;
