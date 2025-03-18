"use client";
import React, { useEffect, useState } from "react";
import BasicBar from "../../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../providers/i18n";
import { useFetch } from "../../../../../../helpers/hooks";
import { getRazorpayPaymentSuccess } from "../../../../../../helpers/backend";
import { message } from "antd";
import { useRouter } from "next/navigation";
import PaymentSuccess from "../../../../../../../components/common/paymentSuccess";

const PaymentSuccessPage = () => {
    const i18n = useI18n();
    const [loading, setLoading] = useState(true);
    const [mollieSuccess, getSuccess,{ error }] = useFetch(getRazorpayPaymentSuccess, {}, false)
    const router = useRouter();
    const [sessionId, setSessionId] = useState(null);
    const [razorpayPaymentId, setRazorpayPaymentId] = useState(null);
    const [razorpaySignature, setRazorpaySignature] = useState(null);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const session_id = urlParams.get('session_id');
        const razorpay_payment_id = urlParams.get('razorpay_payment_id');
        const razorpay_signature = urlParams.get('razorpay_signature');
        if (session_id && razorpay_payment_id && razorpay_signature) {
            setSessionId(session_id);
            setRazorpayPaymentId(razorpay_payment_id);
            setRazorpaySignature(razorpay_signature);
        } else {
            message.error('Missing payment information.');
            router.push('/');
        }
    }, []);

    useEffect(() => {
        if (sessionId && razorpayPaymentId && razorpaySignature) {
            getSuccess({ session_id: sessionId, razorpay_payment_id: razorpayPaymentId, razorpay_signature: razorpaySignature });
            setLoading(false);
        }
    }, [sessionId, razorpayPaymentId, razorpaySignature]);
    useEffect(() => {
        if(error) {
            message.error(error)
            router.push('/subscription/failed');
        }
    },[error])

    return (
        <div>
            <div>
            <BasicBar heading={i18n?.t('Payment')} subHeading={i18n?.t('Home')} />
            {loading ? (
                <div className="h-[50vh] flex items-center justify-center">
                    <h1 className="text-xl animate-bounce text-textMain">{i18n?.t('Verifying Payment...')}</h1>
                </div>
            ) : (
                <PaymentSuccess />
            )}
        </div>
        </div>
    );
};

export default PaymentSuccessPage;
