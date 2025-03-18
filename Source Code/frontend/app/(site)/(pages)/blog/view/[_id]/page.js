'use client';

import { Input } from "antd";
import BasicBar from "../../../../../../components/common/basic-bar";
import { blogCategoryList, fetchBlog, fetchBlogsListUser, fetchTagsList } from "../../../../../helpers/backend";
import { useFetch } from "../../../../../helpers/hooks";
import { SearchOutlined } from '@ant-design/icons';
import Image from "next/image";
import dayjs from "dayjs";
import { FaArrowRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Link from "next/link";
import CommentSection from "./comment"
import { columnFormatter } from "../../../../../helpers/utils";
import { useI18n } from "../../../../../providers/i18n";


const Page = ({ params }) => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchBlog, {}, false);
    const [list, getList] = useFetch(fetchBlogsListUser, { limit: 4 });
    const [category, getCategory] = useFetch(blogCategoryList);
    const [tag, getTag] = useFetch(fetchTagsList);
    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);
    useEffect(() => {
        getList();

    }, []);

    return (
        <>
            <BasicBar heading={i18n?.t("Blog Details")} subHeading={i18n?.t("Blog Details")} />
            <div className="container lg:py-[140px] py-[90px]">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-y-6">
                    <div className="col-span-1">
                        <div className="lg:flex flex-col gap-6 hidden">
                            <div className='shadow-custom-light py-10 px-6 h-[465px] overflow-y-auto scroll-smooth hide-scrollbar'>
                                <h1 className='profileHeading font-poppins'>{i18n?.t('Latest News')}</h1>
                                {list?.docs?.length > 0 ? (
                                    list?.docs?.map(news => (
                                        <div key={news._id} className='flex flex-row items-center gap-5 pt-5 '>
                                            <Image src={news?.image} alt='image' height={66} width={66} className='rounded h-[66px] w-[66px] object-fill' />
                                            <div className='w-full  items-start justify-start space-y-1 flex flex-col'>
                                                <Link href={`/blog/view/${news?._id}`} className='lg:text-xl text- text-secondary hover:text-primary line-clamp-2 hover:underline font-medium capitalize font-poppins'>{news?.title[i18n.langCode]}</Link>
                                                <p className='text-textMain opacity-60 text-[14px] font-poppins'>{dayjs(news?.createdAt).format('MMM DD, YYYY')}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="font-poppins ">{i18n?.t('No news items found')}</p>
                                )}
                            </div>
                            <div className='shadow-custom-light h-fit rounded mt-10'>
                                <div className='md:p-9 p-5 h-[400px] overflow-y-auto scroll-smooth hide-scrollbar'>
                                    <h1 className='profileHeading'>{i18n?.t('Popular Categories')}</h1>
                                    {category?.docs?.map((service) => (
                                        <Link
                                            href={`/blog?category=${service?._id}`}
                                            key={service._id}
                                            className={`flex items-center group py-2 sm:py-6 border-b border-b-[#E7E7E7] hover:underline `}
                                        >
                                            <FaArrowRight className='text-sm sm:mr-3 mr-2' />
                                            <p className='para1'>{service?.name[i18n.langCode]}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 w-full">
                        <Image className='rounded w-full lg:h-[478px] h-[200px] object-fill' src={data?.image} width={1000} height={1000} alt='image'></Image>
                        <div className="space-y-6 overflow-y-auto">
                            <h1 className='capitalize blogtittle my-10 text-textMain'>{data?.title[i18n.langCode]}</h1>
                            <p className='blogdescription my-4 '>{data?.short_description[i18n.langCode]}</p>
                            <p dangerouslySetInnerHTML={{ __html: data?.details[i18n.langCode] }} className='para1 text-justify font-poppins'></p>
                        </div>
                        <div className="lg:mt-10 mt-6 ">
                            <CommentSection commentsList={data?.comments} blogId={params?._id} getData={getData} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page