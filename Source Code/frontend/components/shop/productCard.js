'use client';
import Image from 'next/image';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BsCartPlus } from 'react-icons/bs';
import Swal from 'sweetalert2';
import { useI18n } from '../../app/providers/i18n';
import { useAction, useActionConfirm } from '../../app/helpers/hooks';
import { delCart, postCartlist, postWishlist } from '../../app/helpers/backend';
import { FaPlus } from "react-icons/fa6";
import { RiSubtractFill } from "react-icons/ri";
import { message } from 'antd';
import { columnFormatter } from '../../app/helpers/utils';
import { useCurrency } from '../../app/contexts/site';
import Link from 'next/link';
import { MdDelete } from "react-icons/md";



const ProductCard = ({ data, getWaishlist, getData }) => {
    const i18n = useI18n();
    const pathname = usePathname();
    const router = useRouter();
    const { currencySymbol, convertAmount, currency, getCartItems } = useCurrency();

    const remove = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const storedPropertyIds = JSON.parse(localStorage.getItem('propertyIds')) || [];
                const updatedPropertyIds = storedPropertyIds.filter(item => item !== id);
                localStorage.setItem('propertyIds', JSON.stringify(updatedPropertyIds)); 
                useAction(postWishlist, { productId: id, variantId: data?.variant?._id }, () => {
                    getWaishlist();
                });

                Swal.fire('Removed!', 'The product has been removed from your wishlist.', 'success');
            }
        });
    };
    const deleteFromCart = async (id) => {
        await useActionConfirm(delCart, { product_id: id, variant_id: data?.variant?._id }, () => getData(), 'Are you sure you want to delete this item?', 'Yes, Delete');
    }
    const addToCart = async (quantity) => {
        const res = await postCartlist({
            product_id: data?._id,
            variant_id: data?.variant?._id,
            quantity: quantity ? quantity : 1
        })
        if (res.error === false) {
            getCartItems()
            if (!quantity) {
                message.success(res?.msg)
            }
            if (pathname === '/cart') {
                getData()
            }
            else {
                message.success(res?.msg)
                router.push('/cart')
                getWaishlist()
            }

        } else {
            message.error(res?.msg)
        }
    }
    return (
        <div className='flex rounded sm:flex-row flex-col  border md:gap-5 items-start xl:items-center sm:items-start border-[#D9D9D9] '>
            <Image className='rounded md:h-[170px] h-[210px] sm:w-[230px] object-cover' src={data?.thumbnail_image} alt="shop" width={500} height={500} />
            <div className='flex-1 md:py-3 px-3 md:px-2 py-2'>
                <div className='flex md:gap-10 sm:flex-row flex-col gap-5 justify-between w-full '>
                    <Link href={`/shop/${data?._id}`} className='capitalize font-semibold line-clamp-2 font-montserrat'>{data?.name[[i18n.langCode]]}</Link>
                    <p className='text-primary font-medium'>{currencySymbol}{convertAmount(data?.price?.toFixed(2))}</p>
                </div>
                <div className='flex justify-between itcems-end md:mt-3 mt-1'>
                    <div className='description mt-1'>
                        {
                            data?.variant && (
                                <p> {i18n.t('Variant')}: {columnFormatter(data?.variant?.name)}</p>
                            )
                        }
                        <p>{pathname == "/wishlist" ? i18n.t('Available Quantity') : i18n.t('Quantity')}: {data?.quantity} Pcs</p>
                        {
                            pathname !== '/wishlist' && (
                                <div className='flex items-center mt-3'>
                                    <button onClick={() => { addToCart(-1) }} className='product-button px-2 py-1 flex items-center justify-center'><RiSubtractFill size={16} /></button>
                                    <span className='mx-2'>{data?.quantity}</span>
                                    <button onClick={() => { addToCart(1) }} className='product-button px-2 py-1 flex items-center justify-center'><FaPlus size={16} /></button>
                                </div>)
                        }

                    </div>
                </div>
                <div className={`flex gap-2 mt-2 ${pathname === '/cart' && 'justify-end w-full'}`}>
                    <div className={`flex items-center space-x-2`}>
                        {
                            pathname !== '/cart' ?
                                (<button onClick={() => remove(data?._id)} className='product-button px-2 py-2 xl:text-base text-sm !text-primary hover:!text-white'><MdDelete /></button>)
                                :
                                (<button onClick={() => deleteFromCart(data?._id)} className='product-button px-2 py-2 xl:text-base text-sm !text-primary hover:!text-white'><MdDelete /></button>)
                        }
                    </div>
                    {
                        pathname !== '/cart' && (
                            <button onClick={() => addToCart(1)} className='product-button xl:px-3 px-2 !py-1 flex items-center justify-center gap-2 w-fit'>
                                <span className='xl:text-base text-sm  font-medium'>{i18n.t('Add to Cart')}</span>
                                <BsCartPlus size={20} />
                            </button>
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default ProductCard;
