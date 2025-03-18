'use client';
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { usePathname } from 'next/navigation';
const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  loadingText = 'Loading...',
  pathName
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname()
  const handleClick = async (event) => {
    if (type === 'submit') {
      setIsLoading(true);
    }
    if (onClick) {
      await onClick(event);
    }
    if (type === 'submit') {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      type={type}
      onClick={handleClick}
      className={`border-2 border-primary  text-textMain !font-poppins md:px-4 h-fit py-[14px] px-4 whitespace-pre rounded transition-colors !font-medium duration-300 ease-in-out sm:text-base capitalize text-sm 
        ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-primary hover:text-white'} ${pathName === 'home3' && pathname==="/" ? 'hover:bg-primary text-white' : ''} ${className}`}
      disabled={isLoading}
    >
      {isLoading ? loadingText : children}
    </motion.button>
  );
};

export default Button;
