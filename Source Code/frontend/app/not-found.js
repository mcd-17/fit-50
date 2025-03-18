import React from 'react'
import BasicBar from '../components/common/basic-bar'

import Image from 'next/image'
import Button from '../components/common/button'
import Link from 'next/link'


export default function NotFound() {
  return (
    <div>
      <BasicBar heading={'page not found'} subHeading={'page not found'} />
      <div className="container flex flex-col justify-center items-center lg:py-[140px] sm:py-[100px] py-[50px]">
        <h1 className='profileHeading text-center'>Whoops! That page doesn't exist.</h1>
        <Image src="/404.png" alt="404" width={740} height={594} />
        <h2 className='feturetitle lg:mt-[64px] mt-7 lg:mb-[50px] mb-7 text-textBody'>The page you requested could not be found</h2>
        <Button className='bg-primary text-white'>
        <Link href="/">
        back to home
        </Link>
        </Button>  
      </div>
    </div>
  )
}
