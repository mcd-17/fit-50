'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../app/providers/i18n';
import { Tooltip } from 'antd';

const FeatureCard = ({ feature }) => {
  const i18n = useI18n();

  const slideUpZoomVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.9 }, 
    visible: { opacity: 1, y: 0, scale: 1 },  
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={slideUpZoomVariant}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className='bg-white cursor-pointer  w-full rounded-[4px] min-h-[285px] hover:scale-105 text-textMain group overflow-hidden duration-500' 
      style={{ boxShadow: '0px 0px 20px 0px rgba(0, 0, 0, 0.10)' }}
    >
      <div className='lg:py-12 py-6 px-2 sm:px-4 flex flex-col text-center items-center'>
        <div
          className='mb-[30px] w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-custom-light bg-white'
          style={{ filter: 'drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.10))' }}
        >
          <div className='flex items-center justify-center p-3'>
            <Image
              src={feature?.image}
              width={32}
              height={32}
              alt={'Feature image'}
              className='object-fill h-[32px] w-[32px]'
            />
          </div>
        </div>
        <div className='space-y-6'>
          <h1 className='cardHeading text-textMain duration-500'>
            {i18n.t(feature?.name[i18n.langCode])}
          </h1>
            <h3 className='cardDescription line-clamp-2'>
              {feature?.description[i18n.langCode]}
            </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
