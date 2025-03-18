"use client"
import React, { useState } from 'react'          
import ProfileBanner from '../../components/profile-banner'

const Layout = ({ children }) => {
    const [tab, setTab] = useState('profile')
    return (
        <div>
            <ProfileBanner tab={tab} setTab={setTab} info_link={'/admin/profile'} pass_link={'/admin/profile/change-password'}></ProfileBanner>
            <div className=''>{children}</div>
        </div>
    )
}

export default Layout