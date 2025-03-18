"use client"
import React from 'react'
import BasicBar from '../../../../components/common/basic-bar'
import Pricing from '../../../../components/home1/pricing'
import Services from './services';
import { useI18n } from '../../../providers/i18n';

const Page = () => {
  const i18n = useI18n()
  return (
    <div>
        <BasicBar heading={i18n?.t('Services')} subHeading={i18n?.t('Services')}/>
        <Services/>
           <div className='lg:my-[120px] my-[60px]'>
            <Pricing />
            </div>
    </div>
  )
}

export default Page