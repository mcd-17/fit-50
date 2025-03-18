import React from 'react';
import { Flex, Rate } from 'antd';
import Image from 'next/image';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';

const TestimonialCard= ({ allreview }) => {
    const i18n = useI18n();
    const {findDefaultTheme} = useCurrency()
    
    return (
        <div>
            <div className='relative duration-700 pb-7 hover:scale-105 '>
                <Image src={'/reviewbg.png'} alt='testi' width={500} height={300} className='absolute w-full h-full ' />
                <div className='relative '>
                    <div className='rounded testimonial-shape p-10 z-40 relative h-[280px]'>
                        <div className='mb-6 '>
                            <Flex gap="middle" vertical>
                                <Rate className='text-primary' defaultValue={allreview?.rating} disabled />
                            </Flex>
                        </div>
                        <p className='description line-clamp-5 text-textMain !font-poppins capitalize'>{allreview?.description}</p>
                    </div>
                </div>
            </div>
            <div className=' mt-4 ps-10 space-y-2'>
                <h1 className={`fetureHeading font-medium ${findDefaultTheme?.name==="home3" ? 'text-white':'text-primary'} line-clamp-1`}>{allreview?.user?.name ? allreview?.user?.name : 'Anonymous'}</h1>
                <p className={`text-[#534C4C] text-lg line-clamp-1 cardDescription ${findDefaultTheme?.name === 'home3' ? 'text-primary' : ''}`}>{i18n?.t('Member')}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;