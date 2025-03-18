"use client"
import { Tabs, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import GmailEmailProvider from './gmail';
import SendGridMarketing from './sendGridManageEmail';
import { useFetch } from '../../../../helpers/hooks';
import { fetchMarketingSettings } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import EmailTemplate from './emailTemplate';


const MarkettingSettings = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [settings, getSettings, { loading }] = useFetch(fetchMarketingSettings)
    const [checkedValue, setCheckedValue] = useState(false);

    useEffect(() => {
        if (settings?._id) {
            form.resetFields();
        }
    }, [settings])

    const [tab, setTab] = useState(0);

    const methods = [
        {
            label: ("Email Configuration"),
            form: <div className={'bg-white p-4 rounded'}>
            <Tabs defaultActiveKey="1" centered type="card">
                {i18n?.t("SendGrid")}
                <Tabs.TabPane tab={"SendGrid"} key="1">
                    <SendGridMarketing
                        settings={settings}
                        getSettings={getSettings}
                        loading={loading}
                    />
                </Tabs.TabPane>
                {i18n?.t("Gmail ")}
                <Tabs.TabPane tab={"Gmail"} key="2">
                    <GmailEmailProvider
                        settings={settings}
                        getSettings={getSettings}
                        loading={loading}
                        setCheckedValue={setCheckedValue}
                    />
                </Tabs.TabPane>
            </Tabs>
        </div>
        },
        {
            label: ("Email Template"),
            form: <EmailTemplate/>
        }
    ];

    return (
        <>
            <PageTitle title={"Marketting Settings"} />
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="!rounded-sm !overflow-hidden lg:!w-[300px] ">
                    <div className="flex flex-col !w-full">
                        {methods.map((method, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-start p-4 cursor-pointer ${tab === index ? "bg-primary text-white" : "bg-white text-dark_text"}`}
                                onClick={() => setTab(index)}>
                                {/* <div className="mr-4">{method.icon}</div> */}
                                <div>{i18n.t(method.label)}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:w-[calc(100%-300px)]">
                    {methods[tab].form}
                </div>
            </div>
        </>

    )
}

export default MarkettingSettings;