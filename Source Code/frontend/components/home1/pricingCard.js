'use client';
import Image from 'next/image';
import React, { useState, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Button from '../common/button';
import { useI18n } from '../../app/providers/i18n';
import UserContext from '../../app/contexts/user';
import { message, Tooltip } from 'antd';
import { useCurrency } from '../../app/contexts/site';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const PricingCard = ({ data, activeTab }) => {
    const i18n = useI18n();
    const { push } = useRouter();
    const { user } = useContext(UserContext);
    const { currencySymbol, convertAmount, findDefaultTheme } = useCurrency();
    const pathName = usePathname();
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

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUpZoomVariant}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`group rounded-md overflow-hidden border shadow-custom-light transition-all duration-500 hover:md:scale-105 hover:lg:scale-110 relative pb-12 ${findDefaultTheme?.name === 'home3' && pathName === "/" && '!text-white'}`}
        >
            <div className="h-[235px]">
                <Image src={data?.image} width={524} height={270} alt='images' className='w-full h-full' />
            </div>
            <div className='p-6'>
                <h1 className={`text-secondary font-montserrat text-2xl font-bold capitalize text-textMain md:text-[32px] ${findDefaultTheme?.name === 'home3' && pathName === "/" && 'text-white'}`}>
                    {data?.name[i18n.langCode]}
                </h1>
                <h1 className={`mt-2 text-secondary font-montserrat text-2xl font-bold text-textMain md:text-[26px] ${findDefaultTheme?.name === 'home3' && pathName === "/" && 'text-white'}`}>
                    {currencySymbol}{activeTab === 'monthly' ? convertAmount(data?.monthly_price) : convertAmount(data?.yearly_price)}
                </h1>
                <div className='py-5 mb-6'>
                    <ul className={`list-none font-poppins font-normal capitalize text-textBody md:text-[20px] ${findDefaultTheme?.name === 'home3' && pathName === "/" && '!text-gray-200'}`}>
                        {data?.features?.slice(0, showAllFeatures ? data.features.length : 4).map((item, index) => (
                            <li
                                key={index}
                                className='relative flex items-center gap-2 mb-2'
                            >
                                <FaCheckCircle className="text-primary min-w-5 min-h-5" />
                                <Tooltip title={item[i18n.langCode]}>
                                    <span className='line-clamp-1'>{item[i18n.langCode]}</span>
                                </Tooltip>
                            </li>
                        ))}
                    </ul>
                    {

                        data?.features?.length > 4 ? (
                            <button
                                onClick={() => setShowAllFeatures(!showAllFeatures)}
                                className={`text-textMain hover:text-primary font-medium hover:underline mt-2 ${findDefaultTheme?.name === 'home3' && pathName === "/" && 'text-white'}`}
                            >
                                {showAllFeatures ? i18n?.t('Show Less') : i18n?.t('Show More')}
                            </button>
                        ) : (
                            <div className='h-8'>

                            </div>
                        )

                    }
                    <div className='mx-auto mt-6 absolute bottom-6 left-6'>
                        <Button pathName={findDefaultTheme?.name} onClick={handleButtonClick}>{i18n?.t('Get Started')}</Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PricingCard;
