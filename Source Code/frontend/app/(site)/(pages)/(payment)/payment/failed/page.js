"use client";
import React from "react";
import Link from "next/link";
import BasicBar from "../../../../../../components/common/basic-bar";
import { useI18n } from "../../../../../../app/providers/i18n";
import PaymentCancel from "../../../../../../components/common/paymentCancel";
const page = () => {
  const i18n = useI18n();
  return (
    <div>
      <BasicBar heading={i18n?.t('Payment')} subHeading={i18n?.t('payment')} />
        <>
          <PaymentCancel url="/" title={i18n?.t('Back To Homepage')} />
        </>
    </div>
  );
};

export default page;
