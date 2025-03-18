"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { userOrderDetails } from '../../../../../../helpers/backend';
import { useFetch } from '../../../../../../helpers/hooks';
import { getStatusClass } from '../../../../../../helpers/utils';
import { useCurrency } from '../../../../../../contexts/site';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '../../../../../../providers/i18n';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InfoRow = ({ label, value, customClass }) => (
  <tr>
    <td className="font-medium py-2 text-gray-700 text-sm md:text-base">{label}:</td>
    <td className={`py-2 break-all text-sm md:text-base ${customClass || ''}`}>{value}</td>
  </tr>
);

const OrderDetails = ({ params }) => {
  const [data, getDetails, { loading }] = useFetch(userOrderDetails, {}, false);
  const i18n = useI18n();
  const router = useRouter();
  const order = data;
  const formattedDate = dayjs(order?.createdAt).format('DD MMM YYYY');
  const { getCurrencySymbol } = useCurrency();
  const invoiceRef = useRef();

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(`Invoice_${order?.uid}.pdf`);
  };



  useEffect(() => {
    getDetails({ _id: params?.id });
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-lg p-4 md:p-8 rounded-lg">
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex justify-center" >
      <div className="w-full max-w-4xl bg-white">
        <div className="mb-4">
          <button
            className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded"
            onClick={() => router.back()}
          >
            {i18n?.t("Back")}
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4" ref={invoiceRef}>
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 uppercase">{i18n?.t("invoice")}</h1>
          <div className="text-sm text-gray-600 text-right mt-4 md:mt-0">
            <p>{i18n?.t("Invoice Date")}: {formattedDate}</p>
            <p>{i18n?.t("Order ID")}: {order?.uid}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div >
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{i18n?.t("Order Details")}</h2>
            <table className="table-auto w-full">
              <tbody>
                <InfoRow label={i18n?.t("Order ID")} value={order?.uid} />
                <InfoRow label={i18n?.t("Order Date")} value={formattedDate} />
                <InfoRow
                  label={i18n?.t("Order Status")}
                  value={<span className={getStatusClass(order?.status)}>{order?.status}</span>}
                />
              </tbody>
            </table>
          </div>

          <div >
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{i18n?.t("Payment Information")}</h2>
            <table className="table-auto w-full">
              <tbody>
                <InfoRow label={i18n?.t("Transaction ID")} value={order?.payment?.transaction_id} customClass="break-all" />
                <InfoRow label={i18n?.t("Payment Method")} value={order?.payment?.method} />
                <InfoRow
                  label={i18n?.t("Payment Status")}
                  value={<span className={getStatusClass(order?.payment?.status)}>{order?.payment?.status}</span>}
                />
                <InfoRow label={i18n?.t("Amount Paid")} value={`${getCurrencySymbol(order?.payment?.currency)}${order?.payment?.amount}`} />
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-4">{i18n?.t("Product Information")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-8 table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left py-2 px-2 md:px-4 text-sm md:text-base">{i18n?.t("Image")}</th>
                <th className="text-left py-2 px-2 md:px-4 text-sm md:text-base">{i18n?.t("Product")}</th>
                <th className="text-left py-2 px-2 md:px-4 text-sm md:text-base">{i18n?.t("Variant")}</th>
                <th className="text-center py-2 px-2 md:px-4 text-sm md:text-base">{i18n?.t("Quantity")}</th>
                <th className="text-right py-2 px-2 md:px-4 text-sm md:text-base">{i18n?.t("Total")}</th>
              </tr>
            </thead>
            <tbody>
              {
                data?.items &&
                data?.items.map((item, index) => (
                  <tr className="border-b">
                    <td className="py-2 px-2 md:px-4"><Image src={item?.thumbnail_image} width={50} height={50} className='h-[40px] w-[40px]' alt="Product Image" /></td>
                    <td className="py-2 px-2 md:px-4"><Link href={`/shop/${item?._id}`}>{item?.name?.en}</Link></td>
                    <td className="py-2 px-2 md:px-4">{item?.variant?.name?.en || 'No Variant'}</td>
                    <td className="py-2 px-2 md:px-4 text-center">{item?.quantity}</td>
                    <td className="py-2 px-2 md:px-4 text-right">{getCurrencySymbol(order?.currency)}{item?.total}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        <div  className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <div></div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">{i18n?.t("Summary")}</h3>
            <table className="table-auto w-full">
              <tbody>
                <InfoRow label={i18n?.t("Subtotal")} value={`${getCurrencySymbol(order?.currency)}${order?.subTotal}`} />
                <InfoRow label={i18n?.t("Discount")} value={`-${getCurrencySymbol(order?.currency)}${order?.subTotal - order?.payment?.amount}`} />
                <InfoRow label={i18n?.t("Grand Total")} value={`${getCurrencySymbol(order?.currency)}${order?.payment?.amount}`} customClass="font-bold text-lg" />
              </tbody>
            </table>
          </div>
        </div>
        <div className='w-full flex justify-end mt-10'>
          <button
            className="bg-primary hover:bg-primary/90 !w-fit text-white font-bold py-2 px-6 rounded"
            onClick={downloadInvoice}
          >
            {i18n?.t("Download Invoice")}
          </button>
        </div>
      </div>
      {/* invoice   */}
      
    </div>
  );
};

export default OrderDetails;
