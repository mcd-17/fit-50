import Image from 'next/image';
import React from 'react';
import { FaUserTie } from 'react-icons/fa';
import { BsFillCalendarFill } from 'react-icons/bs';
import { LiaLongArrowAltRightSolid } from 'react-icons/lia';
import Link from 'next/link';
import { useI18n } from '../../app/providers/i18n';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const NewsCard = ({ data }) => {
  const i18n = useI18n();
  const slideUpZoomVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (

    <motion.div
      // initial="hidden"
      // whileInView="visible"
      // viewport={{ once: true, amount: 0.3 }}
      // variants={slideUpZoomVariant}
      // transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white group lg:p-6 p-3 rounded box-shadow "
    >
      <div className="relative w-full sm:h-[360px] h-[300px]  ">
        <Link href={`/blog/view/${data?._id}`}>
          <Image
            src={data.image}
            alt="news"
            width={1000}
            height={1000}
            objectFit="fill"
            className="w-full h-full object-fill "
          />
        </Link>
      </div>
      <div>
        <Link href={`/blog/view/${data?._id}`}>
          <h5 className="md:text-xl cursor-pointer text-base font-medium  font-poppins h-[58px] mt-6 lg:mb-10 sm:mb-6 mb-5 line-clamp-2 w-full group-hover:text-primary  capitalize ">
            {data?.title[i18n.langCode]}
          </h5>
        </Link>
        <div className="flex justify-between gap-2">
          <div className="flex gap-2 items-center  duration-300 transition-all text-[16px]">
            <FaUserTie />
            <span className="cardDescription text-textMain line-clamp-1">
              {data?.user?.name?.length > 8 ? (
                <>
                  {data?.user?.name.substring(0, 8)}...
                </>
              ) : (
                data?.user?.name || 'Admin Post'
              )}
            </span>
          </div>
          <div className="flex gap-2 items-center  duration-300 transition-all text-[16px]">
            <BsFillCalendarFill />
            <span className="cardDescription text-textMain whitespace-pre ">
              {dayjs(data?.createdAt).format("DD-MM-YYYY")}
            </span>
          </div>
          <Link href={`/blog/view/${data?._id}`} className="flex gap-2  items-center  group-hover:text-primary cardDescription duration-300 transition-all  whitespace-pre  cursor-pointer  ">
            <span>{i18n?.t('Read More')}</span>
            <LiaLongArrowAltRightSolid className="md:text-xl text-base" />
          </Link>
        </div>
      </div>
    </motion.div>

  );
};

export default NewsCard;