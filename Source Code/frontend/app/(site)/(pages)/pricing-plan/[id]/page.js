'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '../../../../providers/i18n';
import {
    buyOwnerSubscription,
    fetchSubscriptionDetails,
    fetchUserPaymentMethods,
} from '../../../../helpers/backend';
import { useFetch } from '../../../../helpers/hooks';;
import { Radio, message } from 'antd';
import BasicBar from '../../../../../components/common/basic-bar';
import { useSearchParams } from 'next/navigation';
import { columnFormatter } from '../../../../helpers/utils';
import { useCurrency } from '../../../../contexts/site';

const page = ({ params }) => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fetchSubscriptionDetails, {}, false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [value, setValue] = useState('');
    const [methodList, setMethodList] = useFetch(fetchUserPaymentMethods);
    const [method, setMethod] = useState('');
    const querydata = useSearchParams();
    const site = useCurrency();
    const { convertAmount } = useCurrency();

    useEffect(() => {

        getData({ _id: params?.id });

    }, [data?._id]);

    return (
        <div className=' '>
            <BasicBar heading={i18n?.t("Plan Details")} subHeading={i18n?.t("Plan Details")} />
            <div className='pricing-plan-form my-[80px] items-start justify-between gap-6 font-normal md:flex'>
                <div className='mx-auto mt-8 w-full rounded-xl bg-white shadow-2xl p-[32px] md:mt-0 md:w-1/2'>
                    <h1 className='mb-8 text-2xl font-bold text-textMain'>{i18n?.t('Plan Details')}</h1>
                    <hr className='my-6 w-full border-[#909090]' />
                    <div className='mb-8 space-y-3 text-xl font-normal'>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-textMain !font-poppins'>{i18n?.t('Name')}</h1>
                            <h1 className='text-textMain !font-poppins'>{columnFormatter(data?.name)}</h1>
                        </div>
                        <div className='flex items-center justify-between'>
                            <h1 className='text-textMain !font-poppins'>{i18n?.t('Plan type')}</h1>
                            <h1 className='text-textMain !font-poppins'>{querydata.get('type')}</h1>
                        </div>
                        <div className='mb-8 flex items-center justify-between'>
                            <h1 className='font-poppins'>
                                {querydata.get('type') === 'monthly'
                                    ? i18n?.t('Per Month')
                                    : i18n?.t('Per Year')}
                            </h1>
                            <h1 className='font-poppins'>
                                {site?.currencySymbol}
                                {querydata.get('type') === 'monthly'
                                    ? convertAmount(data?.monthly_price) : convertAmount(data?.yearly_price)}
                            </h1>
                        </div>
                    </div>
                    <div className='text-base'>
                        <h1 className='mb-3 text-base text-textMain !font-poppins'>{i18n?.t('Payment Method')}</h1>
                        <Radio.Group
                            required
                            onChange={(e) => setMethod(e?.target?.value)}
                            className='flex flex-col gap-3'
                            defaultValue={method}
                        >
                            {methodList?.docs?.map((item) => {
                                return <Radio className='font-poppins text-textMain' value={item?.type}>{i18n?.t('Pay With')} {item?.name}</Radio>;
                            })}
                        </Radio.Group>
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                setCheckoutLoading(true);
                                if (!method)
                                    return message.error(i18n?.t('Please select payment method'));
                                if (querydata.get('type')) {
                                    const res = await buyOwnerSubscription({
                                        subscriptionID: data?._id,
                                        currency: site?.currency,
                                        planType: querydata.get('type'),
                                        method: method,
                                        langCode: i18n.langCode,


                                    });
                                    if (res?.error === false) {
                                        setCheckoutLoading(false);
                                        message.success(res?.msg);
                                        window.open(res?.data, '_blank');
                                    } else {
                                        setCheckoutLoading(false);
                                        message.error(res?.msg);
                                    }
                                }

                            }
                            catch (e) {
                                setCheckoutLoading(false);
                                message.error(i18n?.t('Something went wrong'));
                            }
                            finally {
                                setCheckoutLoading(false);

                            }

                        }}
                        className='header_5 border-secondary_text mt-10 w-full rounded-lg border py-3 transition-all ease-in-out bg-primary text-white'
                    >
                        {checkoutLoading ? "Checking..." : i18n?.t('Checkout')}
                    </button>
                </div>


            </div>
        </div>
    );
};

export default page;
