"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoHome, IoSettingsOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { FaNutritionix, FaUserGroup } from "react-icons/fa6";

import { MdAssignmentAdd, MdDateRange } from "react-icons/md";
import { VscBellDot } from "react-icons/vsc";
import { HiOutlineLogout, HiOutlineMenu } from "react-icons/hi";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { usePathname, useRouter } from "next/navigation";
import { Drawer, message } from "antd";
import { PiPasswordBold } from "react-icons/pi";
import { FaAngleRight } from "react-icons/fa";
import { useUser } from "../../../../contexts/user";
import { FaBloggerB } from "react-icons/fa6";
import { useI18n } from "../../../../providers/i18n";



const menuItems = [
  {
    id: 1,
    name: "Trainer Dashboard",
    href: "/trainer",
    icon: <IoSettingsOutline />,
  },
  {
    id: 2,
    name: "Attendance",
    href: "/trainer/attendance",
    icon: <MdDateRange />,
  },
  {
    id: 3,
    name: "Account Setting",
    href: "/trainer/account-setting",
    icon: <IoIosPersonAdd />,
  },

  {
    id: 4,
    name: "Messages",
    href: "/trainer/message",
    icon: <FaUserGroup />,
  },
  {
    id: 5,
    name: "Group",
    href: "/trainer/group",
    icon: <FaUserGroup />,
  },
 
  {
    id: 6,
    name: "Assigned Workout",
    href: "/trainer/assigned-workout",
    icon: <MdAssignmentAdd />,
  },
  {
    id: 7,
    name: "Notice",
    href: "/trainer/notice",
    icon: <VscBellDot />,
  },
  {
    id: 8,
    name: "Nutrition Schedule",
    href: "/trainer/nutrition-schedule",
    icon: <FaNutritionix />,
  },
  {
    id:9,
    name: "Blog",
    href: "/trainer/blog",
    icon: <FaBloggerB />,
  },

  {
    id: 10,
    name: "Change Password",
    href: "/trainer/change-password",
    icon: <PiPasswordBold />,
  },

];

export default function Layout({ children }) {
  const { getUser, user, setActive } = useUser()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const router = useRouter();
  const i18n = useI18n();

  const pathname = usePathname();
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };


  useEffect(() => {
    const matchedItem = menuItems.find((item) => item.href === pathname);
    if (matchedItem) {
      setCurrentName(matchedItem.name);
    } else {
      setCurrentName(i18n?.t("Trainer Dashboard"));
    }
  }, [pathname]);
  if (!user?._id || user?.role !== "trainer") {
    return router.push("/signin");
  } 

  return (
    <>
      <section className="w-full overflow-hidden bg-cover bg-center bg-[url(/basic.png)]">
        <div className='bg-black/80 w-full h-full '>
          <div className='container lg:h-[420px] sm:h-[300px] h-[220px]'>
            <div className="relative font-montserrat text-white text-5xl max-w-[1320px] mx-auto pl-6 lg:pt-[219px] sm:pt-[150px] pt-[110px]">
              <h2 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl font-bold capitalize font-montserrat">{i18n?.t(currentName)}</h2>
              <div className="mt-3 flex items-center gap-2 text-[16px] sm:text-[14px] md:text-[18px] font-semibold">
                <IoHome className="text-primary" />
                <Link href={'/'} className="text-primary capitalize font-poppins cursor-pointer">{i18n?.t('Home')}</Link>
                <FaAngleRight />
                <p className='capitalize font-poppins'>{i18n?.t(currentName)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="lg:flex container lg:gap-x-6 py-[60px] md:pt-[140px] md:pb-[272px]">
        <div className="lg:hidden mb-5">
          <HiOutlineMenu
            className="text-2xl cursor-pointer text-black"
            onClick={toggleDrawer}
          />
        </div>

        <Drawer
          title={false}
          placement="left"
          closable={false}
          onClose={toggleDrawer}
          open={drawerOpen}
          width={286}
        >
          <div className="flex justify-end items-end ">
            <RxCross1 onClick={toggleDrawer} className="text-2xl" />

          </div>
          <div className="flex flex-col justify-center  ">
            <div className="relative border  flex justify-center h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full mx-auto">
              <Image
                src={user?.image ? user?.image : "/defaultimg.jpg"}
                alt="Profile"
                width={1000}
                height={1000}
                className="h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full object-fill"
              />
            </div>
            <h2 className="text-center font-medium leading-[27px] text-[18px] font-poppins text-textMain mt-6 capitalize">
              {user?.name}
            </h2>
          </div>
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-[8px] sm:p-[18px] border rounded transition-colors duration-200 ${pathname === item.href
                      ? "bg-primary text-white"
                      : "text-textMain hover:bg-primary hover:text-white"
                      }`}
                  >
                    <span className="text-lg sm:text-2xl mr-2">{item.icon}</span>
                    <span className="text-base font-poppins">{i18n?.t(item.name)}</span>
                  </Link>
                </li>
              ))}
              <li >
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    message.success(('Sign out successfully'))
                    router.push('/signin')
                    getUser()
                    setActive('Sign Out')
                  }}
                  className={`flex items-center p-[8px] w-full sm:p-[18px] border rounded transition-colors duration-200 
                    `}
                >
                  <span className="text-lg sm:text-2xl mr-2"><HiOutlineLogout /></span>
                  <span className="text-base font-poppins">{i18n?.t('Sign Out')}</span>
                </button>
              </li>
            </ul>
          </nav>
        </Drawer>

        <div className="hidden lg:block lg:w-[424px] lg:mb-0 mb-6 w-full h-fit bg-white p-4 sm:p-8 border rounded">
          <div className="mb-8">
            <div className="mx-auto relative border h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full">
              <Image
                src={user?.image}
                alt="Profile"
                width={1000}
                height={1000}
                className="h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full object-cover"
              />   
            </div>
            <h2 className="text-center font-medium leading-[27px] text-[18px] font-poppins text-textMain mt-6 capitalize">
              {user?.name}
            </h2>
          </div>
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-[8px] sm:p-[18px] border rounded transition-colors duration-200 ${pathname === item.href
                      ? "bg-primary text-white"
                      : "text-textMain hover:bg-primary hover:text-white"
                      }`}
                  >
                    <span className="text-lg sm:text-2xl mr-2">{item.icon}</span>
                    <span className="text-base font-poppins">{i18n?.t(item.name)}</span>
                  </Link>
                </li>
              ))}

              <li >
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    message.success(('Sign out successfully'))
                    router.push('/signin')
                    getUser()
                    setActive('Sign Out')
                  }}
                  className={`flex items-center p-[8px] w-full sm:p-[18px] border rounded transition-colors duration-200 
                    `}
                >
                  <span className="text-lg sm:text-2xl mr-2"><HiOutlineLogout /></span>
                  <span className="text-base font-poppins">{i18n?.t('Sign Out')}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <main className="flex-1 border p-3 md:p-[25px] w-full rounded lg:w-[872px] overflow-x-auto">{children}</main>
      </div>
    </>
  );
}
