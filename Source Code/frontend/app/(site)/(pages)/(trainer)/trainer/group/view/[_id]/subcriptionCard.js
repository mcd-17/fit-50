'use client'
import dayjs from 'dayjs';
import React from 'react';

const SubScriptionCard = ({ data, currencySymbol }) => {
    return (
        <div className='flex justify-between py-4 border-b items-center w-full gap-8 '>
            <div className='whitespace-pre capitalize'>{data?.subscription_type ? data?.subscription_type : "-"}</div>
            <div className='whitespace-pre capitalize'>{data?.price ? currencySymbol + data?.price : "-"}</div>
            <div className='whitespace-pre capitalize'>{data?.active === true ? "active" :"inactive" || "-"}</div>
            <div className='whitespace-pre capitalize'>{dayjs(data?.start_date).format("DD-MM-YYYY") || "-"}</div>       
            <div className='whitespace-pre capitalize'>{dayjs(data?.end_date).format("DD-MM-YYYY") || "-"}</div>       
        </div>
    );
};

export default SubScriptionCard;