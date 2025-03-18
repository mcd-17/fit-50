"use client";
import React, { useEffect } from 'react'
import BasicBar from '../../../../../../components/common/basic-bar'
import Image from 'next/image';
import { Progress } from 'antd';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebook, FaFax, FaInstagram, FaLinkedin, FaPhoneAlt } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { IoMdMail } from 'react-icons/io';
import { useFetch } from '../../../../../helpers/hooks';
import { trainerdetails } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';


const Page = ({ params }) => {
    const [data, getData, { loading }] = useFetch(trainerdetails, {}, false);
    const i18n = useI18n();
    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);

    const contactItems = [
        { icon: <IoPerson />, label: 'Experience', value: data?.experience },
        { icon: <IoMdMail />, label: 'Email', value: data?.email },
        { icon: <FaPhoneAlt />, label: 'Phone', value: data?.phone },
        { icon: <FaFax />, label: 'Address', value: data?.address },
    ];


    return (
        <div>
            <BasicBar heading={i18n?.t('Trainers')} subHeading={i18n?.t('Trainer Details')} />
            <div className="container lg:py-[140px] sm:py-[100px] py-[50px]">
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='col-span-1'>
                        <Image src={data?.image} width={1000} height={1000} alt="Trainer" className="object-fill w-full lg:max-w-[424px]  h-full lg:h-[475px] rounded" />
                    </div>
                    <div className='col-span-2'>
                        <div className='bg-[#1C2021] rounded p-6 md:p-14 text-white'>
                            <h1 className='capitalize lg:text-[32px] text-2xl  font-bold font-poppins'>{data?.name}</h1>
                            <p className='sm:text-[16px] mt-4  text-sm max-w-[580px] font-poppins'>{data?.short_bio}</p>
                            <div className='flex flex-row  space-x-5 mt-6 mb-10'>
                                {data?.twitter && (
                                    <Link href={data.twitter || ""} target="_blank" className="hover:text-primary transition-colors">
                                        <FaXTwitter size={24} />
                                    </Link>
                                )}
                                {data?.facebook && (
                                    <Link href={data.facebook || ""} target="_blank" className="hover:text-primary transition-colors">
                                        <FaFacebook size={24} />
                                    </Link>
                                )}
                                {data?.linkedin && (
                                    <Link href={data.linkedin || ""} target="_blank" className="hover:text-primary transition-colors">
                                        <FaLinkedin size={24} />
                                    </Link>
                                )}
                                {data?.instagram && (
                                    <Link href={data.instagram || ""} target="_blank" className="hover:text-primary transition-colors">
                                        <FaInstagram size={24} />
                                    </Link>
                                )}
                            </div>

                            <hr className='bg-gray-600' />
                            <div className="grid lg:grid-cols-2 mt-8 lg:gap-10 gap-y-6">
                                {contactItems.map((item, idx) => (
                                    <div key={idx} className="flex space-x-4 items-center">
                                        <div className="text-primary text-2xl p-4 bg-white rounded-full h-fit w-fit">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="text-[#ABAAAA] font-poppins">{i18n?.t(item.label)}</p>
                                            <h1 className="text-lg font-poppins">{item.value}</h1>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-14'>
                    <div className='col-span-1'></div>
                    <div className='col-span-2 '>
                        <h1 className='!text-[32px] titlex text-textMain'>{i18n?.t('About')} {data?.name}</h1>
                        <p className='para1 my-4 text-justify font-poppins'>{data?.about}</p>
                        {
                            data?.skills?.length > 0 && (
                                <div className='mt-10'>
                                    <h1 className='text-[#2B2B2B] md:text-[32px] text-2xl  font-semibold'>{i18n.t("Key Skills")}</h1>
                                    <div className='mt-[28px] flex flex-col gap-6'>
                                        {
                                            data?.skills?.map(skill => (
                                                <div key={skill?._id} className=''>
                                                    <h3 className='text-[#2b2b2b] md:text-lg text-base font-semibold capitalize'>{skill?.name}</h3>
                                                    <Progress strokeColor="#E67529" percent={skill?.level} size="small" />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Page
