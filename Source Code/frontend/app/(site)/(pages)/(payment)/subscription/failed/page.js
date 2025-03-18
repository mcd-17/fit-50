"use client";
import React from "react";
import BasicBar from "../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../app/providers/i18n";
import PaymentCancel from "../../../../../../components/common/paymentCancel";
const PaymentFailedPage = () => {
  const i18n = useI18n();
  return (
    <div>
      <BasicBar heading="Payment" subHeading="Home" />
        <>
          <PaymentCancel url="/" title={i18n?.t('Back To Homepage')} />
        </>
    </div>
  );
};

export default PaymentFailedPage;
