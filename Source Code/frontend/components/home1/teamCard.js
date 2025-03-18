import Image from 'next/image';
import Link from 'next/link';
import React, {useState } from 'react';
import { FaFacebook, FaLinkedin, FaShareAlt } from 'react-icons/fa';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';


const ExpartCard = ({ team }) => {
    const [isHovered, setIsHovered] = useState(false);
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
            className='group  rounded border-[1px] border-gray-200  bg-white  hover:md:scale-110 duration-500'>
            <div className='shape relative sm:h-[380px] h-[318px]  bg-gray-200 '>
                <Image
                    src={team?.image}
                    alt='team'
                    width={1000}
                    height={400}
                    className='h-full w-full object-cover transition-all duration-300'
                />
                <div
                    className={`absolute bottom-0 left-0 h-[50%] w-full bg-gradient-to-t from-[#E67529] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100`}
                />
            </div>
            <div className='relative flex flex-col justify-between bg-white p-6'>
                <div className=' pt-5'>
                    <Link
                        href={`/trainers/view/${team?._id}`}
                        className='cardHeading text-textMain capitalize transition-colors duration-300 group-hover:text-[#E67529]'
                    >
                        {team?.name}
                    </Link>
                    <p className='mt-4 capitalize description text-textBody transition-colors duration-300'>
                        {team?.role}
                    </p>
                </div>
                <div
                    className='relative flex items-center justify-center rounded-lg'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        className={`absolute sm:bottom-[100px] bottom-[94px] sm:left-[57.5px] left-[48px] cursor-pointer bg-[#333333] p-4 sm:p-5 text-white transition-all duration-300 ${isHovered ? 'rounded-full' : 'rounded-full'} `}
                    >
                        {isHovered ? (
                            <div className='flex flex-col gap-7'>
                                <Link
                                    href={team?.instagram || ''}
                                    target={'_blank'}
                                    className='hover:text-[#E67529]'
                                >
                                    <FaInstagram size={30} />
                                </Link>
                                <Link
                                    href={team?.linkedin || ''}
                                    target={'_blank'}
                                    className='hover:text-[#E67529]'
                                >
                                    <FaLinkedin size={30} />
                                </Link>
                                <Link
                                    href={team?.twitter || ''}
                                    target={'_blank'}
                                    className='hover:text-[#E67529]'
                                >
                                    <FaXTwitter size={30} />
                                </Link>
                                <Link
                                    href={team?.facebook || ''}
                                    target='_blank'
                                    className='hover:text-[#E67529]'
                                >
                                    <FaFacebook size={30} />
                                </Link>
                            </div>
                        ) : (
                            <FaShareAlt size={30} />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ExpartCard;
