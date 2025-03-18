'use client';
import React, { useState } from 'react';
import { AiOutlineContacts } from "react-icons/ai";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { GoCodeOfConduct } from "react-icons/go";
import { LiaBorderStyleSolid } from "react-icons/lia";
import { IoHomeOutline } from "react-icons/io5";
import PrivacyPage from './(pages)/privacy/page';
import AboutPage from './(pages)/about/page';
import ContactPage from './(pages)/contact/page';
import TermsPage from './(pages)/terms/page';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import HomePageSetting from './(pages)/home/page';
import CompanyDetails from './(pages)/company/page';
import ThemeSetting from './(pages)/theme-settings/page';
import { FaAffiliatetheme } from "react-icons/fa";
const Content = () => {
    const i18n = useI18n()
    const [tab, setTab] = useState(0);

    const methods = [
        {
            label: ("Theme Settings"),
            icon: <FaAffiliatetheme />,
            form: <ThemeSetting slug={'theme_setting'} />
        },
        {
            label: ("Home"),
            icon: <IoHomeOutline />,
            form: <HomePageSetting slug={'home'} />
        },
        {
            label: ("About Us"),
            icon: <LiaBorderStyleSolid />,
            form: <AboutPage slug={'about'} />
        },
        {
            label: ("Company Details"),
            icon: <LiaBorderStyleSolid />,
            form: <CompanyDetails slug={'company_details'} />
        },
        {
            label: ("Contact Us"),
            icon: <AiOutlineContacts />,
            form: <ContactPage slug={'contact_us'} />
        },
        {
            label: ("Privacy Policy"),
            icon: <MdOutlinePrivacyTip />,
            form: <PrivacyPage slug={'privacy_policy'} />
        },
        {
            label: ("Terms & Conditions"),
            icon: <GoCodeOfConduct />,
            form: <TermsPage slug={'terms_&_condition'} />
        },
    ];

    return (
        <div>
            <div className='flex justify-between'>
                <PageTitle title="Pages List" />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="basis-3/12">
                    <div className="flex flex-col">
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
                <div className="basis-9/12">
                    {methods[tab].form}
                </div>
            </div>
        </div>
    );
};

export default Content;