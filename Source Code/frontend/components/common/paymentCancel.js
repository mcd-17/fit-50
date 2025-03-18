"use client";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useI18n } from '../../app/providers/i18n';

const PaymentCancel = ({url,title}) => {
    const i18n = useI18n();
    return (
        <div className="md:py-20 py-10 lg:py-32">
        <Image width={1000} height={1000} className="mx-auto md:w-[400px] w-[300px] h-auto" src="/fail.gif" alt="Payment failed" />
        <h1 className="heading lg:mt-12 text-textMain mt-6  text-center">
            {i18n?.t('Payment Failed')}
        </h1>
        <div className="lg:mt-12 mt-4 flex items-center justify-center">
            <Link href={url ? url : "/"} className="underline font-poppins text-primary">{i18n?.t(title ? title : "Back To Dashboard")}</Link>
        </div>
    </div>
    );
};

export default PaymentCancel;