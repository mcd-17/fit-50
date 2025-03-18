'use client';
import { useEffect } from 'react';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { orderDetails, updateOrderStatus } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter, getStatusClass } from '../../../../../helpers/utils';
import Image from 'next/image';
import { Table, Select, message } from 'antd';
import { useCurrency } from '../../../../../contexts/site';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import Button from '../../../../../../components/common/button';

const InfoRow = ({ label, value, className }) => (
  <div className={`flex gap-2 ${className || ''}`}>
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

const Page = ({ params }) => {
  const i18n = useI18n();
  const { currencySymbol, convertAmoutnWithCurrency, getCurrencySymbol } = useCurrency();
  const [data, getData, { loading }] = useFetch(orderDetails, {}, false);
  const history = useRouter();

  useEffect(() => {
    if (params?._id) {
      getData({ _id: params?._id });
    }
  }, [params?._id]);

  const handleStatusChange = async (newStatus) => {
    try {
      useAction(updateOrderStatus, { orderId: params?._id, status: newStatus }, () => getData());
    } catch (error) {
      message.error('Failed to update order status.');
    }
  };

  const columns = [
    {
      title: i18n?.t('Product Image'),
      dataIndex: 'thumbnail_image',
      key: 'thumbnail_image',
      render: (image) => (
        <Image
          src={image}
          alt="Product image"
          width={60}
          height={60}
          className="object-cover rounded-md"
        />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <span className="line-clamp-2">{columnFormatter(name)}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => columnFormatter(category),
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, record) => <div className='whitespace-pre'>{getCurrencySymbol(data?.payment?.currency)} {convertAmoutnWithCurrency(record?.variant?.price || record?.price, data?.payment?.currency)}</div>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (_, record) => <>{getCurrencySymbol(data?.payment?.currency)}{record?.total}</>,
    },
  ];

  const dataSource = data?.items?.map((item, index) => ({
    key: index,
    thumbnail_image: item?.thumbnail_image,
    name: item?.name,
    category: item?.category,
    price: item?.variant?.price || item?.price,
    quantity: item?.quantity,
    total: item?.total,
  }));

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-6xl mx-auto">
        <Button onClick={() => history.back()} className='mb-4 !py-2'>
          {i18n?.t('Back')}
        </Button>
        <div className="flex md:flex-row flex-col justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{i18n?.t('INVOICE')}</h1>
            <p className="text-sm text-gray-500">{i18n?.t('Order ID')}: {data?.uid}</p>
          </div>
          <div className="flex flex-col items-end">
            <Select
              value={data?.status || 'pending'}
              onChange={handleStatusChange}
              className="w-40 mb-2"
              options={[
                { label: i18n?.t('Pending'), value: 'pending' },
                { label: i18n?.t('Accepted'), value: 'accepted' },
                { label: i18n?.t('Completed'), value: 'completed' },
                { label: i18n?.t('Cancelled'), value: 'cancelled' },
              ]}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{i18n?.t('Customer Information')}</h2>
            <InfoRow label="Name" value={data?.user?.name} />
            <InfoRow label="Email" value={data?.user?.email} />
            <InfoRow label="Phone" value={data?.user?.phone} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{i18n?.t('Shipping Information')}</h2>
            <InfoRow label="Address" value={data?.location} />
            <InfoRow label="City" value={data?.city} />
            <InfoRow label="Postal Code" value={data?.zip_code} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{i18n?.t('Order Information')}</h2>
            <InfoRow label="Order Date" value={dayjs(data?.createdAt).format('DD MMM YYYY')} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">{i18n?.t('Payment Information')}</h2>
            <InfoRow label="Transaction ID" className="break-all break-words" value={data?.payment?.transaction_id} />
            <InfoRow label="Method" value={data?.payment?.method} />
            <InfoRow label="Status" value={<span className={getStatusClass(data?.payment?.status)}>{data?.payment?.status}</span>} />
            <InfoRow label="Amount" value={`${getCurrencySymbol(data?.payment?.currency)} ${(data?.payment?.amount)}`} />
          </div>
        </div>
        <div className="overflow-x-auto mb-6">
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            loading={loading}
            className="mb-4"
          />
        </div>
        <div className="flex justify-end mt-6">
          <h2 className="text-xl font-semibold text-gray-800">{i18n?.t('Total')}: {getCurrencySymbol(data?.payment?.currency)}{(data?.subTotal)}</h2>
        </div>
      </div>
    </div>
  );
};

export default Page;