"use client"
import React from 'react';
import { Form, Switch } from 'antd';
import { useRouter } from 'next/navigation';
import PageTitle from '../../components/common/page-title';
import { columnFormatter } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';
import { allProductsAdmin, deleteProduct, publishProduct } from '../../../helpers/backend';
import { useAction, useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import Table, { TableImage } from '../../components/form/table';
import dayjs from 'dayjs';
import { useCurrency } from '../../../contexts/site';

const page = () => {
    const [form] = Form.useForm();
    const router = useRouter()
    const i18n = useI18n()
    let { langCode } = useI18n();
    const {currencySymbol} = useCurrency()
    const [data, getData, { loading }] = useFetch(allProductsAdmin);

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: i18n.t("Image"),
            dataField: "thumbnail_image",
            formatter: (_, d) => (
                <div className='flex gap-x-3 space-x-1'>
                    <TableImage url={d?.thumbnail_image} />
                </div>
            ),
        },
        {
            text: i18n.t("Name"),
            dataField: "name",
            formatter: (value) => {
                const formattedValue = columnFormatter(value);
                const truncatedText = formattedValue?.length > 60 
                    ? `${formattedValue.slice(0, 60)}...` 
                    : formattedValue;
                return <h2>{truncatedText}</h2>;
            },
        },
        {
            text: i18n.t("Price"),
            dataField: "price",
            formatter: (_, d) => <span>{currencySymbol}{d?.price}</span>,
        },
        {
            text: i18n.t("Quantity"),
            dataField: "quantity",
            formatter: (_, d) => <span>{d?.quantity}</span>,
        },
        {
            text: i18n.t("Published"),
            dataField: "image",
            formatter: (_, d) => (
                <Switch
                    checked={d?.is_active}
                    onChange={() => {
                        useAction(publishProduct, { productId: d?._id }, () => getData(),)
                    }}
                    checkedChildren={<span className="text-white">{i18n.t("Published")}</span>}
                    unCheckedChildren={<span className="text-white">{i18n.t("Unpublished")}</span>}
                />
            ),
        },
    ];

    return (
        <div>
            <PageTitle title="Product List" />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        onClick={() => {
                            router.push('/admin/product/add')
                            form.resetFields();
                        }}
                    >
                        {i18n.t("Add New")}
                    </Button>
                }
                onEdit={(values) => {
                    form.resetFields();
                    router.push(`/admin/product/edit/${values?._id}`)
                }}
                onView={(d) => {
                    router.push(`/admin/product/view/${d?._id}`)
                }}
                onDelete={deleteProduct}
                indexed
                pagination
                langCode={langCode}
            />
        </div>
    );
};

export default page;