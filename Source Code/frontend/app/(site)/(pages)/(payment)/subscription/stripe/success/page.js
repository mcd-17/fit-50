"use client";
import React, { useEffect, useState } from "react";
import { getSuccessSubscriptionStripe } from "../../../../../../helpers/backend";
import { useFetch } from "../../../../../../helpers/hooks";
import { message } from "antd";
import BasicBar from "../../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../providers/i18n";
import PaymentSuccess from "../../../../../../../components/common/paymentSuccess";

const PaymentSuccessPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [stripeSuccess, getSuccessStripe, { error }] = useFetch(getSuccessSubscriptionStripe, {}, false);
  const i18n = useI18n();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get("session_id");
    
    if (session_id) {
      setSessionId(session_id);
      setLoading(false);
    } else {
      setLoading(false);
      message.error("Missing payment information.");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      getSuccessStripe({ session_id: sessionId });
    }
  }, [sessionId]);

  useEffect(() => {
    if (stripeSuccess?.payment?.status === "paid") {
      setIsSuccess(true);
    } else if (error) {
      message.error(i18n?.t('Payment already paid or Failed to verify payment.'));
      setIsSuccess(false);
      window.location.href = "/";
    }
  }, [stripeSuccess, error]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <BasicBar heading={i18n?.t('Payment')} subHeading={i18n?.t('Home')} />
      {isSuccess ? ( 
        <>
          <PaymentSuccess url="/" title="Back To Homepage" />
        </>
      ) : (
        <div className="h-[50vh] flex items-center justify-center">
          <h1 className="text-xl animate-bounce font-montserrat text-textMain">{i18n?.t('Verifying Payment...')}</h1>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
