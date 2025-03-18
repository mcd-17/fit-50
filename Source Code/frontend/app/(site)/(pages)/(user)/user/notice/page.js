'use client';

import { Modal } from 'antd';
import { useRouter } from 'next/navigation';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useFetch } from '../../../../../helpers/hooks';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter } from '../../../../../helpers/utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import { fetchUserNoticeList } from '../../../../../helpers/backend';
import Image from 'next/image';

const Page = () => {
    const [data, getData] = useFetch(fetchUserNoticeList, {});
    const [edit, setEdit] = useState(false);
    const i18n = useI18n();
    const [noticeContent, setNoticeContent] = useState({});
    const columns = [
        {
            text: i18n?.t('Date'),
            dataField: 'createdAt',
            formatter: (_, d) => <span>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</span>,
        },

        {
            text: i18n?.t('Group'),
            dataField: 'group',
            formatter: (_, d) => (
                <span>
                    {d?.group ? (
                        columnFormatter(d?.group?.name)
                    ) : (
                        <span className='text-red-500'> {i18n?.t('N/A')}</span>
                    )}
                </span>
            ),
        },
        {
            text: i18n?.t('Name'),
            dataField: 'name',
            formatter: (_, d) => (
                <span>
                    {d?.user?.name || <span className='text-red-500'> {i18n?.t('N/A')}</span>}
                </span>
            ),
        },
        {
            text: i18n?.t('Email'),
            dataField: 'email',
            formatter: (_, d) => (
                <span>
                    {d?.user?.email || <span className='text-red-500'> {i18n?.t('N/A')}</span>}
                </span>
            ),
        },
        {
            text: i18n?.t('Title'),
            dataField: 'title',
            formatter: (_, d) => (
                <span>{d?.title || <span className='text-red-500'> {i18n?.t('N/A')}</span>}</span>
            ),
        },
    ];

    return (
        <div>
            <h1 className='profileHeading'>{i18n?.t('Notice List')}</h1>
            <hr className='mb-4' />
            <TrainerTable
                data={data}
                columns={columns}
                onReload={getData}
                onView={(data) => {
                    setEdit(true);
                    setNoticeContent(data);
                }}
                noHeader
                pagination
            />
            <Modal
    open={edit}
    onCancel={() => setEdit(false)}
    footer={null}
    centered
>
    <div className="notification">
        <div className="modal flex flex-col items-center p-5 bg-white">
            <div className="modal-icon mb-4">
                <Image width={50} height={50} src="/bell.gif" alt="Notification Bell" />
            </div>
            <h2 className="mt-4 text-center font-poppins text-2xl font-semibold text-gray-800 capitalize">
                {noticeContent?.title}
            </h2>
            <p className="my-4 text-center font-poppins text-base text-gray-600 leading-relaxed capitalize">
                {noticeContent?.content}
            </p>
            <button
                onClick={() => setEdit(false)}
                className="mt-5 cursor-pointer hover:scale-105 rounded-md bg-primary px-6 py-3 text-white font-semibold transition-transform duration-300 ease-in-out shadow-md hover:shadow-lg"
            >
                {i18n?.t('Okay!')}
            </button>
        </div>
    </div>
</Modal>

        </div>
    );
};

export default Page;
