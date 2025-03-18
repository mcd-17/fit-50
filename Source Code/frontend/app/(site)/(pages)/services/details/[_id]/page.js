'use client';

import { useEffect } from "react";
import { fetchService, fetchServices } from "../../../../../helpers/backend";
import { useFetch } from "../../../../../helpers/hooks";
import { useI18n } from "../../../../../providers/i18n";
import BasicBar from "../../../../../../components/common/basic-bar";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

const Page = ({ params }) => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchService);
    const [alldata, getAlldata] = useFetch(fetchServices);

    useEffect(() => {
        getData({ _id: params?._id });
    }, [params?._id]);
    useEffect(() => {
        getAlldata();
    }, []);

    return (
        <div>
            <BasicBar heading={data?.name[i18n.langCode]} subHeading={data?.name[i18n.langCode]} />

            <div className='container lg:py-[140px] sm:py-[100px] py-[50px]'>
                <h1 className='shop-heading  mt-8'>{i18n?.t('gym fitness class')}</h1>
                <div className='grid grid-cols-1 lg:grid-cols-3 mt-14 gap-y-6 lg:gap-6'>
                    <div className='col-span-1 border-[1px] h-fit rounded'>
                        <div className='p-9'>
                            <h1 className='capitalize blogtittle text-textMain mb-4 '>{i18n?.t("all service")}</h1>
                            {alldata?.docs?.map((service, index) => (
                                <Link href={`/services/details/${service?._id}`} key={index}
                                    className={`flex space-x-3 items-center lg:py-6 py-4 border-t   ${index < alldata?.docs?.length - 1 ? 'pb-6 border-t pt-6' : ''}`}
                                >
                                    <FaArrowRight className='text-sm' />
                                    <p className='para1 font-poppins'>{service?.name[i18n.langCode]}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-2 rounded-lg'>
                        <div className=''>
                            <div className="flex justify-center">
                                <Image className='rounded-lg shadow-md h-full lg:h-[578px] object-cover' src={data?.image} width={1000} height={1000} alt='image'></Image>
                            </div>

                            <h1 className='blogtittle text-textMain my-6 capitalize'>{data?.name[i18n.langCode]}</h1>
                            <p className='heading2 !font-normal text-textMain !leading-[170%]'>{data?.description[i18n.langCode]}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Page
