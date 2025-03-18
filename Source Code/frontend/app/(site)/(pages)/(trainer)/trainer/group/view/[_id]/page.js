'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useFetch } from '../../../../../../../helpers/hooks';
import { useI18n } from '../../../../../../../providers/i18n';
import dayjs from 'dayjs';
import { fetchMemberDetails } from '../../../../../../../helpers/backend';
import { Empty } from 'antd';
import { useCurrency } from '../../../../../../../contexts/site';
import Button from '../../../../../../../../components/common/button';
import { useRouter } from 'next/navigation';
import { getStatusClass } from '../../../../../../../helpers/utils';

const page = ({ params }) => {
    const [data, getData] = useFetch(fetchMemberDetails, {}, false)
    const { push } = useRouter()
    const router = useRouter();
    const i18n = useI18n();
    const { currencySymbol } = useCurrency()

    useEffect(() => {
        if (params?._id) {
            getData({ _id: params?._id })
        }
    }, [params?._id])

   
    return (
        <div className='font-poppins'>
            <div className='flex justify-between'>
                <h3 className='profileHeading' >{i18n?.t("Member profile")}</h3>
                <Button onClick={() => router.back()} className='!h-fit !py-1'>{i18n?.t("Back")}</Button>
            </div>
            <hr />

            {
                data?.member?._id ? <>
                    <div className='flex justify-center mt-5'>
                        <Image
                            src={data?.member?.image ? data?.member?.image : "/defaultimg.jpg"}
                            width={120}
                            height={120}
                            alt='profile image'
                            className='w-[120px] h-[120px] rounded-full shadow-md border'
                        />
                    </div>
                    <div className='mt-6 grid 2xl:grid-cols-2 grid-cols-1 gap-8'>
                        <div className='shadow-lg border p-6 w-full flex gap-6 sm:flex-row flex-col bg-white rounded-lg'>
                            <div className='w-full'>
                                {[
                                    { label: i18n?.t("Name"), value: data?.member.name, icon: '👤' },
                                    { label: i18n?.t("Email"), value: data?.member.email, icon: '✉️' },
                                    { label: i18n?.t("Address"), value: data?.member.address, icon: '🏠' },
                                    { label: i18n?.t("Phone"), value: data?.member.phone, icon: '📞' },
                                    { label: i18n?.t("Member ID"), value: data?.member.uid, icon: '🆔' },
                                    { label: i18n?.t("Date of Birth"), value: dayjs(data?.member.dob).format('DD-MMM-YYYY'), icon: '🎂' },
                                    { label: i18n?.t("Gender"), value: data?.member.gender, icon: '⚧️' }
                                ].map((item, index) => (
                                    <div key={index} className={`flex justify-between items-center gap-4 pb-4 w-full ${index < 6 ? 'border-b border-gray-200' : ''}`}>
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className="text-gray-500">{item.icon}</span>
                                            <h3 className='text-sm text-gray-600 capitalize font-semibold'>{item.label}</h3>
                                        </div>
                                        <h3 className='text-sm text-gray-800 font-medium truncate mt-4'>{item.value ? item.value : "N/A"}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subscription Info Card */}
                        <div className='shadow-lg p-6 w-full bg-white border rounded-lg'>
                            <div className='w-full'>
                                {[
                                    { label: i18n?.t("Membership"), value: data?.subscription[0]?.subscription_type, icon: '🎫' },
                                    { label: i18n?.t("Price"), value: data?.subscription[0]?.price ? currencySymbol + data?.subscription[0]?.price : "N/A", icon: '💰' },
                                    { label: i18n?.t("Member ID"), value: data?.subscription[0]?.uid, icon: '🆔' },
                                    { label: i18n?.t("Start Date"), value: dayjs(data?.subscription[0]?.start_date).format('DD/MM/YYYY'), icon: '📅' },
                                    { label: i18n?.t("End Date"), value: dayjs(data?.subscription[0]?.end_date).format('DD/MM/YYYY'), icon: '📅' },
                                    { label: i18n?.t("Status"), value: data?.subscription[0]?.active === true ? "Active" : "Inactive", icon: '🔔' }
                                ].map((item, index) => (
                                    <div key={index} className={`flex justify-between items-center gap-4 pb-4 w-full ${index < 5 ? 'border-b border-gray-200' : ''}`}>
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className="text-gray-500">{item.icon}</span>
                                            <h3 className='text-sm text-gray-600 capitalize font-semibold'>{item.label}</h3>
                                        </div>
                                        <h3 className={`text-sm font-medium truncate mt-4 ${item.value === "Active" ? getStatusClass('active') : getStatusClass('inactive')}`}>
                                            {item.value ? item.value : "N/A"}
                                        </h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className='mt-10 w-full'>
                        <h1 className='md:text-2xl text-xl font-bold font-poppins capitalize pb-6'>{i18n?.t('Subscription History')}</h1>

                        <div className='overflow-x-auto'>
                            {/* Table Header */}
                            <div className='min-w-[700px] w-full grid grid-cols-5 gap-4 py-4 border-b bg-gray-50 items-center text-sm font-semibold font-poppins capitalize text-gray-700  px-5'>
                                <div>{i18n?.t('Title')}</div>
                                <div>{i18n?.t('Price')}</div>
                                <div>{i18n?.t('Status')}</div>
                                <div>{i18n?.t('Joining Date')}</div>
                                <div>{i18n?.t('Expire Date')}</div>
                            </div>

                            {/* Table Body */}
                            <div className='min-w-[700px] w-full'>
                                {
                                    data?.subscription?.length > 0 ? (
                                        data?.subscription.map(sub => (
                                            <div key={sub?._id} className='grid grid-cols-5 gap-4 py-4 px-5 border-b items-center text-sm capitalize '>
                                                <div className='truncate'>{sub?.subscription_type || "N/A"}</div>
                                                <div className='truncate'>{currencySymbol}{sub?.price || "N/A"}</div>
                                                <div className={`truncate ${getStatusClass(sub?.active ? "active" : "inactive")} w-fit`}>
                                                    {sub?.active === true ? "Active" : "Inactive"}
                                                </div>
                                                <div className='truncate'>{dayjs(sub?.start_date).format('DD-MMM-YYYY') || "N/A"}</div>
                                                <div className='truncate'>{dayjs(sub?.end_date).format('DD-MMM-YYYY') || "N/A"}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='py-10 text-center text-gray-500'>{i18n?.t('No subscription history available')}</div>
                                    )
                                }
                            </div>
                        </div>
                    </div>

                </> : <Empty />
            }

        </div>
    );
};

export default page;