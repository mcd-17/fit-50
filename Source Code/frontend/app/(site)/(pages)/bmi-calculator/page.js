"use client"
import React from 'react'
import BasicBar from '../../../../components/common/basic-bar'
import BMI from '../../../../components/home1/bmi'
import Pricing from '../../../../components/home1/pricing'
import { useI18n } from '../../../providers/i18n'

const page = () => {
  const i18n = useI18n();
  return (
    <div>
      <BasicBar heading={i18n?.t('Fitness Calculator')} subHeading={i18n?.t('Fitness Calculator')} />
      <div className="container lg:space-y-[140px] sm:space-y-[100px] space-y-[60px] mt-[140px]">
        <BMI />
        <Pricing />
      </div>
    </div>
  )
}

export default page
