"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { HiOutlineIdentification } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useI18n } from '../../providers/i18n';

const ProfileBanner = ({ tab, setTab, info_link, pass_link }) => {
    const i18n = useI18n()
    const path = usePathname()
    const pathSplit = path.split('/')
    const pathName = pathSplit[pathSplit.length - 1]
    setTab(pathName)
    return (
        <div className=' p-4 flex justify-center '>
            <div className='mt-5 mb-5 flex gap-10'>
                <Link href={info_link}>
                    <div onClick={() => setTab('profile')} className='group flex cursor-pointer items-center gap-x-4'>
                        <div className={` group-hover:bg-primary group-hover:text-white ${tab === 'profile' && 'bg-primary text-white'} w-fit rounded-full text-primary p-3 shadow-[0px_0px_20px_0px_#0000001A]`}>
                            <HiOutlineIdentification size={36} />
                        </div>
                        <p className={`text-base font-medium text-content_tertiary group-hover:text-primary ${tab === 'profile' && '!text-primary'}`}>{i18n?.t('Basic Information')}</p>
                    </div>
                </Link>
                <Link href={pass_link}>
                    <div onClick={() => setTab('change-password')} className='group flex cursor-pointer items-center gap-x-4'>
                        <div className={` group-hover:bg-primary group-hover:text-white ${tab === 'change-password' && 'bg-primary text-white'} w-fit rounded-full text-primary p-3 shadow-[0px_0px_20px_0px_#0000001A]`}>
                            <RiLockPasswordLine size={36} />
                        </div>
                        <p className={`text-base font-medium text-content_tertiary group-hover:text-primary ${tab === 'change-password' && '!text-primary'}`}>{i18n?.t('Change Password')}</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default ProfileBanner