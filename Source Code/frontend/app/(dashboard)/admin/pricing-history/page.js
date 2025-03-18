'use client';
import { subscriptionHistory } from '../../../helpers/backend';
import { useFetch } from '../../../helpers/hooks';
import PageTitle from '../../components/common/page-title';
import { columnFormatter, getStatusClass } from '../../../helpers/utils';
import dayjs from 'dayjs';
import Table from '../../components/form/table';
import { useState } from 'react';
import SubscriptionModal from './subscriptionDetails';
import { useCurrency } from '../../../contexts/site';

const Page = () => {
    const [data, getData, { loading }] = useFetch(subscriptionHistory);
    const {currencySymbol} = useCurrency()
    const [details, setDetails] = useState(null)
    const [isVisible, setIsvisible] = useState(false);
    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: 'Subscriber',
            dataField: 'user',
            formatter: (_, d) => (
                <span className='line-clamp-2 text-wrap'>{d?.user?.name ?d?.user?.name?.slice(0, 15):"Deleted Account"}</span>
            ),
        },
        {
            text: 'subscription name',
            dataField: 'user',
            formatter: (_, d) => (
                <span className='line-clamp-2 text-wrap'>{d?.subscription?.name ? columnFormatter(d?.subscription?.name)?.slice(0, 15):"Deleted Subscription"}</span>
            ),
        },
        {
            text: 'Price',
            dataField: 'price',
            formatter: (_, d) => (
                <span className='text-wrap capitalize'>{currencySymbol}{d?.price}</span>
            ),
        },
        {
            text: 'Start Date',
            dataField: 'start_date',
            formatter: (_, d) => (
                <span className='line-clamp-2 text-wrap'>{dayjs(d?.start_date).format('DD-MM-YYYY')}</span>
            ),
        },
        {
            text: 'End Date',
            dataField: 'end_date',
            formatter: (_, d) => (
                <span className='line-clamp-2 text-wrap'>{dayjs(d?.end_date).format('DD-MM-YYYY')}</span>
            ),
        },
        
        {
            text: 'Payment Status',
            dataField: 'role',
            formatter: (_, d) => (
                <span className={getStatusClass(d?.payment?.status == "paid" ? "active" : "pending")}>{d?.payment?.status}</span>
            ),
        },
        {
            text: 'Status',
            dataField: 'active',
            formatter: (_, d) => (
                <span className={getStatusClass(d?.active ? "active" : "cancelled")}>{d?.active ? 'Active' : 'Inactive'}</span>
            ),
        },
        // {
        //     text: 'active',
        //     dataField: 'active',
        //     formatter: (_, d) => (
        //         <Switch
        //             checkedChildren={i18n?.t('Active')}
        //             unCheckedChildren={i18n?.t('Inactive')}
        //             checked={d?.active}
        //             onChange={async (e) => {
        //                 await useActionConfirm(postAdminTestimonial, { _id: d._id, active: e });
        //                 getData();
        //             }}
        //             className='bg-gray-500'
        //         />
        //     ),
        // },
    ];

    return (
        <div>
            <PageTitle title={'Member Subscription History'} />
            <Table 
            data={data}
            columns={columns}
            loading={loading}
            pagination
            indexed
            onReload={getData}
            onView={(d) => {setDetails(d);setIsvisible(true)}}
            />
            {
                details && (
                    <>
                    <SubscriptionModal subscriptionData={details} onClose={() => {
                        setDetails(null)
                        setIsvisible(false)
                    }} isVisible={isVisible}/>
                    </>
                )
            }
        </div>
    );
};

export default Page;
