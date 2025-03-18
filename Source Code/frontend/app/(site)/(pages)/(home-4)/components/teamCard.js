import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { useI18n } from '../../../../providers/i18n';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';


const ExpartCard = ({ team }) => {
    const i18n = useI18n();
    const { push } = useRouter();
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
            className='group overflow-hidden rounded-[10px] group font-poppins animated-border box-shadow border bg-white hover:md:scale-110 duration-500 pb-6'>
            <div className='relative h-[290px] w-full bg-gray-200 '>
                <Image
                    src={team?.image}
                    alt='team'
                    width={800}
                    height={400}
                    className=' w-full h-full object-fill transition-all duration-500 absolute '
                />
                <div className='absolute w-full h-full bg-primary/70 lg:p-6 p-4 text-white -left-[350px] group-hover:left-0 duration-500 '>
                    <h1 className='text-lg font-semibold text-center pb-2 border-b border-white'>{i18n?.t('Trainer Info')}</h1>
                    <div className='mt-4 space-y-1'>
                        <h1 className='text-sm font-semibold flex items-center gap-2'>Name: <span className='text-sm font-normal line-clamp-1 capitalize'>{team?.name}</span>
                        </h1>
                        <h1 className='text-sm font-semibold flex items-center gap-2'>Email: <Link href={`mailto:${team?.email}`} className='text-sm font-normal line-clamp-1 hover:underline'>{team?.email}</Link>
                        </h1>
                        <h1 className='text-sm font-semibold flex items-center gap-2 '>Occupation: <span className='text-sm font-normal line-clamp-1 capitalize'>{team?.occupation}</span>
                        </h1>
                        <h1 className='text-sm font-semibold flex items-center gap-2'>Role: <span className='text-sm font-normal line-clamp-1 capitalize'>{team?.role}</span>
                        </h1>
                        <h1 className='text-sm font-semibold flex items-center gap-2 line-clamp-1'>Date of Birth: <span className='text-sm font-normal line-clamp-1 '>{dayjs(team?.dob)?.format('DD MMM YYYY')}</span>
                        </h1>
                    </div>
                </div>
            </div>
            <div className='lg:px-6 px-4 flex  items-center justify-between mt-4 duration-500'>
                <div className='flex flex-col gap-3'>
                    <h1 onClick={() => push(`/trainers/view/${team?._id}`)} className='text-lg font-medium hover:underline cursor-pointer'>{team?.name}</h1>
                    <h3 className='text-base '>{i18n.t('gym instractor')}</h3>
                </div>

                <motion.div
                    // whileHover={{ x: 5 }} 
                    // transition={{ type: "spring", stiffness: 300 }}
                >
                    <FaArrowRight
                        onClick={() => push(`/trainers/view/${team?._id}`)}
                        size={24}
                        className='cursor-pointer hover:scale-110'
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ExpartCard;
