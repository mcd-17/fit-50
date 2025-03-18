'use client';
import React, { useState } from 'react';
import { AiOutlineContacts } from "react-icons/ai";
import { LiaBorderStyleSolid } from "react-icons/lia";
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import { MdEmail, MdScheduleSend } from 'react-icons/md';
import { SiMinutemailer } from "react-icons/si";
import { RiMailCloseFill } from "react-icons/ri";
import AllEmail from './(pages)/all-email';
import SendEmail from './(pages)/send-email';
import ScheduleEmail from './(pages)/schedule-email';
import PendingEmail from './(pages)/pending-email';
import DeliveredEmail from './(pages)/delivered-email';
import FailedEmail from './(pages)/failed-email.js';

const Content = () => {
    const i18n = useI18n()
    const [tab, setTab] = useState(0);

    const methods = [
        {
            label: ("Send Email"),
            icon: <SiMinutemailer />,
            form: <SendEmail/>
        },
        {
            label: ("All Email"),
            icon: <MdEmail />,
            form: <AllEmail/>
        },
        {
            label: ("Scheduled Email"),
            icon: <MdScheduleSend />,
            form: <ScheduleEmail/>
        },
        {
            label: ("Pending Email"),
            icon: <LiaBorderStyleSolid />,
            form: <PendingEmail/>
        },
        {
            label: ("Delivered Email"),
            icon: <LiaBorderStyleSolid />,
            form: <DeliveredEmail/>
        },
        {
            label: ("Failed Email"),
            icon: <RiMailCloseFill />,
            form: <FailedEmail/>
        }
    ];

    return (
        <div>
            <PageTitle title="Email Options" />
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="!rounded-sm !overflow-hidden lg:!w-[300px] ">
                    <div className="flex flex-col !w-full">
                        {methods.map((method, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-start p-4 cursor-pointer ${tab === index ? "bg-primary text-white" : "bg-white text-dark_text"}`}
                                onClick={() => setTab(index)}>
                                <div className="mr-4">{method.icon}</div>
                                <div>{i18n.t(method.label)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:w-[calc(100%-300px)]">
                    {methods[tab].form}
                </div>
            </div>
        </div>
    );
};

export default Content;