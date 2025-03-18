'use client'
import { Badge, Dropdown, Popover, Select, Space, message as antMessage } from "antd";
import { FaBars } from "react-icons/fa";
import { FiLock, FiLogOut, FiUser } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/user"
import Link from "next/link";
import { ImExit } from "react-icons/im";
import { useCurrency } from "../../../contexts/site";
import { useI18n } from "../../../providers/i18n";
import NotificationDropdown from "../common/notification";
import { fetchAdminNotification } from "../../../helpers/backend";
import { initializeSocket } from "../../../helpers/socket";
import { IoMdNotifications } from "react-icons/io";
import { useFetch } from "../../../helpers/hooks";
import Image from "next/image";


const Header = () => {
    const { user } = useUser()
    const i18n = useI18n()
    const router = useRouter()
    const { currencies, changeCurrency, currency } = useCurrency();
    const [limit, setLimit] = useState(5);
    const [notifications, getNotifications] = useFetch(fetchAdminNotification, { limit: limit })

    const [defaultLang, setDefaultLang] = useState(null);
    const [lang, setLangId] = useState(null);

    useEffect(() => {
        const socket = initializeSocket()
        socket.on("newNotification", (message) => {
            antMessage.info(message?.notification?.title)
            getNotifications()
        });
        return () => {
            socket.off("newNotification");
        };
    }, [])
    useEffect(() => {
        let langId = localStorage.getItem('lang');
        setLangId(langId);
        if (langId) {
            let findLang = i18n?.languages?.docs.find(lang => lang?._id === langId);
            if (findLang) {
                setDefaultLang(findLang?.name);
            }
        } else {
            if (i18n?.languages?.docs?.length > 0) {
                const defaultLanguage = i18n?.languages?.docs.find(lang => lang?.default);
                setDefaultLang(defaultLanguage?.name || i18n.languages.docs[0]?.name);
            }
        }
        let currency = localStorage.getItem('currency');
        if (currency) {
            changeCurrency(currency);
        } else {
            changeCurrency(currencies[0]?.code);
        }
    }, [i18n?.languages?.docs]);

    if (!defaultLang) {
        return null;
    }

    const handleLogout = () => {
        try {
            localStorage.removeItem('token')
            antMessage.success('Logged out successfully')
            window.location.href = '/signin'

        } catch (error) {
            console.log(error)
        }
    }

    const handleProfile = () => {
        router.push('/admin/profile')
    }

    const handleChangePassword = () => {
        router.push('/admin/profile/change-password')
    }

    const items = [
        {
            label: i18n?.t('Profile'),
            icon: <FiUser />,
            key: '1',
            onClick: handleProfile,
        },
        {
            label: i18n?.t('Change Password'),
            icon: <FiLock />,
            key: '2',
            onClick: handleChangePassword,
        },
        {
            label: i18n?.t('Logout'),
            icon: <FiLogOut />,
            key: '3',
            onClick: handleLogout,
        }
    ];
    const findUnreadNotifications = notifications?.docs?.filter(notice => notice?.isRead === false);
    return (
        <header className="header z-10">
            {
                <div className="flex justify-between items-center h-full p-4">
                    <div className="">
                        <FaBars
                            className="md:hidden"
                            role="button"
                            onClick={() => {
                                window.document.querySelector('.sidebar').classList.toggle('open')
                                window.document.querySelector('.sidebar-overlay').classList.toggle('open')
                            }}
                        />
                    </div>

                    <div className="flex items-center sm:gap-x-6 gap-x-3 notification-popover">
                        <div className="flex items-center gap-3">
                            <Image onClick={() => router.push('/admin/message')} src="/messageIcon.gif" width={40} height={40} alt="logo" className="cursor-pointer h-6 w-7 object-contain" />
                            <Popover
                                content={<NotificationDropdown setLimit={setLimit} limit={limit} notices={notifications} getNotifications={getNotifications} />}
                                trigger="click"
                                placement="bottomRight"
                                overlayStyle={{ padding: 0 }} // Removes padding around the content
                            >
                                <Badge count={findUnreadNotifications?.length || 0}>
                                    <IoMdNotifications className="cursor-pointer" size={24} />
                                </Badge>
                            </Popover>
                            <Link href="/" target="_blank" className="flex items-center gap-1 hover:text-primary">
                                <ImExit />
                                <p className="whitespace-pre">{i18n?.t('Live Site')}</p>
                            </Link>
                        </div>

                        <div>
                            <Select
                                defaultValue={defaultLang}
                                style={{ width: 100, color: 'black' }}
                                bordered={false}
                                onChange={(value) => {
                                    i18n.changeLanguage(value);
                                }}
                                options={i18n?.languages?.docs?.map(lang => ({ value: lang?._id, label: lang?.name }))}
                                className='inline-flex items-center justify-center textSelectWhite capitalize'
                            />
                        </div>

                        <Dropdown
                            menu={{
                                items,
                            }}
                        >
                            <a className=" flex items-center">
                                <Space className="">
                                    {user && <span className="cursor-pointer hidden sm:block">{user?.name}</span>}
                                    <BiUser className="cursor-pointer" size={20} />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </div>
            }

        </header>
    )
}

export default Header

