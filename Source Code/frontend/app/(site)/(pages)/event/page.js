'use client';
import { FaMapLocationDot } from "react-icons/fa6";
import BasicBar from "../../../../components/common/basic-bar";
import { CiStopwatch } from "react-icons/ci";
import Image from "next/image";
import Button from "../../../../components/common/button";
import { useFetch } from "../../../helpers/hooks";
import { fetchAllevent } from "../../../helpers/backend";
import { columnFormatter } from "../../../helpers/utils";
import dayjs from "dayjs";
import Link from "next/link";
import { useI18n } from "../../../providers/i18n";
import { motion } from 'framer-motion';
import { Pagination } from "antd";
import { useState } from "react";

const Page = () => {
  const i18n = useI18n();
  const [data, getData] = useFetch(fetchAllevent, { limit: 6 });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const slideVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };
  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    getData({ page, limit: pageSize });
};

  return (
    <>
      <BasicBar heading={i18n?.t('Event')} subHeading={i18n?.t('Event')} />
      <div className="container lg:py-[140px] sm:py-[100px] py-[50px]">
        <motion.h1
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="shop-heading">{i18n?.t('Events')}</motion.h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:mt-[50px] mt-[30px]'>
          {data?.docs?.map((data, index) => (
            <motion.div
              variants={slideVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-3xl overflow-hidden group !w-full shadow-lg" key={index}>
              <div className="relative !w-full">
                <Image
                  src={data?.image}
                  alt="People exercising in a gym"
                  width={400}
                  height={200}
                  className="w-full h-[390px] rounded-b-full object-cover"
                />
                <div className="absolute inset-0 bg-primary rounded-b-full opacity-0 transition-opacity duration-300 group-hover:opacity-[0.4]"></div>
                <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-sm font-semibold">
                  {dayjs(data?.start_date).format('MMMM D')}
                </div>
              </div>
              <div className="px-6 py-6 space-y-4 w-full">
                <div className="font-semibold text-xl leading-[30px] text-textMain font-poppins line-clamp-1">
                  {columnFormatter(data?.name)}
                </div>
                <div className="flex gap-1 text-textBody text-base font-poppins">
                  <span className="font-semibold">{i18n?.t('Start Date')} : </span>
                  <span className="">{dayjs(data?.start_date).format('DD-MM-YYYY, hh:mm A')}</span>
                </div>
                <div className="flex gap-1 text-textBody text-base font-poppins">
                  <span className="font-semibold">{i18n?.t('End Date')} : </span>
                  <span className="!text-base">{dayjs(data?.end_date).format('DD-MM-YYYY, hh:mm A')}</span>
                </div>
                <div className="flex items-center text-textBody text-base font-poppins">
                  <FaMapLocationDot size={24} className="mr-1" />
                  <span>{data?.location}</span>
                </div>
              </div>
              <div className="px-6 pt-2 pb-4 flex justify-center">
                <Button>
                  <Link href={`/event/view/${data?._id}`}>
                    {i18n?.t('Learn More')}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        <Pagination
                    align="center"
                    className="!mt-[50px]"
                    current={currentPage}
                    pageSize={pageSize}
                    total={data?.totalDocs}
                    onChange={onPageChange}
                />
      </div>
    </>
  );
};

export default Page;