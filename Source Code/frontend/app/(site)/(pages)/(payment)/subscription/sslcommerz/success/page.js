"use client";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import BasicBar from "../../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../providers/i18n";
import PaymentSuccess from "../../../../../../../components/common/paymentSuccess";

const PaymentSuccessPage = () => {
    const [loading, setLoading] = useState(true);
    const i18n = useI18n();
    useEffect(() => {
        setLoading(false);
        const urlParams = new URLSearchParams(window.location.search);
        const session_id = urlParams.get("session_id");
        if (session_id) {
            setLoading(false);
        } else {
            message.error("Missing payment information.");
            window.location.href = "/";
        }
        (false);
        
    }, []);
    return (
        <div>
            <BasicBar heading={i18n?.t('Payment')} subHeading={i18n?.t('Home')} />
            {!loading ? (
                <>
                    <PaymentSuccess url="/" title="Back To Dashboard" />
                </>
            ) : (
                <div className="h-[50vh] flex items-center justify-center">
                    <h1 className="text-xl animate-bounce text-textMain">{i18n?.t('Verifying Payment...')}</h1>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccessPage