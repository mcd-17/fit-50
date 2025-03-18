"use client"
import React from 'react';
import NoticeCalendar from '../../../../(site)/(pages)/(trainer)/components/noticeCalender';
import { useParams } from 'next/navigation';

const page = () => {
    const params = useParams()
    return (
        <div>
            <NoticeCalendar _id={params?._id}/>
        </div>
    );
};

export default page;