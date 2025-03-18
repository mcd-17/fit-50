import { Rate } from 'antd';
import Image from 'next/image';
import React from 'react';
import dayjs from 'dayjs';
import { useI18n } from '../../app/providers/i18n';

const Review = ({ review }) => {
    const i18n = useI18n()
    if (!review?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-2xl font-semibold text-gray-700">{i18n?.t("No Reviews Yet")}</p>
                <p className="text-gray-500">{i18n?.t("Be the first to share your thoughts on this product!")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {review.map((val) => (
                <div key={val._id} className="flex flex-col md:flex-row gap-6 p-8 border border-gray-200 rounded-lg shadow-sm">
                    <Image
                        className="rounded-full !h-fit"
                        src={val?.user?.image || '/default-avatar.png'}
                        alt={`${val?.user?.name}'s profile picture`}
                        width={80}
                        height={80}
                    />
                    <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                            <Rate disabled defaultValue={val?.rating} className='!text-primary'/>
                            <span className="text-sm text-gray-500">{dayjs(val?.createdAt).format('DD MMM YYYY')}</span>
                        </div>
                        <p className="font-semibold text-gray-800">{val?.user?.name}</p>
                        <p className="text-gray-600">{val?.review}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Review;
