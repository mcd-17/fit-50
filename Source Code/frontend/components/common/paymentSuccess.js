"use client";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useI18n } from '../../app/providers/i18n';

const PaymentSuccess = ({url,title}) => {
    const i18n = useI18n();
    return (
        <div className="md:py-20 py-10 lg:py-32">
        <Image width={1000} height={1000} className="mx-auto md:w-[400px] w-[300px] h-auto" src="/succ.gif" alt="Payment Success" />
        <h1 className="heading lg:mt-12 mt-6 font-poppins text-textMain text-center">
            {i18n?.t('Payment Success')}
        </h1>
        <div className="lg:mt-12 mt-4 flex items-center justify-center">
            <Link href={url ? url : "/"} className="underline font-poppins text-primary">{i18n?.t(title ? title : "Back To Dashboard")}</Link>
        </div>
    </div>
    );
};

export default PaymentSuccess;