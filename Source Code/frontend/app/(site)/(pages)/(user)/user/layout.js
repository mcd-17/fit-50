"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosPersonAdd } from "react-icons/io";
import { FaCartShopping, FaNutritionix, FaPeopleGroup, FaUserGroup } from "react-icons/fa6";
import { HiChat, HiOutlineLogout, HiOutlineMenu } from "react-icons/hi";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import Image from "next/image";
import { RxCross1 } from "react-icons/rx";
import { usePathname, useRouter } from "next/navigation";
import { Drawer, message } from "antd";
import { PiPasswordBold, PiQuotesThin } from "react-icons/pi";
import { IoHome } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa";
import { useUser } from "../../../../contexts/user";
import { VscBellDot } from "react-icons/vsc";
import { useI18n } from "../../../../providers/i18n";
import { IoIosFitness } from "react-icons/io";

export default function Layout({ children }) {
  const { getUser, user, setActive } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const i18n = useI18n(); 

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (!user?._id || user?.role !== "user") {
      router.push("/signin");
    }
  }, [user?._id]);

  useEffect(() => {
    const matchedItem = menuItems.find((item) => item.href === pathname);
    setCurrentName(matchedItem ? matchedItem.name : i18n?.t("User Dashboard"));
  }, [pathname]);

  const menuItems = [
    { id: 1, name: "Account Setting", href: "/user", icon: <IoIosPersonAdd /> },
    { id: 3, name: "Membership Level", href: "/user/membership-level", icon: <FaPeopleGroup /> },
    { id: 10, name: "Fitness History", href: "/user/fitness-history", icon: <IoIosFitness /> },
    { id: 3, name: "Order History", href: "/user/order", icon: <FaCartShopping /> },
    { id: 10, name: "Message", href: "/user/message", icon: <HiChat /> },
   
  ];

  if (user?.activeSubscription) {
    menuItems.push(
      { id: 4, name: "Group", href: `${!user?.activeSubscription?._id ? '/pricing-plan' : '/user/group' }`, icon: <FaUserGroup /> },
      { id: 9, name: "Nutrition Schedule", href:`${!user?.activeSubscription?._id ? '/pricing-plan' : '/user/nutrition-schedule'}`, icon: <FaNutritionix /> },
      { id: 19, name: "Workout", href: `${!user?.activeSubscription?._id ? '/pricing-plan' : '/user/workout'}`, icon: <MdOutlineSportsGymnastics /> },
      { id: 15, name: "Notice", href: `${!user?.activeSubscription?._id ? '/pricing-plan' : '/user/notice' }`, icon: <VscBellDot /> },
      { id: 14, name: "Testimonial", href: `${!user?.activeSubscription?._id ? '/pricing-plan' : '/user/testimonial' }`, icon: <PiQuotesThin /> },
      { id: 10, name: "Change Password", href: "/user/change-password", icon: <PiPasswordBold /> },
    );   
  }
 

  return (
    <>
      <section className="w-full overflow-hidden bg-cover bg-center bg-[url(/basic.png)]">
        <div className="bg-black/80 w-full h-full">
          <div className="container lg:h-[420px] sm:h-[300px] h-[220px]">
            <div className="relative font-montserrat text-white text-5xl max-w-[1320px] mx-auto pl-6 lg:pt-[219px] sm:pt-[150px] pt-[110px]">
              <h2 className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl font-bold capitalize font-montserrat">
                {i18n?.t(currentName)}
              </h2>
              <div className="mt-3 flex items-center gap-2 text-[16px] sm:text-[14px] md:text-[18px] font-semibold">
                <IoHome className="text-primary" />
                <Link href="/" className="text-primary capitalize cursor-pointer font-poppins">
                  {i18n?.t("Home")}
                </Link>
                <FaAngleRight />
                <p className="capitalize font-poppins">{i18n?.t(currentName)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lg:flex container lg:gap-x-6 py-[60px] md:pt-[120px]">
        <div className="lg:hidden mb-5 ">
          <HiOutlineMenu className="text-2xl cursor-pointer text-black" onClick={toggleDrawer} />
        </div>
        <Drawer
          title={false}
          placement="left"
          closable={false}
          onClose={toggleDrawer}
          open={drawerOpen}
          width={286}
        >
          <div className="flex justify-end items-end">
            <RxCross1 onClick={toggleDrawer} className="text-2xl" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="relative mx-auto h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full">
              <Image
                src={user?.image || "/defaultimg.jpg"}
                alt="Profile"
                width={1000}
                height={1000}
                className="h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full object-contain"
              />
            </div>
            <h2 className="text-center font-medium leading-[27px] text-[18px] text-textMain my-6">
              {user?.name}
            </h2>
          </div>
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-[8px] sm:p-[18px] border rounded transition-colors duration-200 font-poppins ${
                      pathname === item.href ? "bg-primary text-white" : "text-textMain hover:bg-primary hover:text-white"
                    }`}
                  >
                    <span className="text-lg sm:text-2xl mr-2">{item.icon}</span>
                    <span className="text-base font-poppins">{i18n?.t(item.name)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    message.success("Sign out successfully");
                    router.push("/signin");
                    getUser();
                    setActive("Sign Out");
                  }}
                  className="flex items-center p-[8px] w-full sm:p-[18px] border rounded transition-colors duration-200"
                >
                  <span className="text-lg sm:text-2xl mr-2">
                    <HiOutlineLogout />
                  </span>
                  <span className="text-base">{i18n?.t("Sign Out")}</span>
                </button>
              </li>
            </ul>
          </nav>
        </Drawer>

        <div className="hidden lg:block lg:max-w-[424px] lg:mb-0 mb-6 w-full h-fit bg-white p-4 sm:p-8 border rounded">
          <div className="mb-8">
            <div className="flex justify-center relative h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full border mx-auto">
              <Image
                src={user?.image || "/defaultimg.jpg"}
                alt="Profile"
                width={1000}
                height={1000}
                className="h-[150px] lg:h-[200px] w-[150px] lg:w-[200px] rounded-full object-fill"
              />
            </div>
            <h2 className="text-center font-medium leading-[27px] text-[18px] font-poppins text-textMain mt-6">
              {user?.name}
            </h2>
          </div>
          <nav>
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-[8px] sm:p-[18px] border rounded font-poppins transition-colors duration-200 ${
                      pathname === item.href ? "bg-primary text-white" : "text-textMain hover:bg-primary hover:text-white"
                    }`}
                  >
                    <span className="text-lg sm:text-2xl mr-2">{item.icon}</span>
                    <span className="text-base font-poppins">{i18n?.t(item?.name)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    message.success("Sign out successfully");
                    window.location.href ="/signin"
                    getUser();
                    setActive("Sign Out");
                  }}
                  className="flex items-center p-[8px] w-full sm:p-[18px] border rounded transition-colors duration-200"
                >
                  <span className="text-lg sm:text-2xl mr-2">
                    <HiOutlineLogout />
                  </span>
                  <span className="text-base font-poppins">{i18n?.t("Sign Out")}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <main className="flex-1 border p-6 rounded h-fit w-full lg:w-4/6">{children}</main>
      </div>
    </>
  );
}
