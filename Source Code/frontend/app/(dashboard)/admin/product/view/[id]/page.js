"use client"
import { Image } from 'antd';
import React, { useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { singleProductAdmin } from "../../../../../helpers/backend";
import { useFetch } from '../../../../../helpers/hooks';
import { DetailTable } from '../../../../components/form/table';
import { columnFormatter, getStatusClass } from '../../../../../helpers/utils';
import { useI18n } from '../../../../../providers/i18n';
import { useCurrency } from '../../../../../contexts/site';

const page = ({ params }) => {
    const i18n = useI18n()
    let { langCode } = useI18n();
    const [data, getData] = useFetch(singleProductAdmin, {}, false)
    const {currencySymbol} = useCurrency()
    useEffect(() => {
        getData({ _id: params?.id })
    }, [params?.id])

    return (
        <div>
            <button className="ml-4 bg-primary px-3 py-1 flex items-center gap-1 text-white rounded w-fit"
                title="Back" onClick={() => window.history.back()}>
                <FaArrowLeft /> {i18n?.t("Back")}
            </button>
            <div className="mt-4 mb-4  p-4 grid md:grid-cols-2 gap-2">

                <DetailTable
                    title={i18n?.t("Product Information")}
                    columns={[
                        {
                            text: 'Status', dataIndex: 'is_active', formatter: (_, d) => <span
                                className={getStatusClass(d?.is_active ? "active" : "inactive")}
                            >
                                {d?.is_active ? `${i18n?.t('Active')}` : `${i18n?.t('Inactive')}`}
                            </span>
                        },
                        { text: 'Title', dataIndex: 'title', formatter: (_, d) => columnFormatter(d?.name)},
                        { text: 'Price', dataIndex: 'price', formatter: (_, d) => currencySymbol +" "+d?.price},
                        { text: 'Quantity', dataIndex: 'quantity' },
                        { text: 'Category', dataIndex: 'category', formatter: (_, d) => d?.category?.name[langCode] },
                        { text: 'Short Description', dataIndex: 'short_description', formatter: (_, d) => d?.short_description[langCode] },
                    ]}
                    data={data?.product} />
                <div className='bg-white p-4' >
                    <h3 className="text-lg font-semibold mb-2">{i18n?.t("Thumbnail Images")}</h3>
                    <Image src={data?.product?.thumbnail_image} alt={data?.name || "thumbnail"} className='!w-[120px] !h-[120px] object-fill' />
                    <h3 className="text-lg font-semibold my-2 mt-3">{i18n?.t("Gallery Images")}</h3>
                    <div className='flex gap-2 items-center flex-wrap'>
                        {
                            data?.product?.images?.map((d) => <Image src={d} alt={data?.product?.name || "thumbnail"} className='!w-[120px] !h-[120px] object-fill' />)
                        }
                    </div>
                </div>
            </div>
            <div className='mt-4 p-4 bg-white'>
                {
                    data?.product?.variants?.length > 0 ? (<>
                        <h3 className="text-lg font-semibold mb-2">{i18n?.t("Variants")}</h3>
                        <div className='overflow-x-auto '>
                            <table className='lg:w-1/2 w-full table-auto border-collapse'>
                                <thead>
                                    <tr className='bg-gray-200'>
                                        <th className='px-4 py-2 text-left'>{i18n?.t("Variant Name")}</th>
                                        <th className='px-4 py-2 text-left'>{i18n?.t("Price")}</th>
                                        <th className='px-4 py-2 text-left'>{i18n?.t("Status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.product?.variants?.map((variant, index) => (
                                        <tr key={index} className='border-b'>
                                            <td className='px-4 py-2'>
                                                {variant?.name[langCode]}
                                            </td>
                                            <td className='px-4 py-2'>
                                                ${variant?.price}
                                            </td>
                                            <td className='px-4 py-2'>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${variant?.in_stock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    {variant?.in_stock ? `${i18n?.t('In Stock')}` : `${i18n?.t('Out of Stock')}`}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </>) : (<div><h3 className="text-lg font-semibold my-2">{i18n?.t("No variants available")}</h3></div>)
                }
                <h3 className="text-lg font-semibold mb-2 mt-4">{i18n?.t("Product Details")}</h3>
                <div dangerouslySetInnerHTML={{ __html: columnFormatter(data?.product?.description) }} style={{ whiteSpace: 'pre-line' }} />
            </div>
        </div>
    );
};

export default page;