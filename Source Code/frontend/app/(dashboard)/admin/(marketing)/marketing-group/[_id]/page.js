"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/common/page-title';
import { useActionConfirm, useFetch } from '../../../../../helpers/hooks';
import { addOrRemoveMarketingGroupUser, fetchMarketingGroupUserList, fetchUsers } from '../../../../../helpers/backend';
import Table from '../../../../components/form/table';
import Button from '../../../../../../components/common/button';
import { MdDelete } from "react-icons/md";
import { Form, Modal } from 'antd';
import FormSelect from '../../../../components/form/select';

const page = () => {
    const params = useParams()
    const [data, getData] = useFetch(fetchMarketingGroupUserList, {}, false)
    const [user, getUser, { loading }] = useFetch(fetchUsers);
    const [open, setOpen] = useState(false)
    useEffect(() => {
        getData({ groupId: params?._id })
    }, [params?._id])
    const columns = [
        {
            text: 'Name',
            dataField: 'name',
            formatter: (_, d) => d?.name,
        },
        {
            text: 'Email',
            dataField: 'email',
            formatter: (_, d) => d?.email,
        },
        {
            text: 'Phone',
            dataField: 'phone',
            formatter: (_, d) => d?.phone,
        },
        {
            text: 'Action',
            dataField: 'phone',
            formatter: (_, d) => <Button
                onClick={() => {
                    useActionConfirm(addOrRemoveMarketingGroupUser, { _id: params?._id, userId: d?._id, delete: true }, getData, 'Are you sure you want to remove this user?', 'Yes, Remove')
                }}
                className='!h-fit !p-1'><MdDelete />
            </Button>,
        },
    ];
    const columns2 = [
        { text: 'Name', dataField: 'name' },
        { text: 'Phone', dataField: 'phone' },
        { text: 'Email', dataField: 'email' },
        { text: 'Role', dataField: 'role' }
        ,
        {
            text: 'Action',
            dataField: 'phone',
            formatter: (_, d) => {
                return (
                    <Button
                        onClick={() => {
                            useActionConfirm(addOrRemoveMarketingGroupUser, { _id: params?._id, userId: d?._id }, getData, 'Are you sure you want to add this user?', 'Yes, Add');
                        }}
                        className={`!h-fit !p-1`}
                    >
                        {'Add To Group'}
                    </Button>
                );
            },
        },
        
    ];
    return (
        <div>
            <PageTitle title={data?.name} />
            <Table
                onReload={getData}
                data={data?.groups}
                columns={columns}
                noActions={true}
                action={<Button
                    className='!h-fit !py-[6px]'
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    {('Add Member')}
                </Button>}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={false}
                title="Add Member"
                width={1000}
            >
                <Table
                    columns={columns2}
                    data={user}
                    onReload={getUser}
                    indexed
                    pagination
                    noActions={true}
                />

            </Modal>
        </div>
    );
};

export default page;