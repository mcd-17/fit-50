"use client"
import React from 'react';
import BasicBar from '../../../../components/common/basic-bar';
import SignIn from '../../../../components/signin/signin';
import { useI18n } from '../../../providers/i18n';
const page = () => {
    const i18n = useI18n();
    return (
        <>
            <BasicBar heading={i18n?.t('Sign In')} subHeading={i18n?.t('Sign In')} />
            <SignIn />
        </>
    );
};

export default page;