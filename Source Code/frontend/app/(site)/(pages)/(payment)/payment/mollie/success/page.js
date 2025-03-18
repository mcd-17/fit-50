"use client";
import React, { useEffect, useState } from "react";
import BasicBar from "../../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../providers/i18n";
import { useFetch } from "../../../../../../helpers/hooks";
import { getMollieOrderPaymentSuccess } from "../../../../../../helpers/backend";
import { message } from "antd";
import { useRouter } from "next/navigation";
import PaymentSuccess from "../../../../../../../components/common/paymentSuccess";

const PaymentSuccessPage = () => {
    const i18n = useI18n();
    const [loading, setLoading] = useState(true);
    const [mollieSuccess, getSuccess, { error }] = useFetch(getMollieOrderPaymentSuccess, {}, false);
    const router = useRouter();
    const [sessionId, setSessionId] = useState(null);
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const session_id = urlParams.get('session_id');
        if (session_id) {
            setSessionId(session_id);
        } else {
            message.error('Missing payment information.');
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            if (sessionId) {
                const success = await getSuccess({ session_id: sessionId });
                setLoading(false);     
            }
        };
        fetchData();
    }, [sessionId]);
    useEffect(() => {
        if(error) {
            message.error(error)
        }
    },[error])

    return (
        <div>
            <BasicBar heading={i18n?.t('Payment')} subHeading={i18n?.t('Home')} />
            {loading ? (
                <div className="h-[50vh] flex items-center justify-center">
                    <h1 className="text-xl animate-bounce text-textMain font-poppins">{i18n?.t('Verifying Payment...')}</h1>
                </div>
            ) : (
                <PaymentSuccess url={"/"} title={i18n?.t('Back To Dashboard')}/>
            )}
        </div>
    );
};

export default PaymentSuccessPage;
