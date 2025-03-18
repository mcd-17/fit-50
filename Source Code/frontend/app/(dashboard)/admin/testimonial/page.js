'use client';
import { useState } from 'react';
import { Rate, Switch } from 'antd';
import { delAdminTestimonial, detailsTestimonial, fetchAdminTestimonial, postAdminTestimonial } from '../../../helpers/backend';
import { useActionConfirm, useFetch } from '../../../helpers/hooks';
import Table from '../../components/form/table';
import { useI18n } from '../../../providers/i18n';
import TestimonialModal from './testimonialDetails';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';

const Page = () => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchAdminTestimonial);
    const [details, getDetails] = useFetch(detailsTestimonial, {}, false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: 'Description',
            dataField: 'description',
            formatter: (_, d) => (
                <span className='line-clamp-2 w-[150px] text-wrap sm:w-[250px]'>{_}</span>
            ),
        },
        {
            text: 'rating',
            dataField: 'rating',
            formatter: (_, d) => (
                <Rate className='!text-primary' disabled defaultValue={d?.rating} />
            ),
        },
        {
            text: 'active',
            dataField: 'active',
            formatter: (_, d) => (
                <Switch
                    checkedChildren={i18n?.t('Active')}
                    unCheckedChildren={i18n?.t('Inactive')}
                    checked={d?.active}
                    onChange={async (e) => {
                        await useActionConfirm(postAdminTestimonial, { _id: d._id, active: e });
                        getData();
                    }}
                    className='bg-gray-500'
                />
            ),
        },
    ];

    return (
        <div>
            <PageTitle title={'Testimonial List'} />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                indexed
                pagination
                onDelete={delAdminTestimonial}
                onView={(data) => {
                    getDetails({ _id: data._id })
                    openModal()
                }}
            />
            {
                details && (
                    <TestimonialModal
                        visible={isModalVisible}
                        onClose={closeModal}
                        testimonial={details}
                    />
                )
            }

        </div>
    );
};

export default Page;
