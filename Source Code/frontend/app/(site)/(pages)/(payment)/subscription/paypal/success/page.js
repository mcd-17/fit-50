"use client";
import React, { useEffect, useState } from "react";
import { getPaypalPaymentSuccess } from "../../../../../../helpers/backend";
import { useFetch } from "../../../../../../helpers/hooks";
import { message } from "antd";
import BasicBar from "../../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../../app/providers/i18n";
import PaymentSuccess from "../../../../../../../components/common/paymentSuccess";

const PaymentSuccessPage = () => {
  const i18n = useI18n();
  const [paymentId, setpaymentId] = useState(null);
  const [payerId, setPayerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [payPalSuccess, getSuccessPaypal, { error }] = useFetch(getPaypalPaymentSuccess, {}, false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("paymentId");
    const payerId = urlParams.get("PayerID");
    if (paymentId && payerId) {
      setpaymentId(paymentId);
      setPayerId(payerId);
      setLoading(false);
    } else {
      setLoading(false);
      message.error(i18n?.t('Missing payment information.'));
      window.location.href = "/cart";
    }
  }, []);

  useEffect(() => {
    if (paymentId && payerId) {
      getSuccessPaypal({ paymentId: paymentId, PayerID: payerId });
    }
  }, [paymentId,payerId]);

  useEffect(() => {
    if (payPalSuccess?.payment?.status === "paid") {
      setIsSuccess(true);
    } else if (error) {
      message.error(i18n?.t('Failed to verify payment.'));
      window.location.href = "/subscription/failed";
      setIsSuccess(false);
    }
  }, [payPalSuccess, error]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <BasicBar heading="Payment" subHeading="Home" />
   {isSuccess ? (  
        <>
           <PaymentSuccess url="/" title="Back To Homepage" />
        </>
      ) : (
        <div className="h-[50vh] flex items-center justify-center">
          <h1 className="text-xl animate-bounce text-textMain">{i18n?.t('Verifying Payment...')}</h1>
        </div>
      )} 
    </div>
  );
};

export default PaymentSuccessPage;