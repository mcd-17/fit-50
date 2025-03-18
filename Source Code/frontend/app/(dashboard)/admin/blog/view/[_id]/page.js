"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { fetchBlog } from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter } from '../../../../../helpers/utils';
import PageTitle from '../../../../components/common/page-title';
import CommentSection from '../../../../../(site)/(pages)/blog/view/[_id]/comment';

const AdminBlogView = ({ params }) => {
    const [data, getData] = useFetch(fetchBlog, {}, false);
    const i18n = useI18n()

    useEffect(() => {
        getData({ _id: params._id });
    }, [params._id]);

    return (
        <div>
            <section className="border rounded-md p-4 bg-white shadow-md">
                <PageTitle title={("Blog Details")} />
                <div className="container mx-auto block py-10">
                    <div className="lg:pr-10 px-5">
                        <div className="">
                            <div className="w-full py-5">
                                <Image width={1000} height={1000} className="w-full  rounded-md h-[600px] object-cover" src={data?.image} alt="blog" />
                            </div>
                            <div className="">
                                <h1 className=" font-bold text-2xl py-2">{columnFormatter(data?.title)}</h1>
                                <p className='paragraph_1 my-2'>
                                    {columnFormatter(data?.short_description)}
                                </p>
                                <div className="py-5 paragraph_1 text-secondary_text"
                                    dangerouslySetInnerHTML={{
                                        __html: columnFormatter(data?.details),
                                    }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <h1 className='paragraph_1'>{i18n.t("Tags")}:</h1>
                                    <div className="ps-5">
                                        <span className="font-semibold px-3 header_7">{
                                            data?.tags?.map((item) => (
                                                <span className='whitespace-pre' key={item?._id}>#{columnFormatter(item?.name)} </span>
                                            ))
                                        }</span>
                                    </div>
                                </div>
                            </div>
                            <CommentSection commentsList={data?.comments} blogId={params._id} getData={getData}/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminBlogView;