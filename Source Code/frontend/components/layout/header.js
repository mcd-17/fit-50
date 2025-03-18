'use client';
import { useEffect, useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Badge, Dropdown, Menu, message, Space, Tabs, Tooltip } from 'antd';
import { IoMdCloseCircle } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import Link from 'next/link';
import Button from '../common/button';
import { useUser } from '../../app/contexts/user';
import { useI18n } from '../../app/providers/i18n';
import { useCurrency } from '../../app/contexts/site';
import 'react-loading-skeleton/dist/skeleton.css';
import { useFetch } from '../../app/helpers/hooks';
import { fetchAdminSettings, fetchCartlist, fetchTheme } from '../../app/helpers/backend';
import { FiShoppingCart } from 'react-icons/fi';
import { MdOutlineLanguage } from 'react-icons/md';

const Navbar = () => {
  const { getUser, user, setActive } = useUser();
  const [cartList] = useFetch(fetchCartlist)
  const [isOpen, setIsOpen] = useState(false);
  const i18n = useI18n();
  const router = useRouter();
  const [defaultLang, setDefaultLang] = useState(null);
  const { currencies, changeCurrency, currency, cartItems } = useCurrency();
  const [setting] = useFetch(fetchAdminSettings);
  const [activeCurrency, setActiveCurrency] = useState(currency);
  const [allThemes, getAllThemes] = useFetch(fetchTheme)
  const findDefaultTheme = allThemes?.find((theme) => theme?.isDefault === true);

  const handleCurrencyChange = (selectedCurrency) => {
    changeCurrency(selectedCurrency);
    setActiveCurrency(selectedCurrency);
  };
  const links = [
    {
      name: i18n?.t('Home'),
      path: '/',
    },
    { name: i18n?.t('About'), path: '/about' },
    { name: i18n?.t('Services'), path: '/services' },
    { name: i18n?.t('Shop'), path: '/shop' },
    {
      name: i18n?.t('More'),
      dropdownItems: [
        { name: i18n?.t('Pricing Plan'), href: '/pricing-plan' },
        { name: i18n?.t('Trainers'), href: '/trainers' },
        { name: i18n?.t('Fitness Calculator'), href: '/bmi-calculator' },
        { name: i18n?.t('Image Gallery'), href: '/gallary' },
        { name: i18n?.t('Event'), href: '/event' },
        { name: i18n?.t('Blogs'), href: '/blog' },
        { name: i18n?.t('Class Schedule'), href: '/classSchedule' },
        { name: i18n?.t('Group'), href: '/group' },
      ],
    },
  ];

  useEffect(() => {
    let langId = localStorage.getItem('lang');
    if (langId) {
      let findLang = i18n?.languages?.docs.find((lang) => lang?._id === langId);
      if (findLang) {
        setDefaultLang(findLang?.name);
      }
    } else {
      if (i18n?.languages?.docs?.length > 0) {
        const defaultLanguage = i18n?.languages?.docs.find((lang) => lang?.default);
        setDefaultLang(defaultLanguage?.name || i18n.languages.docs[0]?.name);
      }
    }
  }, [i18n?.languages?.docs]);

  useEffect(() => {
    let currency = localStorage.getItem('currency');
    if (currency) {
      changeCurrency(currency);
    } else {
      changeCurrency(currencies[0]?.code);
    }
  }, [currencies]);

  if (!defaultLang) {
    return null;
  }

  const handleLinkClick = (path) => {
    setIsOpen(false);
    if (path) {
      router.push(path);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const renderLinks = (isMobile = false) =>
    links.map((link, index) => (
      <div key={index}>
        {link.dropdownItems ? (
          <Dropdown
            menu={{
              items: link.dropdownItems.map(({ name, href }) => ({
                label: <Link href={href}>{name}</Link>,
                key: name,
              })),
            }}
            className='antspace !text-white duration-500 hover:!text-primary !cursor-pointer'
          >
            <a
              onClick={(e) => e.preventDefault()}
              className={`flex items-center space-x-1 text-white duration-500 hover:text-primary`}
            >
              <Space>
                {link.name} <MdKeyboardArrowDown size={25} />
              </Space>
            </a>
          </Dropdown>
        ) : (
          <Link
            href={link.path || '#'}
            className={`font-noto text-[18px] font-medium text-white duration-500 hover:text-primary`}
            onClick={() => handleLinkClick(link.name, link.path)}
          >
            {link.name}
          </Link>
        )}
      </div>
    ));

  const userItem = [
    {
      key: '1',
      label: (
        <Link
          href={
            user?.role === 'admin'
              ? '/admin'
              : user?.role === 'trainer'
                ? '/trainer'
                : user?.role === 'user'
                  ? '/user'
                  : '/signin'
          }
        >
          {i18n?.t("Dashboard")}
        </Link>
      ),
    },
    ...(user?.role !== 'admin' && user?.role !== 'trainer'
      ? [{
        key: '2',
        label: (
          <Link href={'/wishlist'}>
            <p>{i18n?.t('Wishlist')}</p>
          </Link>
        ),
      }]
      : []
    ),
    {
      key: '3',
      label: (
        <div
          onClick={() => {
            localStorage.removeItem('token');
            message.success(i18n?.t('Sign out successfully'));
            router.push('/signin');
            getUser();
            setActive('Sign Out');
          }}
        >
          <p>{i18n?.t('Sign Out')}</p>
        </div>
      ),
    },
  ];


  const userMenu = (
    <Menu>
      {userItem.map((item, index) => (
        <Menu.Item key={index}>{item?.label}</Menu.Item>
      ))}
    </Menu>
  );

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: '1',
      label: (
        <button
          className='text-black text-sm font-medium font-poppins active:!text-primary primary '
          style={{
            color: '#000000',
            transition: 'color 0.3s',
          }}
        >
          {i18n?.t("Language")}
        </button>
      ),
      children: <div className='overflow-y-scroll hide-scrollbar'>
        <div className=' w-full flex flex-col items-start gap-2  '>
          {i18n?.languages?.docs?.map((lang) => (
            <button
              className={`border-[1px] w-full text-center border-[#D9D9D9] rounded text-sm font-medium font-poppins hover:text-white hover:border-primary px-6 py-[12px] duration-500 hover:bg-primary ${defaultLang === lang?.name ? 'bg-primary text-white' : ''
                }`}
              onClick={() => {
                i18n.changeLanguage(lang?._id);
                localStorage.setItem('lang', lang?._id);
                setDefaultLang(lang?.name);
              }}
            >
              {lang?.name}
            </button>
          ))}
        </div>
      </div>,
    },
    {
      key: '2',
      label: (
        <button
          className='text-black text-sm font-medium font-poppins active:!text-primary primary '
          style={{
            color: '#000000',
            transition: 'color 0.3s',
          }}
        >
          {i18n?.t("Currency")}
        </button>
      ),
      children: <div className='overflow-y-scroll hide-scrollbar'>
        <div className='w-full flex flex-col items-start gap-2'>
          {currencies?.map((currencyItem) => (
            <button
              key={currencyItem?.code}
              className={`border-[1px] w-full text-center border-[#D9D9D9] rounded text-sm font-medium font-poppins hover:text-white hover:border-primary px-6 !py-[10px] duration-500 hover:bg-primary ${activeCurrency === currencyItem?.code ? 'bg-primary text-white' : ''}`}
              onClick={() => handleCurrencyChange(currencyItem?.code)}
            >
              {currencyItem?.name}
            </button>
          ))}
        </div>
      </div>,
    },

  ];

  return (
    <>
      <nav
        className={`absolute z-50 w-full border-b border-white/20 ${findDefaultTheme?.name === 'home3' ? 'border-none bg-black text-white' : ''}`}
      >
        <div className='container flex items-center justify-between gap-4 py-4 lg:py-8'>
          <Link href='/' className='flex items-center gap-2 text-primary '>
            <Image
              src={setting?.logo}
              height={200}
              width={300}
              alt='logoImage'
              className='h-[47px] w-[47px]'
            />
            <h1 className='uppercase font-nicoMoji text-[27px] leading-[43.2px] font-semibold sm:block hidden'>{setting?.title}</h1>
          </Link>
          <div className='flex items-center gap-20 '>
            <div className='flex items-center md:gap-5 gap-3'>
              <div className='flex items-center md:gap-6 gap-3 text-white lg:hidden language '>
                <Tooltip className='!cursor-pointer' color='white' placement='bottom' title={
                  <div className="text-black  langTool hide-tooltip">
                    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                  </div>
                }>
                  <MdOutlineLanguage className='!cursor-pointer' size={24} />
                </Tooltip>
                {
                  (user?.role && user.role !== 'admin' && user.role !== 'trainer') && (
                    <Badge
                      className='!cursor-pointer'
                      size='small'
                      color='#E67529'
                      count={cartList?.products?.length}
                      onClick={() => router.push('/cart')}>
                      <FiShoppingCart size={24} className='text-white !cursor-pointer' />
                    </Badge>
                  )
                }
                {user?.role === 'user' ||
                  user?.role === 'trainer' ||
                  user?.role === 'admin' ? (
                  <Dropdown overlay={userMenu} className='cursor-pointer'>
                    {user?.image ? (
                      <Image
                        className='h-[30px] w-[30px] cursor-pointer rounded-full xl:h-[50px] xl:w-[50px]'
                        src={user?.image}
                        width={500}
                        height={400}
                        alt='profile'
                      />
                    ) : (
                      <div className='flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full border border-red-300 bg-gray-300 md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]'>
                        {user?.name &&
                          user?.name
                            .split(' ')
                            .map((word) => word.charAt(0))
                            .join('')
                            .toUpperCase()}
                      </div>
                    )}
                  </Dropdown>
                ) : (
                  <Link href='/signin' className='text-white'>
                    <Button className='!h-fit !py-1 !px-2 text-white !bg-primary'>
                      {i18n?.t('Join Us')}
                    </Button>
                  </Link>
                )}
              </div>
              <div className='flex lg:hidden'>
                <button
                  onClick={toggleMenu}
                  className='text-white focus:outline-none'
                >
                  {isOpen ? (
                    <IoMdCloseCircle size={25} />
                  ) : (
                    <GiHamburgerMenu size={25} />
                  )}
                </button>
              </div>
              <div className='hidden items-center xl:space-x-10 space-x-6 text-[18px] font-medium text-white lg:flex'>
                {renderLinks()}
              </div>
            </div>
            <div className='hidden items-center gap-6 text-white lg:flex language '>
              <Tooltip color='white' placement='bottom' title={
                <div className="text-black  langTool hide-tooltip">
                  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                </div>
              }>
                <MdOutlineLanguage size={24} className='cursor-pointer' />
              </Tooltip>
              {
                (user?.role && user.role !== 'admin' && user.role !== 'trainer') && (
                  <Badge
                    size='small'
                    color='#E67529'
                    count={cartItems?.products?.length ? cartItems?.products?.length : 0}
                    onClick={() => router.push('/cart')}>
                    <FiShoppingCart size={24} className='text-white cursor-pointer' />
                  </Badge>
                )
              }
              {user?.role === 'user' ||
                user?.role === 'trainer' ||
                user?.role === 'admin' ? (
                <Dropdown overlay={userMenu}>
                  {user?.image ? (
                    <Image
                      className='h-[35px] w-[35px] cursor-pointer rounded-full md:h-[40px] md:w-[40px]'
                      src={user?.image}
                      width={500}
                      height={400}
                      alt='profile'
                    />
                  ) : (
                    <div className='flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full border border-red-300 bg-gray-300 md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]'>
                      {user?.name &&
                        user?.name
                          .split(' ')
                          .map((word) => word.charAt(0))
                          .join('')
                          .toUpperCase()}
                    </div>
                  )}
                </Dropdown>
              ) : (
                <Link href='/signin' className='text-white'>
                  <Button className='!h-fit !py-2 text-white !bg-primary'>
                    {i18n?.t('Join Us')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className='absolute left-0 top-[79px] flex w-full flex-col space-y-4 bg-textMain px-4 pb-5 pt-10 text-[18px] font-medium text-white lg:top-[110px] xl:hidden'>
            {renderLinks(true)}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
