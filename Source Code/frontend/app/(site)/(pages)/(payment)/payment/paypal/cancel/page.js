"use client"
import React from 'react';
import { useI18n } from '../../../../../../providers/i18n';
import BasicBar from '../../../../../../../components/common/basic-bar';

const page = () => {
    const i18n = useI18n();
    return (
        <div>
            <BasicBar heading={i18n?.t('Payment Cancel')} subHeading={i18n?.t('Home')}/>
            {i18n?.t('payment canceled')}
        </div>
    );
};

export default page;