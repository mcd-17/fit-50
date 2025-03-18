import React from 'react';
import { Form,  Rate } from 'antd';
import Button from '../common/button';
import FormInput from '../form/input';
import {postReviews} from '../../app/helpers/backend';
import { useAction } from '../../app/helpers/hooks';
import { useI18n } from '../../app/providers/i18n';


const WriteReview = ({ productId }) => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        const payload = {
            product: productId,
            rating: values.rating,
            review: values.review
        };
        useAction(postReviews, payload, () => form.resetFields());
    };
    return (
        <Form form={form} layout="vertical" className='border  p-7 rounded' onFinish={onFinish}>
            <Form.Item name="rating" label={i18n?.t("Rating")}  rules={[{ required: true, message: 'Please provide a rating' }]}>
                <Rate className='!text-primary'/>
            </Form.Item>
            <FormInput name="review" textArea={true} placeholder={i18n.t("Write a review")} row={4} label="Review" rules={[{ required: true, message: i18n.t('Please provide a review') }]} />
            
                <Button type="submit" className='mt-6'>
                   {i18n.t("Submit Review")}
                </Button>
        
        </Form>
    );
};

export default WriteReview;
