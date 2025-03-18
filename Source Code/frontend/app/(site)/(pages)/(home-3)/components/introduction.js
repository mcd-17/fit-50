'use client';
import Image from 'next/image';
import { useI18n } from '../../../../providers/i18n';
import { useFetch } from '../../../../helpers/hooks';
import { fetchSinglePage } from '../../../../helpers/backend';
import { motion } from 'framer-motion';

const Introduction = ({ data , company}) => {
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

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className='lg:mb-[120px] mb-[60px] lg:mt-[240px] mt-[120px] overflow-hidden  '>
            <div className='container bg-black p-1 h-fit text-white overflow-hidden   '>
                <div className='flex w-full flex-col justify-between lg:flex-row gap-10 lg:gap-0'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.3 }}
                        variants={leftToRightVariant}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className='lg:min-w-[30%] h-fit  '>
                        <h1 className='font-montserrat text-xl'>{i18n?.t('Introduction')}</h1>
                        <div className='mt-6 '>
                            {
                                <Image
                                    src={data?.introduction_logo[0]?.url || data?.introduction_logo}
                                    alt='introduction'
                                    width={240}
                                    height={60}
                                    className='w-60 max-w-full'
                                />
                            }
                        </div>
                        <div className='mt-3 lg:block hidden'>
                            <Image
                                src={data?.introduction_image[0]?.url || data?.introduction_image}
                                alt='introduction'
                                width={500}
                                height={600}
                                className='max-w-full h-[475px]'
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.3 }}
                        variants={rightToLeftVariant}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className='md:ml-5 lg:ml-10 h-fit'>
                        <div className=' w-full grid md:grid-cols-2 grid-cols-1 gap-[72px]  text-white '>
                            <div className=' md:w-full w-full mx-auto smwidth '>
                                <div className='relative '>
                                    <div className='bg-black h-[257px] w-full relative z-20 rounded-[6px] -hidden mission '>
                                        <Image
                                            src={sections[0].image}
                                            alt='introduction'
                                            width={1000}
                                            height={1000}
                                            className='w-full h-full object-fill '
                                        />
                                    </div>
                                    <div className='bg-primary rounded-[10px] w-[238px] h-[122px] absolute -top-[4px] -right-[4px] -z-[20px]'></div>

                                    <div className='lg:left- absolute -bottom-2 left-0 lg:-bottom-1 z-40'>
                                        <h1 className='relative text-xl font-semibold'>
                                            <span className='absolute inset-0 mt-3.5 h-[10px] bg-[#e29624] blur-[10px]'></span>
                                            <span className='relative z-20 font-montserrat'>
                                                {sections[0].title}
                                            </span>
                                        </h1>
                                    </div>
                                </div>
                                <div className='mt-5 flex flex-col'>
                                    <h1 className='line-clamp-3  font-poppins'>
                                        {descrptionLimit(sections[0].description)}
                                    </h1>
                                </div>
                            </div>
                            <div className='md:w-full w-full mx-auto smwidth'>
                                <div className='relative mr-2 '>
                                    <div className='bg-black h-[257px] w-full relative z-20 rounded-[6px] overflow-hidden story  '>
                                        <Image
                                            src={sections[1].image}
                                            alt='section image'
                                            width={424}
                                            height={257}
                                            className='w-full h-full object-contain '
                                        />
                                    </div>
                                    <div className='bg-primary rounded-[10px] w-[238px] h-[122px] absolute -top-[4px] -right-[4px] -z-[20px]'></div>

                                    <div className='absolute -bottom-1 -left-1'>
                                        <h1 className='relative text-xl font-semibold'>
                                            <span className='absolute inset-0 mt-3.5 h-[15px] rotate-90 bg-[#e29624] blur-[10px]'></span>
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
                                <div className='mt-5 flex flex-col'>
                                    <h1 className='line-clamp-5 font-poppins'>
                                        {descrptionLimit(sections[0].description)}
                                    </h1>

                                </div>
                            </div>
                        </div>
                        <div className='mt-[50px] flex w-full flex-col items-center gap-12 md:flex-row'>
                            <div>
                                <div className='mt-5 flex max-w-[424px] flex-col'>
                                    <h1 className='line-clamp-4  font-poppins'>
                                        {descrptionLimit(sections[2].description)}
                                    </h1>
                                </div>
                            </div>
                            <div className=' relative '>
                                <div className='relative  '>
                                    <div className='bg-black sm:h-full h-[180px] xl:w-[480px] lg:w-[380px]  sm:w-[400px] overflow-hidden w-[300px] smwidth relative z-20 rounded-[6px] approch right-1 '>
                                        <Image
                                            src={sections[2].image}
                                            alt='approch'
                                            width={424}
                                            height={257}
                                            className='w-full h-full  '
                                        />
                                    </div>
                                    <div className='bg-primary rounded-[10px] w-[238px] h-[122px] absolute -bottom-[4px] right-[0px] -z-[20px]'></div>
                                </div>
                                <div className='absolute left-0 top-0'>
                                    <h1 className='relative text-xl font-semibold'>
                                        <span className='absolute inset-0 mt-3.5 h-[10px] bg-[#e29624] blur-[10px]'></span>
                                        <span className='relative z-10 font-montserrat'>
                                            {sections[2].title}
                                        </span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3 }}
                variants={rightToLeftVariant}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='overflow-x-scroll lg:overflow-x-hidden'>
                <div className='container grid grid-cols-5 mt-[60px] items-center w-[970px] lg:w-full '>
                    {
                        company?.content?.company_details?.images?.map((image, index) => (
                            <div>
                                <Image
                                    key={index}
                                    src={image}
                                    alt={image}
                                    width={424}
                                    height={257}
                                    className='lg:w-[150px] lg:h-[90px] w-[120px] h-[80] mx-auto'
                                />
                            </div>
                        ))
                    }
                </div>
            </motion.div>
        </div>
    );
};

export default Introduction;
