"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFetch } from '../../../helpers/hooks';
import { delPaymentMethod, fetchPaymentMethods } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';

const PaymentMethods = () => {
    const { push } = useRouter()
    const i18n = useI18n()
    const [paymentMethod, getPaymentMethod, { loading }] = useFetch(fetchPaymentMethods)
    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        { text: 'Name', dataField: 'name' },
        { text: 'Type', dataField: 'type', formatter: (_, d) => <span className="capitalize">{d?.type}</span> }
    ]
    return (
        <div>
            <PageTitle title='Payment Method List' />
            <Table
                columns={columns}
                data={paymentMethod}
                action={(
                    <Button onClick={() => push('/admin/payment-method/add')} >{i18n?.t("Add Payment Method")}</Button>
                )}
                onEdit={({ _id }) => push('/admin/payment-method/edit/' + _id)}
                onDelete={delPaymentMethod}
                onReload={getPaymentMethod}
                loading={loading}
                pagination
                indexed
            />
        </div>
    );
};

export default PaymentMethods;