'use client';
import React, { useEffect, useState } from 'react';
import { Empty, message, Rate } from 'antd';
import { BsCartPlus } from "react-icons/bs";
import Link from 'next/link';
import Review from '../../../../../components/shop/review';
import BasicBar from '../../../../../components/common/basic-bar';
import ShopCard from '../../../../../components/home1/shopCard';
import { useFetch } from '../../../../helpers/hooks';
import { fatchWishlist, postCartlist, postWishlist, singleProductAdmin } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { columnFormatter } from '../../../../helpers/utils';
import { PiHeartLight } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../../../../contexts/site';
import WriteReview from '../../../../../components/shop/writeReview';
import { FacebookShareButton, TwitterShareButton, RedditShareButton, LinkedinShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, RedditIcon, LinkedinIcon } from 'react-share';
import ProductImageSlider from '../../../../../components/common/imageSlider';
import Button from '../../../../../components/common/button';


const Wheyprotein = ({ params }) => {
    const i18n = useI18n()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('description');
    const [wishlist, getWaishlist] = useFetch(fatchWishlist);
    const [wishListed, setWishListed] = useState(false)
    const { currencySymbol, convertAmount, getCartItems } = useCurrency();
    const [data, getData] = useFetch(singleProductAdmin, {}, false)

    const [variant, setVariant] = useState()
    const [varientPrice, setVariantPrice] = useState(null)

    useEffect(() => {
        getData({ _id: params._id });
    }, [params._id]);

    const tabs = ["description", "review", "Write review"];

    const handleWeightChange = (id) => {
        setVariant(id)
    };
    useEffect(() => {
        if (wishlist?.docs && wishlist.docs.length > 0) {
            const listed = wishlist.docs[0].products?.some(item => item._id === params._id);
            setWishListed(Boolean(listed));
        }
    }, [wishlist, params._id]);
    const [url, setUrl] = useState("");
    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    const submitWishlist = async (id) => {
        try {
            const res = await postWishlist({ productId: params._id, variantId: variant });
            if (res?.error === false) {
                getWaishlist();
                getData({ _id: params._id });
                message.success(res.msg);
            } else {
                message.error(res.msg);
            }
        } catch (error) {
            console.error('Error submitting wishlist:', error);
            message.error('Failed to add to wishlist.');
        }
    };

    useEffect(() => {
        let varientProduct = data?.product?.variants?.find(item => item?._id === variant)
        setVariantPrice(varientProduct?.price)
    }, [variant]);

    const addToCart = async () => {
        const res = await postCartlist({
            product_id: params._id,
            variant_id: variant,
            quantity: 1
        })
        if (res.error === false) {
            getCartItems()
            message.success(res?.msg)
            router.push('/cart')
        } else {
            message.error(res?.msg)
            router.push('/signin')
        }
    }
    useEffect(() => {
        if (data?.product?.variants?.length > 0) {
            setVariant(data?.product?.variants[0]?._id)
        }
    }, [data?.product?.variants]);
    return (
        <section className=''>
            <BasicBar heading={i18n?.t('Product Details')} subHeading={i18n?.t('Product Details')} />
            <div className='container lg:my-[120px] md:my-20 my-10'>
                <div className='flex flex-col lg:flex-row md:space-x-6'>
                    <div className='flex-shrink-0'>
                        <ProductImageSlider thumbnail_image={data?.product?.thumbnail_image} images={data?.product?.images} />
                    </div>
                    <div className='flex-1 font-poppins text-textMain mt-6'>
                        <div className='flex flex-col lg:gap-0 gap-2 lg:flex-row lg:items-center justify-between'>
                            <p className='font-medium text-[18px] text-gray-600'>{columnFormatter(data?.product?.category?.name)}</p>
                            <div className='flex items-center space-x-5 md:mt-4 lg:mt-0'>
                                <Rate disabled className='text-primary' value={data?.avgRating} />
                                <p className='text-[16px] font-normal text-gray-600'>{i18n?.t("Review")}({data?.reviews?.length || 0})</p>
                            </div>
                        </div>
                        <h2 className='mt-6 font-semibold text-[28px] capitalize text-gray-800'>{columnFormatter(data?.product?.name)}</h2>
                        <div className='mt-6 flex items-center required: true space-x-6 text-[18px] font-semibold text-gray-800'>
                            <p>{currencySymbol}{convertAmount(varientPrice ? varientPrice : data?.product?.price || 0)}</p>
                            {data?.variants?.length > 0 && <p className='description capitalize'>({data?.product?.variants?.in_stock})</p>}
                        </div>
                        <p className='mt-2 description text-gray-600'>{i18n?.t("Quantity")}{":"}{data?.product?.quantity || 0}</p>
                        <p className='mt-6 description line-clamp-4 text-gray-600'>{columnFormatter(data?.product?.short_description)}</p>
                        {data?.product?.variants?.length > 0 && (
                            <>
                                <div className='mt-4 flex items-center space-x-2 md:space-x-6'>
                                    {data?.product?.variants?.map(size => (
                                        <button key={size?._id} onClick={() => handleWeightChange(size?._id)} className={`product-button text-[12px] md:text-[16px] px-4 py-2 md:px-6 ${variant === size?._id ? '!bg-primary !text-white' : 'bg-gray-200 text-gray-800 hover:bg-primary hover:text-white transition duration-300'}`}>
                                            {size?.name[i18n?.langCode]}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className='lg:mt-10 mt-4 flex space-x-2 items-center lg:space-x-6'>
                            {data?.product?.quantity > 0 ? (
                                <>
                                    <Button children={<div className='flex items-center gap-4'><span>{i18n?.t("Add to Cart")}</span> <BsCartPlus size={20} /></div>} onClick={addToCart} ></Button>
                                    <Button className={wishListed ? 'bg-primary text-white' : ''} children={<div className='flex items-center gap-4'><span>{wishListed ? `${i18n?.t("Remove from wishlist")}` : `${i18n?.t("Add to wishlist")}`}</span> <PiHeartLight size={20} /></div>} onClick={() => submitWishlist(data?._id)} ></Button>
                                </>
                            ) : (
                                <p className='w-full mt-6 lg:mt-0 py-4 flex items-center justify-center space-x-[10px] bg-red-500 text-white rounded-lg shadow-lg'>
                                   {i18n?.t("Out of Stock")}
                                </p>
                            )}
                        </div>
                        <div className='mt-12 flex items-center space-x-3 md:space-x-5'>
                            <p className='text-[18px] font-medium text-gray-800'>{i18n?.t("Share")}:</p>
                            <div className="flex gap-2">
                                <FacebookShareButton url={url}>
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                                <TwitterShareButton url={url}>
                                    <TwitterIcon size={32} round />
                                </TwitterShareButton>
                                <RedditShareButton url={url}>
                                    <RedditIcon size={32} round />
                                </RedditShareButton>
                                <LinkedinShareButton url={url}>
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='md:mt-[75px] mt-10 lg:mt-[148px]'>
                    <div className="flex space-x-3 md:space-x-[35px]">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                className={`sm:px-7 px-3 py-2 font-poppins rounded whitespace-pre sm:py-3 ${activeTab === tab ? 'bg-[#E67529] text-white' : 'text-black border border-[#D9D9D9] bg-white hover:bg-gray-200 transition duration-300'}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {i18n?.t(tab.charAt(0).toUpperCase() + tab.slice(1))}
                            </button>
                        ))}
                    </div>
                    <div className="mt-10">
                        {activeTab === 'description' && <p dangerouslySetInnerHTML={{ __html: columnFormatter(data?.product?.description) }} className='description border border-[#D9D9D9] !text-[#2B2B2BCC] py-10 px-7 rounded bg-gray-50'>
                        </p>}
                        {activeTab === 'review' && <Review review={data?.reviews} />}
                        {activeTab === 'Write review' && <WriteReview productId={params._id} />}
                    </div>
                    <div className='mt-[70px] md:mt-[140px]'>
                        <p className='text-[28px] font-semibold text-gray-800'>{i18n.t("Related Products")}</p>
                        {
                            data?.relatedProducts?.length > 0 ?
                                <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
                                    {

                                        data?.relatedProducts?.map(product => (
                                            <Link key={product._id} href={`/shop/_${product._id}`} passHref>
                                                <ShopCard data={product} />
                                            </Link>
                                        ))

                                    }
                                </div> :
                                <div className='min-h-[10vh] flex items-center justify-center w-full'>
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Related Products available for this product' />
                                </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Wheyprotein;

