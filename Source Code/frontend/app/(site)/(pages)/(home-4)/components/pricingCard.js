'use client';
import Image from 'next/image';
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { message, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useI18n } from '../../../../providers/i18n';
import { useCurrency } from '../../../../contexts/site';
import UserContext from '../../../../contexts/user';
import Button from '../../../../../components/common/button';



const PricingCard = ({ data, activeTab }) => {
    const i18n = useI18n();
    const { push } = useRouter();
    const { user } = useContext(UserContext);
    const { currencySymbol, convertAmount } = useCurrency();
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    const handleButtonClick = () => {
        switch (user?.role) {
            case 'admin':
            case 'trainer':
                message.warning(i18n?.t('As a trainer or admin, You do not need to buy a subscription'));
                break;
            case 'user':
                const targetRoute = `/pricing-plan/${data?._id}?type=${activeTab}`;
                push(targetRoute);
                break;
            default:
                push('/signin');
        }
    };

    const slideUpZoomVariant = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };

    const getRandomColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 80%, 50%)`;
    };

    const bannerColor = getRandomColor();

    return (
        <motion.div
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: true, amount: 0.3 }}
            // variants={slideUpZoomVariant}
            // transition={{ duration: 0.6, ease: "easeOut" }}
            className={`group overflow-hidden border shadow-custom-light transition-all duration-500 hover:md:scale-105 hover:lg:scale-110 rounded-t-[10px] text-white relative  `}
        >
            <div className='relative'>
                <div className='relative h-[160px] w-full '>
                    <Image src={'/start.png'} width={800} height={500} alt='star' className='w-full h-full absolute' />
                    <div className={`h-full w-full relative px-5`} style={{ backgroundColor: bannerColor }}>
                        <h1 className={`text-white  font-montserrat text-2xl font-bold capitalize text-center pt-10 md:text-[32px]`}>
                            {data?.name[i18n.langCode]}
                        </h1>
                    </div>
                </div>
                <div className='absolute bottom-0 w-full px-6 '>
                    <div className='w-full h-[100px] bg-white text-textMain p-6 relative !z-30 rounded-lg top-10 box-shadow flex flex-col justify-center items-center'>
                        <h1 className={`mt-2 text-center font-montserrat text-2xl font-bold text-textMain md:text-2xl`}>
                            {currencySymbol}{activeTab === 'monthly' ? convertAmount(data?.monthly_price) : convertAmount(data?.yearly_price)}/<span className='capitalize md:text-base'>{activeTab === 'monthly' ? i18n?.t('month') : i18n?.t('year')}</span>
                        </h1>
                    </div>
                </div>
            </div>
            <div className='py-5 relative pt-[70px] w-full px-6'>
                <ul className={`list-none font-poppins font-normal capitalize text-textBody md:text-[20px] `}>
                    {data?.features?.slice(0, showAllFeatures ? data.features.length : 4).map((item, index) => (
                        <li
                            key={index}
                            className='relative flex items-center gap-2 mb-2 '
                        >
                            <FaCheckCircle className="text-primary min-w-5 min-h-5" />
                            <Tooltip title={item[i18n.langCode]}>
                                <span className='line-clamp-1'>
                                    {item[i18n.langCode]}
                                </span>
                            </Tooltip>

                        </li>
                    ))}
                </ul>
                {
                    data?.features?.length > 4 ? (
                        <button
                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                            className={`text-textMain hover:text-primary font-medium hover:underline mt-2 `}
                        >
                            {showAllFeatures ? i18n?.t('Show Less') : i18n?.t('Show More')}
                        </button>
                    ) : (
                        <div className='h-8'>

                        </div>
                    )
                }
                <div className='mt-6   '>
                    <Button className='!w-full rounded-[40px]' onClick={handleButtonClick}>{i18n?.t('Get Started')}</Button>
                </div>
            </div>

        </motion.div>
    );
};

export default PricingCard;

