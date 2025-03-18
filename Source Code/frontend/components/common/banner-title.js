'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../../app/contexts/site';
import { usePathname } from 'next/navigation';


const BannerTitle = ({ title, subtitle, className,home3=false }) => {
  const {findDefaultTheme} = useCurrency()
const pathName = usePathname()
  const getImageSrc = () => {
    if (findDefaultTheme?.name === 'home1') {
      return '/tala.png';
    } else if (findDefaultTheme?.name === 'home2') {
      return '/dumbel.png';
    } else if (findDefaultTheme?.name === 'home3') {
      return '/body.png';
    }
    return '';
  };

  const subtitleVariants = {
    hidden: { opacity: 0, x: -50 },  
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
  };

  return (
    <div className={`flex flex-col lg:gap-3 gap-2 ${className} overflow-hidden `}>
      <motion.h2
        // variants={subtitleVariants}
        // initial="hidden"
        // whileInView="visible"
        // viewport={{ once: false, amount: 0.3 }}
        className={`text-[#E67529] flex items-center gap-[13px]`}
      >
        {getImageSrc() && (
          <Image
            src={getImageSrc()}
            alt="icon"
            width={100}
            height={80}
            className='w-[24px] h-[24px]'
          />
        )}
        <span className='bannersubtitle'>{subtitle}</span>
      </motion.h2>
      
      <motion.h1
        // variants={titleVariants}
        // initial="hidden"
        // whileInView="visible"
        // viewport={{ once: false, amount: 0.3 }}
        className={`bannertittle  text-textMain ${findDefaultTheme?.name === 'home3' && pathName=== "/"  ? '!text-white' : '!tex'}`}
      >
        {title}
      </motion.h1>
    </div>
  );
};

export default BannerTitle;
