"use client";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { message, Select } from "antd";
import { fetchOrders, updateOrderStatus } from "../../../helpers/backend";
import { useAction, useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import Table from "../../components/form/table";
import { getStatusClass } from "../../../helpers/utils";
import { useCurrency } from "../../../contexts/site";
import PageTitle from "../../components/common/page-title";

const Page = () => {
    const router = useRouter();
    const i18n = useI18n()
    let { langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchOrders);
    const { currencySymbol, convertAmount,getCurrencySymbol } = useCurrency();

    const handleStatusChange = async (newStatus, id) => {
        try {
            useAction(updateOrderStatus, { orderId: id, status: newStatus }, () => getData());
        } catch (error) {
            message.error('Failed to update order status.');
        }
    };

    let AllStatus = [
        { label: i18n?.t('Pending'), value: 'pending' },
        { label: i18n?.t('Accepted'), value: 'accepted' },
        { label: i18n?.t('Completed'), value: 'completed' },
        { label: i18n?.t('Cancelled'), value: 'cancelled' },
    ]
    const columns = [
        {
            text: ("Order Id"),
            dataField: "name",
            formatter: (_, d) => <>{d?.uid}</>,
        },
        {
            text: ("Order Date"),
            dataField: "createdAt",
            formatter: (_, d) => <>{dayjs(d?.createdAt).format("DD MMM YYYY")}</>,
        },
        {
            text: i18n.t("Name"),
            dataField: "name",
            formatter: (_, d) => <span>{d?.user?.name}</span>,
        },
        {
            text: ("Payment Method"),
            dataField: "name",
            formatter: (_, d) => <p className='capitalize'>{d?.payment?.method}</p>,
        },
        
        {
            text: i18n.t("Payment Status"),
            dataField: "payment",
            formatter: (_, d) => <span className={getStatusClass(d?.payment?.status)}>{d?.payment?.status}</span>,
        },
        {
            text: i18n.t("Order Status"),
            dataField: "status",
            formatter: (_, d) => (
                <Select
                    value={d?.status || "pending"}
                    onChange={(newStatus) => {
                        handleStatusChange(newStatus, d?._id)
                    }}
                    className="w-40"
                    options={
                        d?.status === "pending"
                            ? [{ label: i18n.t("Cancelled"), value: "cancelled" }]
                            : AllStatus.map((item) => ({
                                label: item.label,
                                value: item.value,
                            }))
                    }
                />
            ),
        },
        {
            text: 'Total',
            dataField: "subTotal",
            formatter: (_, d) => <span>{getCurrencySymbol(d?.payment?.currency)}{d?.subTotal || 0}</span>,
        },

    ];


    let action = (
        <div className='flex gap-2'>
            <div>
                <Select
                    allowClear
                    placeholder={i18n?.t("Filter Status")}
                    style={{ minWidth: 150 }}
                    onClear={() => getData({ status: undefined })}
                    onChange={value => getData({ status: value })}>
                    <Select.Option value={undefined}>{i18n?.t("All")}</Select.Option>
                    <Select.Option value={'accepted'}>{i18n?.t("Accepted")}</Select.Option>
                    <Select.Option value={'cancelled'}>{i18n?.t("Cancelled")}</Select.Option>
                    <Select.Option value={'completed'}>{i18n?.t("Completed")}</Select.Option>
                </Select>
            </div>
        </div>
    )

    return (
        <>
            <PageTitle title={'Orders List'} />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                onView={(d) => {
                    router.push(`/admin/order/view/${d?._id}`)
                }}
                indexed
                pagination
                langCode={langCode}
                action={action}
            />
        </>
    )
}

export default Page
