"use client"
import React from 'react';
import BasicBar from '../../../../components/common/basic-bar';
import SignUp from '../../../../components/signin/signup';
import { useI18n } from '../../../providers/i18n';

const page = () => {
    const i18n = useI18n();
    return (
        <>
            <BasicBar heading={i18n?.t('Sign Up')} subHeading={i18n?.t('Sign Up')}/>
            <SignUp/>
        </>
    );
};

export default page;