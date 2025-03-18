"use client";
import { BiCalendarEvent, BiCategory, BiCreditCard } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuContact, LuGalleryHorizontal } from "react-icons/lu";
import { FaServicestack } from "react-icons/fa";
import { GrSchedulePlay } from "react-icons/gr";
import { CgGym } from "react-icons/cg";
import { CiShoppingTag } from "react-icons/ci";
import { PiContactlessPaymentFill, PiNewspaperClippingBold, PiQuotesThin, PiReadCvLogo } from "react-icons/pi"
import { FaBarcode, FaCopy, FaFeatherPointed, FaLanguage, FaQuestion, FaUsers, FaWrench } from "react-icons/fa6";
import { MdCategory, MdCurrencyPound, MdEmail, MdEmojiEvents, MdGroups2, MdManageHistory, MdOutlineInsertPageBreak, MdOutlineMarkEmailUnread, MdOutlinePriceChange, MdOutlineSpaceDashboard } from "react-icons/md";
import UserContext from "../../contexts/user";
import Sidebar from "../components/layout/sideBar";
import Header from "../components/layout/header";
import { fetchUser } from "../../helpers/backend";
import { IoSettingsOutline } from "react-icons/io5";
import { MdAttachEmail } from "react-icons/md";
import { InfinitySpin } from "react-loader-spinner";
import { SiAmazonsimpleemailservice } from "react-icons/si";

const Layout = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const push = router.push;
    const { pathname } = router;
    const menu = getMenu(user, push, pathname)

    useEffect(() => {
        fetchUser().then(({ error, data }) => {
            if (error === false && data?.role === "admin" || data?.role === "employee") {
                setUser(data);
            } else {
                router.push("/signin");
            }
        });
    }, []);

    if (!user) {
        return (
            <>
                <div className="flex justify-center items-center h-screen ">
                    <InfinitySpin width='140' color='#E67529' />
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {!!user && (
                <>
                    <UserContext.Provider value={user}>
                        <Sidebar title="Gymstick" menu={menu} />
                        <Header title="Gymstick" />
                        <div className="content">
                            <div className="p-4">{children}</div>
                        </div>
                    </UserContext.Provider>
                </>
            )}
        </div>
    );
};

export default Layout;

