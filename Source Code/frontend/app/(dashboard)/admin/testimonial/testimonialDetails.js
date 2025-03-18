"use client"
import { Modal, Rate } from 'antd';
import Image from 'next/image';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';

const TestimonialModal = ({ visible, onClose, testimonial }) => {
    const i18n = useI18n()
    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
            width={600}
            className="rounded-lg"
        >
            <div className="flex items-center mb-6">
                <Image
                    src={testimonial?.user?.image}
                    alt={testimonial?.user?.name || "user name"}
                    width={1000}
                    height={1000}
                    className="rounded-full border-2 border-primary h-[60px] w-[60px] object-cover"
                />
                <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-800">{testimonial?.user?.name}</h2>
                    <p className="text-sm text-gray-500">{testimonial?.user?.email}</p>
                </div>
            </div>

            <div className="flex items-center mb-4">
                <Rate disabled value={parseFloat(testimonial?.rating)} className="!text-primary" />
                <span className="ml-2 text-gray-600">({testimonial?.rating}.0)</span>
            </div>

            <div className="text-gray-700 mb-4 leading-relaxed">
                <p>{testimonial?.description}</p>
            </div>

            <div className="flex items-center justify-end mt-6">
                <Button className="ml-4" onClick={onClose}>{i18n?.t('Close')}</Button>
            </div>
        </Modal>
    );
};

export default TestimonialModal;
