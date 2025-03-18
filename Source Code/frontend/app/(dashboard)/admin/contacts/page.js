"use client"
import React from 'react'
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { FaEye, FaReplyAll } from "react-icons/fa";
import { useFetch } from "../../../helpers/hooks";
import { delContact, fetchContact } from "../../../helpers/backend";
import Table from "../../components/form/table";
import PageTitle from "../../components/common/page-title";
import dayjs from 'dayjs';

const Page = () => {
    const router = useRouter()
    const [contact, getContact, { loading, error }] = useFetch(fetchContact)

    const editHandleAction = (_id) => {
        router.push(`/admin/contacts/${_id}`)
    }
    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            dataField: 'name',
            text: 'Name',
            formatter: (name) => <span className='capitalize'>{name}</span>,
        },
        {
            dataField: 'email',
            text: "Email",
            formatter: (email) => <span className=''>{email}</span>,
        },
        {
            dataField: 'subject',
            text: 'Subject',
            formatter: (subject) => <span className=''>{
                <Tooltip title={subject?.length > 20 ? subject : ''}>
                    <span>
                        {subject?.length > 20 ? subject?.slice(0, 20) + '...' : subject}
                    </span>
                </Tooltip>
            }</span>,
        },
        {
            dataField: '_id', text: 'Reply Message', formatter: (_id, data) => (
                data?.status === false ?
                    <span className='inline-block bg-[#2C9FAF] p-[4px] rounded-[3px] text-white cursor-pointer' onClick={() => editHandleAction(_id)} title="Reply the email"><FaReplyAll /></span>
                    :
                    <span className='inline-block bg-green-700 p-[4px] rounded-[3px] text-white cursor-pointer' onClick={() => editHandleAction(_id)} title="View Details"><FaEye /></span>
            )
        }
    ]

    return (
        <>
            <PageTitle title={'Contact List'} />
            <Table
                columns={columns}
                data={contact}
                pagination={true}
                noActions={false}
                indexed={true}
                shadow={false}
                onDelete={delContact}
                onReload={getContact}
                error={error}
                loading={loading}
            />
        </>
    )
}

export default Page