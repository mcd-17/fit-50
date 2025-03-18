"use client";
import React, { useState } from 'react';
import dayjs from 'dayjs';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import { useFetch } from '../../../helpers/hooks';
import { fetchAttendanceAdmin, todayAttendanceAdmin } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import { getStatusClass } from '../../../helpers/utils';
import { Modal, Tabs } from 'antd';
import AttendanceTable from './attendanceTable';
import { useRouter } from 'next/navigation';

const page = () => {
    const i18n = useI18n();
    let { langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchAttendanceAdmin);
    const [todayData, getTodayData] = useFetch(todayAttendanceAdmin, { status: 'all' });
    const [selectedTab, setSelectedTab] = useState('all');
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState(null);
    const router = useRouter();

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: "Photo",
            dataField: "image",
            formatter: (_, d) => <TableImage url={d?.employee?.image ? d?.employee?.image : "/defaultimg.jpg"} />,
        },
        {
            text: "Employee Name",
            dataField: "name",
            formatter: (_, d) => d?.employee?.name,
        },
        {
            text: "Check In",
            dataField: "clockIn",
            formatter: (_, d) => d?.clockIn ? dayjs(d?.clockIn).format('hh:mm A') : "-",
        },
        {
            text: "Check Out",
            dataField: "clockOut",
            formatter: (_, d) => d?.clockOut ? dayjs(d?.clockOut).format('hh:mm A') : "-",
        },
        {
            text: "Total Hours",
            dataField: "totalHours",
            formatter: (_, d) => d?.totalHours ? d?.totalHours : "-",
        },
        {
            text: "Status",
            dataField: "status",
            formatter: (value) => <span className={value === "present" ? getStatusClass('active') : value === "late" ? getStatusClass('pending') : getStatusClass('rejected')}>{value === "present" ? "In Time" : value}</span>,
        }
    ];

    const items = [
        {
            key: 'all',
            label: 'All',
            children: <AttendanceTable data={todayData} />,
        },
        {
            key: 'present',
            label: 'In Time',
            children: <AttendanceTable data={todayData} />,
        },
        {
            key: 'late',
            label: 'Late',
            children: <AttendanceTable data={todayData} />,
        },
    ];

    return (
        <div>
            <PageTitle title="Attendance" />
            <div className='flex xl:flex-row flex-col-reverse xl:gap-6 gap-4'>
                <div className='2xl:w-8/12 xl:w-4/6 w-full'>
                    <Table
                        columns={columns}
                        data={data}
                        loading={loading}
                        onReload={getData}
                        indexed
                        pagination
                        langCode={langCode}
                        onView={(value) => { setDetails(value); setOpen(true) }}
                    />
                </div>
                <div className='2xl:w-4/12 xl:w-2/6 w-full bg-white p-4'>
                    <h3 className='text-lg font-semibold pb-3 pt-2 text-[#003049]'>{i18n?.t("Today's Attendance")} ({dayjs().format('MMM D, YYYY')})</h3>
                    <Tabs defaultActiveKey={selectedTab} items={items} onChange={(key) => getTodayData({ status: key })} />
                </div>
            </div>
            <Modal
                open={open}
                onCancel={() => { setOpen(false); setDetails(null) }}
                footer={null}
                width={600}
                title={`${i18n?.t("Attendance Details")} (${dayjs(details?.createdAt).format('MMM D, YYYY')})`}
                destroyOnClose
            >
                {details && (
                    <div className="p-4">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={details?.employee?.image || "/defaultimg.jpg"}
                                alt="Employee"
                                className="w-16 h-16 rounded-full border border-gray-300"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{details?.employee?.name}</h3>
                                <p className="text-gray-600">{details?.employee?.email}</p>
                                <p className="text-gray-600">{details?.employee?.phone}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 border rounded">
                                <span className="text-gray-500 text-sm">Check In</span>
                                <p className="text-lg font-medium">{dayjs(details?.clockIn).format("hh:mm A")}</p>
                            </div>
                            <div className="p-3 border rounded">
                                <span className="text-gray-500 text-sm">Check Out</span>
                                <p className="text-lg font-medium">{details?.clockOut ? dayjs(details?.clockOut).format("hh:mm A") : "-"}</p>
                            </div>
                            <div className="p-3 border rounded">
                                <span className="text-gray-500 text-sm">Total Hours</span>
                                <p className="text-lg font-medium">{details?.totalHours || "-"}</p>
                            </div>
                            <div className="p-3 border rounded">
                                <span className="text-gray-500 text-sm block">Status </span>
                                <p
                                    className={details?.status === "present" ? getStatusClass('active') : details?.status === "late" ? getStatusClass('pending') : getStatusClass('rejected')}
                                >
                                    {details?.status === "present" ? "In Time" : details?.status}
                                </p>
                            </div>
                        </div>
                        <button className="bg-primary text-white mt-4 px-3 py-1 rounded mx-auto" onClick={() => router.push(`/admin/attendance/${details?.employee?._id}`)}>More Details</button>
                    </div>
                )}

            </Modal>
        </div>
    );
}

export default page;