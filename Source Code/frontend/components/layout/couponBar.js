"use client";
import React, { useState } from 'react';
import { message, Modal } from 'antd';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useFetch } from '../../app/helpers/hooks';
import { fetchUserCoupon } from '../../app/helpers/backend';
import { TbTopologyStar3 } from "react-icons/tb";
import { useI18n } from '../../app/providers/i18n';

const CouponBar = () => {
  const i18n = useI18n();
  const [coupon, getCoupon] = useFetch(fetchUserCoupon);
  const [modal, setModal] = useState(false);

  const handleCopyCoupon = (id) => {
    const selectedCoupon = coupon.find((item) => item._id === id);
    navigator.clipboard.writeText(selectedCoupon?.code);
    message.success(`Coupon code ${selectedCoupon?.code} copied to clipboard!`);
  };

  const isExpired = (item) => dayjs().isAfter(dayjs(item?.expire_at));

  return (
    <>
      {
        coupon?.length > 0 && (
          <div className='relative'>
            <div
              className="bg-primary text-white flex items-center justify-center  py-2"
            >
              <h1 className="text-sm sm:text-base font-semibold">
                {i18n?.t("Collect Your Exclusive Coupon Here!")}{" "}
                <span  onClick={() => setModal(true)} className="font-bold cursor-pointer text-yellow-100 hover:underline transition-colors duration-200">
                  {i18n?.t("Get Now")}
                </span>
              </h1>
            </div>

            <Modal
              open={modal}
              title={i18n.t("Coupon List")}
              onCancel={() => setModal(false)}
              footer={null}
              className="flex items-center justify-center rounded-md"
            >
              <div className="flex flex-col gap-4 mt-5">
                {coupon?.length > 0 ? (
                  coupon?.map((item, i) =>
                    isExpired(item) ? null : (
                      <div
                        onClick={() => handleCopyCoupon(item?._id)}
                        key={i}
                        className="relative rounded-[10px] cursor-pointer w-full md:h-[120px]"
                      >

                        <div className="relative flex w-full h-full md:gap-10 gap-3 items-center  bg-orange-500 text-white rounded ">
                          <div className="md:w-[200px] w-[100px] py-4 md:py-0 h-full flex flex-col items-center justify-center text-center border-r-4 border-dotted relative">
                            <h2 className="md:text-base text-sm font-semibold text-white/60">
                              {dayjs(item?.expire_at).format("MMM")}
                            </h2>
                            <h2 className="md:text-xl text-base font-bold text-white">
                              {dayjs(item?.expire_at).format("DD")}
                            </h2>
                            <h2 className="md:text-base text-sm font-semibold text-white/60">
                              {dayjs(item?.expire_at).format("YYYY")}
                            </h2>
                          </div>

                          <div className="flex flex-col md:justify-center justify-start w-full gap-1">
                            <h1 className="md:text-3xl text-xl font-bold text-white">
                              {item?.type === "percentage"
                                ? `${item?.discount}%`
                                : `$${item?.discount}`}{" "}
                              Off
                            </h1>
                            <h2 className="md:text-lg text-base font-medium text-white/90">
                              Minimum Spend: ${item?.minimum_order_amount}
                            </h2>
                            <h2 className="md:text-xl text-sm font-semibold text-white/80">
                              Code: {item?.code}
                            </h2>
                          </div>
                        </div>
                        {isExpired(item) && (
                          <h1 className="absolute top-2 right-2 px-2 py-1 font-medium text-red-500 bg-red-100 rounded shadow">
                            {i18n?.t("Expired")}
                          </h1>
                        )}
                      </div>
                    )
                  )
                ) : (
                  <div>{i18n?.t("No Coupon available")}</div>
                )}
              </div>
            </Modal>
          </div>
        )
      }
    </>
  );
};

export default CouponBar;
