import React, { use, useState } from 'react';
import PageTitle from '../../../../components/common/page-title';
import dayjs from 'dayjs';
import { delMarketingMail } from '../../../../../helpers/backend';
import Table from '../../../../components/form/table';
import { FaCheck } from 'react-icons/fa';
import { IoCloseSharp } from "react-icons/io5";
import { getStatusClass } from '../../../../../helpers/utils';
import EmailDetails from './emailDetails';

const CommonMail = ({data,getData,title,isScheduled=false}) => {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState(null);
    const columns = [
        {
            text: isScheduled? 'Scheduled Time':'Send Time',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(isScheduled ? d?.scheduled_date : d?.scheduled_date?d?.scheduled_date:d?.createdAt).format('MMM D, YYYY h:mm A')}</div>,
        },
        {
            text: "Subject",
            dataField: "subject",
            formatter: (value) => <span>{value?.length > 15 ? value?.substring(0, 15) + "..." : value}</span>,
        },
        {
            text: "Content",
            dataField: "content",
            formatter: (value) => <span dangerouslySetInnerHTML={{ __html: value?.length > 30 ? value?.substring(0, 30) + "..." : value }}></span>,
        },
        {
            text: "To Individual",
            dataField: "individual_mail",
            formatter: (value) => value,
        },
        {
            text: "To Group",
            dataField: "name",
            formatter: (_, d) => <span>{d?.group ? <span>{
                d?.group?.name?.length > 10 ?
                    d?.group?.name?.substring(0, 10)
                    + "..." : d?.group?.name
            }</span>
                : <IoCloseSharp size={22} className='font-bold text-red-500' />
            }</span>,
        },
        {
            text: "To User",
            dataField: "user",
            formatter: (value) => <span>{value === true ? <FaCheck className='text-green-500' />
                : <IoCloseSharp size={22} className='font-bold text-red-500' />
            }</span>,
        },
        {
            text: "To Trainer",
            dataField: "trainer",
            formatter: (value) => <span>{value === true ? <FaCheck className='text-green-500' />
                : <IoCloseSharp size={22} className='font-bold text-red-500' />
            }</span>,
        },
        {
            text: "To Employee",
            dataField: "employee",
            formatter: (value) => <span>{value === true ? <FaCheck className='text-green-500' />
                : <IoCloseSharp size={22} className='font-bold text-red-500' />
            }</span>,
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (_, d) => <span className={`capitalize ${getStatusClass(d?.status == "success" ? "active" : d?.status)}`}>{d?.status}</span>,
        },
    ];

    return (
        <div>
            <div className='px-4 pt-5 pb-1 bg-white rounded-sm
            '>
                <PageTitle title={title} />
            </div>
            <div className='mt-4'>
                <Table
                    shadow={false}
                    data={data}
                    columns={columns}
                    pagination
                    indexed={true}
                    onDelete={delMarketingMail}
                    onReload={getData}
                    onView={(data) => {
                        setOpen(true);
                        setDetails(data);
                    }}
                />
            </div>
           {/* Email details  */}
           <EmailDetails open={open} setOpen={setOpen} details={details} />
        </div>
    );
};

export default CommonMail;
0