const menu = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: <MdOutlineSpaceDashboard />,
        permissions: ['admin', 'dashboard_view'],

    },
    {
        label: "Members",
        href: "/admin/users",
        icon: <FaUsers />,
        permissions: ['admin', 'user_list_view'],
    },
    {
        label: "Trainers",
        href: "/admin/trainers",
        icon: <BiCreditCard />,
        permissions: ['admin', 'trainers_view_view'],
    },
    {
        label: "Group",
        href: "/admin/group",
        icon: <MdGroups2 />,
        permissions: ['admin', 'group_view_view'],
    },
    {
        menu: "Subscription",
        permissions: ['admin', 'pricing_view_view'],
    },
    {
        label: "Subscription Plan",
        href: "/admin/pricing-plan",
        icon: <MdOutlinePriceChange />,
        permissions: ['admin', 'pricing_view_view'],

    },
    {
        label: "Subscription History",
        href: "/admin/pricing-history",
        icon: <MdManageHistory />,
        permissions: ['admin', 'subcription_view'],

    },
    {
        menu: "Products",
        permissions: ['admin', 'product_view'],
    },
    {
        label: "Category",
        href: "/admin/product/category",
        icon: <MdCategory />,
        permissions: ['admin', 'product_category_view_view'],

    },
    {
        label: "Products",
        href: "/admin/product",
        icon: <CgGym />,
        permissions: ['admin', 'product_view'],

    },
    {
        label: "Orders",
        href: "/admin/order",
        icon: <FaCopy />,
        permissions: ['admin', 'order_view'],
    },
    {
        label: "Coupon",
        href: "/admin/coupon",
        icon: <FaBarcode />,
        permissions: ['admin', 'coupon_view_view'],
    },
    {
        label: "Testimonial",
        href: "/admin/testimonial",
        icon: <PiQuotesThin />,
        permissions: ['admin', 'testimonial_view_view'],
    },
    {
        menu: "Marketing",
        permissions: ['admin', 'marketing_view'],
    },
    {
        label: "Email Options",
        href: "/admin/email-option",
        icon: <MdOutlineMarkEmailUnread />,
        permissions: ['admin', 'marketing-group_view'],
    },
    {
        label: "Manage Group",
        href: "/admin/marketing-group",
        icon: <SiAmazonsimpleemailservice />,
        permissions: ['admin', 'marketing-group_view'],
    },
    {
        label: "Email Settings",
        href: "/admin/marketing-settings",
        icon: <MdAttachEmail />,
        permissions: ['admin', 'marketing-settings_view'],
    },
    {
        menu: "HRM",
        permissions: ['admin', 'hrm_view'],
    },
    {
        label: "All Employee",
        href: "/admin/hrm/employee",
        icon: <FaUsers />,
        permissions: ['admin', 'employee_view_view'],
    },
    {
        label: "Roles & Permission",
        href: "/admin/hrm/roles",
        icon: <IoSettingsOutline />,
        permissions: ['admin', 'roles_view_view'],
    },
    {
        label: "Attendance",
        href: "/admin/attendance",
        icon: <BiCalendarEvent />,
        permissions: ['admin', 'roles_view_view'],
    },
    {
        label: "Attendance Settings",
        href: "/admin/attendance-settings",
        icon: <BiCalendarEvent />,
        permissions: ['admin', 'roles_view_view'],
    },
    {
        menu: "Blog",
        permissions: ['admin', 'blog_view'],
    },
    {
        label: "Category",
        href: "/admin/blog/category",
        icon: <BiCategory />,
        permissions: ['admin', 'blog_category_view_view'],
    },
    {
        label: "Tags",
        href: "/admin/blog/tags",
        icon: <CiShoppingTag />,
        permissions: ['admin', 'blog_tag_view_view'],
    },
    {
        label: "Blogs",
        href: "/admin/blog",
        icon: <PiReadCvLogo />,
        permissions: ['admin', 'blogs_view_view'],
    },
    {
        menu: "Others",
        permissions: ['admin', 'settings_view'],
    },
    {
        label: "Schedule",
        href: "/admin/sehedule",
        icon: <GrSchedulePlay />,
        permissions: ['admin', 'schedule_view_view'],

    },
    {
        label: "Service",
        href: "/admin/service",
        icon: <FaServicestack />,
        permissions: ['admin', 'services_view_view'],

    },
    {
        label: "Events",
        href: "/admin/event",
        icon: <MdEmojiEvents />,
        permissions: ['admin', 'events_view_view'],
    },
    {
        label: "Features",
        href: "/admin/feature",
        icon: <FaFeatherPointed />,
        permissions: ['admin', 'feature_view_view'],

    },
    {
        label: "Newsletter",
        href: "/admin/newsletter",
        icon: <PiNewspaperClippingBold />,
        permissions: ['admin', 'newsletter_view'],

    },
    {
        label: "Gallery",
        href: "/admin/gallery",
        icon: <LuGalleryHorizontal />,
        permissions: ['admin', 'gallery_view_view'],

    },
    {
        label: "Contacts",
        href: "/admin/contacts",
        icon: <LuContact />,
        permissions: ['admin', 'contact_view_view'],
    },
    {
        menu: "Settings",
        permissions: ['admin', 'settings_view'],
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: <FaWrench />,
        permissions: ['admin', 'site_settings_view_view'],
    },
    {
        label: "Languages",
        href: "/admin/languages",
        icon: <FaLanguage />,
        permissions: ['admin', 'language_view_view'],
    },

    {
        label: "Email Settings",
        href: "/admin/email-setting",
        icon: <MdEmail />,
        permissions: ['admin', 'email_settings_view_view'],
    },
    {
        label: "Payment Method",
        href: "/admin/payment-method",
        icon: <PiContactlessPaymentFill />,
        permissions: ['admin', 'payment_method_view_view'],
    },
    {
        label: "Currency",
        href: "/admin/currency",
        icon: <MdCurrencyPound />,
        permissions: ['admin', 'currency_view_view'],
    },

    {
        label: "Faq",
        href: "/admin/faq",
        icon: <FaQuestion />,
        permissions: ['admin', 'faq_view_view'],
    },
    {
        label: "Page Settings",
        href: "/admin/page-settings",
        icon: <MdOutlineInsertPageBreak />,
        permissions: ['admin', 'page_settings_view_view'],
    },
];
const getMenu = (user, push, pathname) => {
    const hasPermission = menu => {
        if (menu.permission && havePermission(menu.permission, user?.roles)) {
            return true
        }
        if (menu.permissions) {
            for (let permission of menu.permissions) {
                if (havePermission(permission, user?.roles)) {
                    return true
                }
            }
        }
        if (menu.permissions) {
            for (let permission of menu.permissions) {
                if (roleWisePermission(permission, [user?.role])) {
                    return true
                }
            }
        }
        if (menu.permission) {
            if (roleWisePermission('admin', [user?.role])) {
                return true
            }
        }
        return false
    }
    return menu?.map(d => ({ ...d, href: d.href?.replace('[_id]', user?._id) })).filter(menu => {
        if (menu?.permission === 'any') {
            return true
        } else if (menu.permission || menu.permissions) {
            return hasPermission(menu)
        } else if (Array.isArray(menu.child)) {
            menu.child = menu.child.filter(child => {
                return hasPermission(child)
            })
            return menu.child.length > 0
        }
        return false
    })
}

export const havePermission = (permission, roles) => {
    for (let role of roles || []) {
        if (role?.permissions?.includes(permission)) {
            return true;
        }
    }
    return false;
};



export const roleWisePermission = (permission, roles) => {
    if (roles?.includes(permission)) {
        return true
    }
    return false
}