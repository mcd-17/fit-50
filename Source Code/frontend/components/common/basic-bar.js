"use client"
import React from 'react';
import { IoHome } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import Link from 'next/link';
import { useI18n } from '../../app/providers/i18n';


const BasicBar = ({ heading, subHeading }) => {
    const i18n = useI18n();
    return (
        <section
            className="w-full overflow-hidden bg-cover bg-center bg-[url(/basic.png)]"
        >
            <div className='bg-black/80 w-full h-full '>
                <div className='container lg:h-[420px] sm:h-[300px] h-[220px]'>
                    <div className="relative font-montserrat text-white text-5xl max-w-[1320px] mx-auto pl-6 lg:pt-[219px] sm:pt-[150px] pt-[110px]">
                        <h2 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl font-bold capitalize">{heading}</h2>
                        <div className=" mt-3 flex items-center gap-2 text-[16px] sm:text-[14px] md:text-[18px] font-semibold">
                            <IoHome className="text-primary"/>
                            <Link href={'/'} className="text-primary capitalize cursor-pointer">{i18n?.t('Home')}</Link>
                            <FaAngleRight />
                            <p className='capitalize'>{subHeading}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BasicBar;
