import Image from 'next/image';
import React from 'react';
import { columnFormatter } from '../../app/helpers/utils';
import { useI18n } from '../../app/providers/i18n';


const CheckOutCard = ({thumbnail_image, name, price, quantity,currencySymbol, convertAmount}) => {
    const i18n = useI18n();
    return (
        <div className='flex  space-x-6 pt-10 border-t border-[#D9D9D9] mb-10'>
            <div><Image className='rounded' src={thumbnail_image} alt="shop" width={100} height={100} /></div>
            <div className='flex-1'>
                <div className='product-description space-y-3 text-[14px] font-semibold'>
                    <p className='font-semibold line-clamp-1 font-poppins text-textMain'>{columnFormatter(name)}</p>
                    <p className='text-primary'>{currencySymbol}{convertAmount(price.toFixed(2))}</p>
                    <p className='!font-normal text-textMain font-poppins'>{i18n?.t('Quantity')}: {quantity} {i18n?.t('pcs')}</p>
                </div>
            </div>
        </div>
    );
};

export default CheckOutCard;