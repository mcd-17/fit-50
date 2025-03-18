'use client';
import { useContext } from 'react';
import UserContext from '../../../../../contexts/user';
import { columnFormatter } from '../../../../../helpers/utils';
import { useCurrency } from '../../../../../contexts/site';
import dayjs from 'dayjs';
import Button from '../../../../../../components/common/button';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../providers/i18n';

const SubscriptionRow = ({ label, value }) => (
    <div className='subscriptionRow'>
        <p className='subscriptionRowLabel'>{label}</p>
        <p className='subscriptionRowLabel'>
            {value || 'N/A'}
        </p>
    </div>
);

const Page = () => {
    const {push} = useRouter();
    const { user } = useContext(UserContext);
    const site = useCurrency();
    const i18n = useI18n();

    return (
        <>
            <h1 className='profileHeading'>{i18n?.t('Membership Level')}</h1>
            <hr />
            <h2 className='mt-4 text-[18px] font-medium uppercase sm:mt-[40px]'>{i18n?.t('Current')}</h2>
            <div className='mt-2 space-y-2 sm:mt-[23px] sm:space-y-6'>
                {user?.activeSubscription ? (
                    <>
                        <SubscriptionRow 
                            label={i18n?.t('Current Package')} 
                            value={columnFormatter(user?.activeSubscription?.subscription?.name)} 
                        />
                        <SubscriptionRow 
                            label={i18n?.t('Package Type')} 
                            value={user?.activeSubscription?.subscription_type} 
                        />
                        <SubscriptionRow 
                            label={i18n?.t('Package Amount')} 
                            value={`${user?.activeSubscription?.currency || ''}${user?.activeSubscription?.payment?.amount || 0}`} 
                        />
                         <SubscriptionRow 
                            label={i18n?.t('Payment Method')} 
                            value={user?.activeSubscription?.payment?.method} 
                        />
                        <SubscriptionRow 
                            label={i18n?.t('Payment Status')} 
                            value={user?.activeSubscription?.payment?.status} 
                        />
                        <SubscriptionRow 
                            label={i18n?.t('Next Payment Date')} 
                            value={dayjs(user?.activeSubscription?.end_date).format('DD MMM YYYY')} 
                        />
                        <div>
                            <Button onClick={()=>push('/pricing-plan')} className='!py-2'>{i18n?.t('Upgrade Package')}</Button>
                        </div>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center p-6 border border-gray-300 rounded-md bg-gray-50'>
                        <img src='/nosubs.png' alt='No Subscription' className='object-cover w-44' />
                        <p className='text-[16px] font-normal font-poppins leading-[25.6px] text-textMain mb-5'>{i18n?.t('No Subscription Found.')}</p>
                        <Button onClick={()=>push('/pricing-plan')} className='!py-2'>{i18n?.t('Buy Subscription')}</Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Page;
