import React from 'react';
import { useI18n } from '../../app/providers/i18n';
import Image from 'next/image';
import { GoArrowRight } from 'react-icons/go';
import Link from 'next/link';
import { columnFormatter } from '../../app/helpers/utils';
import { motion } from 'framer-motion';

const ServiceCard = ({ service }) => {
    const i18n = useI18n();


    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: false, amount: 0.3 }}
            className='shadow-custom-light bg-white hover:bg-primary duration-500 group rounded p-6 transition-transform transform hover:scale-105 box-shadow'
        >
            <div className='flex items-center gap-4 mb-[30px]'>
                <div
                    className=' w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-custom-light bg-white'
                    style={{ filter: 'drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.10))' }}
                >
                    <div className='flex items-center justify-center p-3'>
                        <Image
                            src={service?.icon}
                            width={32}
                            height={32}
                            alt={'Feature image'}
                            className='object-contain w-[32px]'
                        />
                    </div>
                </div>
                <h4 className='service-heading text-textMain group-hover:text-white'>{columnFormatter(service?.name)}</h4>
            </div>
            <p className='mt-2 description text-textMain group-hover:text-white line-clamp-3'>{columnFormatter(service?.description)}</p>
            <Link href={`/services/details/${service?._id}`} className='mt-6 flex gap-2 items-center w-fit'>
                <p className='service-description text-textMain group-hover:text-white'>{i18n?.t('Read More')}</p>
                <GoArrowRight className='text-xl group-hover:text-white' />
            </Link>
        </motion.div>
    );
};

export default ServiceCard;
