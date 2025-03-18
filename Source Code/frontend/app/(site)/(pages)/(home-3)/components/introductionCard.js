'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useI18n } from '../../../../providers/i18n';

const IntroductionCard = ({ data }) => {
    const i18n = useI18n();
    const sections = [
        {
            title: data?.mission?.text[i18n.langCode],
            image: data?.mission?.image[0]?.url || data?.mission?.image,
            description: data?.mission?.description[i18n.langCode],
        },
        {
            title: data?.story?.text[i18n.langCode],
            image: data?.story?.image[0]?.url || data?.story?.image,
            description: data?.story?.description[i18n.langCode],
        },
        {
            title: data?.approach?.text[i18n.langCode],
            image: data?.approach?.image[0]?.url || data?.approach?.image,
            description: data?.approach?.description[i18n.langCode],
        },
    ];
    function descrptionLimit(text) {
        const limitedText = text?.split(' ').slice(0, 20).join(' ') + '...';
        return limitedText;
    }

    return (
        <div className='container bg-black py-[150px]'>
            <div className='grid grid-cols-1 gap-[50px] md:grid-cols-1 xl:grid-cols-3 xl:gap-0'>
                <div className='flex flex-col items-center xl:items-start'>
                    <h5 className='heading-5 pb-[2px]'>Introduction</h5>
                    <Image
                        src={data?.introduction_logo[0]?.url || data?.introduction_logo}
                        width={347}
                        height={77}
                        className='h-[77px] w-auto object-fill md:w-[347px]'
                        alt='image'
                    />
                    <div className='relative h-[500px]'>
                        <Image
                            src={data?.introduction_image[0]?.url || data?.introduction_image}
                            width={360}
                            height={500}
                            className='h-full w-full sm:w-[360px]'
                            alt='bodyBuilder'
                        />
                        <Image
                            src='/vector.png'
                            width={128}
                            height={17}
                            alt='gym'
                            className='absolute bottom-0 left-0 h-[17px] w-[128px] object-fill'
                        />
                    </div>
                </div>
                <div className='col-span-1 flex flex-col items-center md:col-span-2 xl:items-start'>
                    <div className='mb-[50px] flex flex-col justify-start gap-[40px] md:flex-row md:justify-between xl:justify-start xl:gap-[76px]'>
                        <div className='group relative max-w-[424px]'>
                            <div className='relative z-20 h-[257px] w-full'>
                                <div className='h-[257px] w-full'>
                                    <Image
                                        alt='image'
                                        src={sections[0].image}
                                        className='mission h-full w-full rounded-[4px] bg-black object-fill'
                                        width={424}
                                        height={257}
                                    />
                                </div>
                                <div className='lg:left- absolute -bottom-2 left-0 text-white lg:-bottom-1'>
                                    <h1 className='relative pe-[8px] ps-[8px] text-xl font-semibold'>
                                        <span className='absolute inset-0 mt-3.5 h-[10px] bg-[#e29624] blur-[10px]'></span>
                                        <span className='relative z-20 font-montserrat'>
                                            {' '}
                                            {sections[0].title}
                                        </span>
                                    </h1>
                                </div>
                            </div>
                            <div className='para1 mt-[20px] line-clamp-3 h-[100px] text-[#EBEDF9] xl:h-[81px]'>
                                {descrptionLimit(sections[0].description)}

                                <Link
                                    href='/about'
                                    className='absolute bottom-0 right-0 flex cursor-pointer items-center justify-end gap-2 text-primary lg:-mt-6'
                                >
                                    Read More <FaArrowRightLong />
                                </Link>
                            </div>

                            <div
                                className={`card absolute right-[-3px] top-[-3px] z-0 h-[122px] w-[238px] transform rounded-[4px] opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100`}
                            ></div>
                        </div>
                        <div className='group relative max-w-[424px]'>
                            <div className='relative z-20 h-[257px] w-full'>
                                <div className='h-[257px] w-full'>
                                    <Image
                                        alt='image'
                                        src={sections[1].image}
                                        className='story h-full w-full rounded-[4px] bg-black object-fill'
                                        width={424}
                                        height={257}
                                    />
                                </div>
                                <div className='absolute -bottom-1 -left-1'>
                                    <h1 className='relative text-xl font-semibold text-white'>
                                        <span className='absolute inset-0 mt-3.5 h-[15px] bg-[#e29624] blur-[10px]'></span>
                                        <span
                                            className='relative z-10 font-montserrat'
                                            style={{
                                                writingMode: 'vertical-rl',
                                                transform: 'rotate(180deg)',
                                            }}
                                        >
                                            {sections[1].title}
                                        </span>
                                    </h1>
                                </div>
                            </div>
                            <div className='para1 mt-[20px] line-clamp-3 h-[81px] text-[#EBEDF9]'>
                                {descrptionLimit(sections[1].description)}{' '}
                                <Link
                                    href='/about'
                                    className='absolute bottom-0 right-0 flex cursor-pointer items-center justify-end gap-2 text-primary lg:-mt-6'
                                >
                                    Read More <FaArrowRightLong />
                                </Link>
                            </div>
                            <div
                                className={`card absolute right-[-3px] top-[-3px] z-0 h-[122px] w-[238px] transform rounded-[4px] opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100`}
                            ></div>
                        </div>
                    </div>
                    <div className='flex flex-col items-start gap-[76px] md:flex-row lg:items-start'>
                        <div className='group relative max-w-[402px]'>
                            <div className='para1 mt-[20px] line-clamp-3 h-[81px] text-[#EBEDF9]'>
                                {descrptionLimit(sections[2].description)}
                                <Link
                                    href='/about'
                                    className='absolute bottom-0 right-0 flex cursor-pointer items-center justify-end gap-2 text-primary lg:-mt-6'
                                >
                                    Read More <FaArrowRightLong />
                                </Link>
                            </div>
                        </div>
                        <div className='group relative h-[221px] w-full sm:w-[512px]'>
                            <div className='relative z-20 h-[221px] w-full'>
                                <div className='h-full w-full'>
                                    <Image
                                        alt='image'
                                        src={sections[2].image}
                                        className='approch h-full w-full rounded-[4px] bg-black object-fill'
                                        width={512}
                                        height={221}
                                    />
                                </div>
                                <div className='absolute -left-1 -top-1'>
                                    <h1 className='relative text-xl font-semibold text-white'>
                                        <span className='absolute inset-0 mt-3.5 h-[15px] bg-[#e29624] blur-[10px]'></span>
                                        <span className='relative z-10 font-montserrat'>
                                            {sections[2].title}{' '}
                                        </span>
                                    </h1>
                                </div>
                            </div>

                            <div
                                className={`card absolute bottom-[-4px] right-[-4px] z-0 h-[122px] w-[238px] transform rounded-[4px] opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100`}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroductionCard;
