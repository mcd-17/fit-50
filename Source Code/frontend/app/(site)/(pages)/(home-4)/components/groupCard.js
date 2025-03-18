'use client'
import React from 'react';

import Image from 'next/image';
import { GoArrowRight } from 'react-icons/go';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../providers/i18n';

const GroupCard = ({ group }) => {
    const i18n = useI18n();
    const { push } = useRouter()

    const slideUpZoomVariant = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
    };
    return (
        <motion.div
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: true, amount: 0.3 }}
            // variants={slideUpZoomVariant}
            // transition={{ duration: 0.6, ease: "easeOut" }}
            className='box-shadow group relative rounded-[1rem] overflow-hidden transform group duration-500 bg-white pb-16  shadow-custom-light hover:bg-primary hover:text-white' 
        >
            <div className='flex items-center md:gap-4 gap-3'>
                <div className='transform overflow-hidden h-[160px] w-full'>
                    {group?.image ? (
                        <Image
                            src={group?.image}
                            alt='group'
                            width={1000}
                            height={1000}
                            className='h-full w-full rounded-t-[1rem]'
                        />
                    ) : (
                        <Image
                            src='/groupuser.png'
                            alt='group'
                            width={1000}
                            height={1000}
                            className='h-[50px] w-[50px] rounded-t-[1rem]'
                        />
                    )}
                </div>

            </div>
            <div className='sm:px-6 px-3'>
                <h4 className='service-heading !text-start mt-4 ml-1 group-hover:text-white text-textMain !line-clamp-1 '>
                    {group?.name[i18n.langCode]}
                </h4>
                {group?.facilities?.length > 0 && (
                    <ul className='my-4 h-[80px]'>
                        {group.facilities.slice(0, 3).map((facility, index) => (
                            <li
                                key={index}
                                className='flex w-full items-center gap-2 font-poppins group-hover:text-white text-textMain'
                            >
                                <FaCheckCircle size={16} className='text-primary group-hover:text-white basis-7 !text-base' />
                                <span className='line-clamp-1 w-full blogdescription'>{facility[i18n.langCode]}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <button onClick={() => push(`/group/${group?._id}`)}
                    className='absolute bottom-1 left-6 my-6 flex w-fit items-center gap-2'
                >
                    <p className='service-description group-hover:text-white text-textMain'>
                        {i18n?.t('Read More')}
                    </p>
                    <GoArrowRight size={20} className='group-hover:text-white text-textMain' />
                </button>
            </div>
        </motion.div>
    );
};

export default GroupCard;
