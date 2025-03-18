import React from 'react';
import { useI18n } from '../../app/providers/i18n';
import Image from 'next/image';
import { GoArrowRight } from 'react-icons/go';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useUser } from '../../app/contexts/user';
import { useRouter } from 'next/navigation';

const GroupCard = ({ group }) => {
    const i18n = useI18n();
    const {push} = useRouter()

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
            className='box-shadow group relative transform rounded group duration-500 bg-white  p-6 pb-16 shadow-custom-light hover:text-white hover:scale-105 hover:bg-primary'
        >
            <div className='flex items-center md:gap-4 gap-3'>
                <div className=' rounded-[1rem] group-hover:rounded-full transform overflow-hidden  h-[140px] w-full'>
                    {group?.image ? (
                        <Image
                            src={group?.image}
                            alt='group'
                            width={1000}
                            height={1000}
                            className='h-full w-full rounded-[1rem] group-hover:rounded-[3rem]:'
                        />
                    ) : (
                        <Image
                            src='/groupuser.png'
                            alt='group'
                            width={1000}
                            height={1000}
                            className='h-[50px] w-[50px] rounded-[3rem]'
                        />
                    )}
                </div>

            </div>
            <h4 className='service-heading !text-start mt-4 ml-1 group-hover:text-white text-textMain '>
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
        </motion.div>
    );
};

export default GroupCard;
