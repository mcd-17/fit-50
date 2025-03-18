import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { PiHeartLight } from 'react-icons/pi';
import { CgEye } from 'react-icons/cg';
import Link from 'next/link';
import { columnFormatter } from '../../app/helpers/utils';
import { message } from 'antd';
import { fatchWishlist, postWishlist } from '../../app/helpers/backend';
import { useCurrency } from '../../app/contexts/site';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '../../app/contexts/user';
import { motion } from 'framer-motion';
import { useI18n } from '../../app/providers/i18n';
import { useFetch } from '../../app/helpers/hooks';

const ShopCard = ({ data, getData }) => {
    const { user } = useUser();
    const i18n = useI18n();
    const router = useRouter();
    const { currencySymbol, convertAmount,findDefaultTheme } = useCurrency();
    const pathName = usePathname();
    const [wishlist, getWaishlist] = useFetch(fatchWishlist);
    const [wishListed, setWishListed] = useState(false);

    useEffect(() => {
        if (wishlist?.docs && wishlist.docs.length > 0) {
            const listed = wishlist.docs[0].products?.some(item => item._id === data._id);
            setWishListed(Boolean(listed));
        }
    }, [wishlist, data._id]);

    const submitWishlist = async (id) => {
        if (!user?._id) {
            message.warning(i18n?.t('Please login to add to wishlist'));
            router.push('/signin');
        } else {
            try {
                const res = await postWishlist({ productId: id });

                if (res?.error === false) {
                    getWaishlist();
                    getData();
                    message.success(res.msg);
                } else {
                    message.error(res.msg);
                }
            } catch (error) {
                console.error('Error submitting wishlist:', error);
            }
        }
    };

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
            className="rounded hover:scale-105 transition-all cursor-pointer p-4 duration-150 w-full mx-auto border overflow-hidden group"
        >
            <div className="relative mx-auto w-full rounded bg-gray-100">
                <Link href={`/shop/${data?._id}`}>
                    <motion.div
                        className="group-hover:hidden"
                        // whileHover={{ scale: 1.05 }}
                        // transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={data?.thumbnail_image}
                            alt="shop"
                            width={310}
                            height={294}
                            className="object-cover w-full lg:h-[294px] sm:h-[250px] h-[150px]"
                        />
                    </motion.div>
                    <motion.div
                        className="hidden group-hover:block"
                        // whileHover={{ scale: 1.05 }}
                        // transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={data?.images[0] ? data?.images[0] : data?.thumbnail_image}
                            alt="shop"
                            width={310}
                            height={294}
                            className="object-cover w-full lg:h-[294px] sm:h-[250px] h-[150px]"
                        />
                    </motion.div>
                </Link>
                {data?.quantity === 0 && (
                    <div className="absolute top-0 status bg-primary w-[115px] h-[115px]">
                        <p className="text-white flex mt-2 items-center -rotate-45">
                            {i18n?.t('Sold Out')}
                        </p>
                    </div>
                )}
            </div>
            <div className="text-center flex flex-col gap-2 pt-6">
                <Link
                    href={`/shop/${data?._id}`}
                    className={`shop-title ${findDefaultTheme?.name === 'home3' && pathName=== "/"  ? 'text-white' : ' text-textMain'} hover:text-primary`}
                >
                    {columnFormatter(data?.name)}
                </Link>
                <div className="flex justify-between items-center mt-2">
                    <h6 className={`cardDescription !font-semibold ${findDefaultTheme?.name === 'home3' && pathName=== "/"  ? 'text-white' : ' text-textMain'}`}>
                        {currencySymbol}{convertAmount(data?.price || 0)}
                    </h6>
                </div>
                <div className="flex sm:flex-row flex-col items-center justify-between mt-3 sm:gap-0 gap-2">
                    <h2 className={`text-base font-medium font-poppins ${findDefaultTheme?.name === 'home3' && pathName=== "/"  ? 'text-white' : ' text-textMain'}`}>
                        {columnFormatter(data?.category?.name)}
                    </h2>
                    <div className="flex gap-[14px] justify-center">
                        <button
                            onClick={() => submitWishlist(data?._id)}
                            className={`${wishListed
                                    ? 'bg-primary text-white px-1 border rounded'
                                    : 'text-secondary_text hover:bg-primary hover:text-white border px-1 rounded text-primary border-primary'
                                }`}
                        >
                            <PiHeartLight className="lg:text-2xl md:text-xl text-lg" />
                        </button>
                        <Link href={`/shop/${data?._id}`} className="shop-button text-primary">
                            <CgEye className="lg:text-2xl md:text-xl text-lg" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ShopCard;
