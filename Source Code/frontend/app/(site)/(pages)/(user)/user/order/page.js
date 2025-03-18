"use client";
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Select } from 'antd';
import { getStatusClass } from '../../../../../helpers/utils';
import { useI18n } from '../../../../../providers/i18n';
import { useCurrency } from '../../../../../contexts/site';
import { useFetch } from '../../../../../helpers/hooks';
import { orderList } from '../../../../../helpers/backend';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useRouter } from 'next/navigation';

const OrderPage = () => {
    const i18n= useI18n();
    const { langCode } = useI18n();
    const {getCurrencySymbol } = useCurrency();
    const [filter] = useState('all');
    const [data, getData, { loading }] = useFetch(orderList);
    const router = useRouter();

    useEffect(() => {
        getData({ status: filter === 'all' ? '' : filter });
    }, [filter]);

    const columns = [
        {
            text: i18n.t("Order Id") || "Order Id",
            dataField: "name",
            formatter: (_, d) => <>{d?.uid}</>,
        },
        {
            text: i18n?.t("Date") || "Date",
            dataField: "name",
            formatter: (_, d) => <p>{dayjs(d?.createdAt).format("DD MMM YYYY")}</p>,
        },
        {
            text: i18n?.t("Payment Method")|| "Payment Method",
            dataField: "name",
            formatter: (_, d) => <p className='capitalize'>{d?.payment?.method}</p>,
        },
        {
            text: i18n?.t("Payment Status") || "Payment Status",
            dataField: "payment.status",
            formatter: (_, d) => <p className={getStatusClass(d?.payment?.status)}>{d?.payment?.status}</p>,
        },
        {
            text: i18n?.t("Order Status") || "Order Status",
            dataField: "status",
            formatter: (_, d) => <span className={getStatusClass(d?.status)}>{d?.status}</span>,
        },
        {
            text: i18n?.t("Total") || "Total",
            dataField: "name",
            formatter: (_, d) => <p>{getCurrencySymbol(d?.payment?.currency)}{d?.subTotal}</p>,
        },
    ];

    const handleView = (values) => {
        router.push(`/user/order/${values?._id}`);
    };

    return (
        <>
            <div className="px-4 py-8 overflow-x-auto">
                <div>
                    <div className='flex gap-2 justify-between items-center mb-4'>
                        <h1 className='profileHeading'>{i18n?.t("Order History")}</h1>
                        <div>
                            <Select
                                allowClear
                                placeholder={i18n?.t("Filter Status") || "Status"}
                                style={{ minWidth: 150 }}
                                onClear={() => getData({ status: undefined })}
                                onChange={value => getData({ status: value })}>
                                <Select.Option value={undefined}>{i18n?.t("All") || "All"}</Select.Option>
                                <Select.Option value={'pending'}>{i18n?.t("Pending") || "Pending"}</Select.Option>
                                <Select.Option value={'accepted'}>{i18n?.t("Accepted") || "Accepted" }</Select.Option>
                                <Select.Option value={'cancel'}>{i18n?.t("Cancel") || "Cancel"}</Select.Option>
                                <Select.Option value={'completed'}>{i18n?.t("Completed") || "Completed"}</Select.Option>
                            </Select>
                        </div>
                    </div>
                    <hr className='mb-4 ' />
                    <TrainerTable
                        columns={columns}
                        data={data}
                        loading={loading}
                        onReload={getData}
                        onView={handleView}
                        indexed
                        pagination
                        langCode={langCode}
                        noHeader={true}
                    />
                </div>
            </div>
        </>
    );
};

export default OrderPage;
