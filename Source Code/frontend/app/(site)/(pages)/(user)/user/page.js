'use client';
import React, { useEffect } from 'react';
import { Form } from 'antd';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { useAction } from '../../../../helpers/hooks';
import { userProfileUpdate } from '../../../../helpers/backend';
import { useUser } from '../../../../contexts/user';
import PhoneNumberInput from '../../../../../components/form/phoneNumberInput';
import MultipleImageInput from '../../../../../components/form/multiImage';
import FormSelect from '../../../../../components/form/select';
import FormDatePicker from '../../../../../components/form/date_picker';
import dayjs from 'dayjs';
import { useI18n } from '../../../../providers/i18n';

const AccountSettings = () => {
    const [form] = Form.useForm();
    const { user, getUser } = useUser();
    const i18n = useI18n();

    useEffect(() => {
        form.setFieldsValue({
            ...user,
            image: user?.image
                ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: user?.image,
                    },
                ]
                : '',
            dob: user?.dob ? dayjs(user?.dob) : null,
        });
    }, [user?._id]);

    const genders = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];
    return (
        <>
            <h1 className='profileHeading'>{i18n?.t('Profile')}</h1>
            <hr />
            <Form
                form={form}
                layout='vertical'
                onFinish={async (values) => {
                    const dateofbarth = values?.dob
                        ? dayjs(values?.dob).format('YYYY-MM-DD')
                        : 'null';
                    return await useAction(
                        userProfileUpdate,
                        {
                            ...values,
                            dob: dateofbarth,
                            image: values?.image?.[0]?.originFileObj,
                        },
                        () => {
                            getUser();
                        }
                    );
                }}
            >
                <div className='user-phone flex flex-col gap-5'>
                    <h2 className='mt-4 text-[18px] font-medium capitalize'>
                        {i18n?.t('personal info')}
                    </h2>
                    <MultipleImageInput name='image' label={i18n?.t('Image')} />
                    <HiddenInput name='_id' />
                    <FormInput
                        name={i18n?.t('name')}
                        label={i18n?.t('Name')}
                        placeholder={i18n?.t('Name')}
                        rules={[{ required: true, message: ('Please input your Name!') }]}
                    />
                    <FormInput
                        name={i18n?.t('email')}
                        label={i18n?.t('Email')}
                        placeholder={i18n?.t('Email')}
                        isEmail
                        readOnly
                    />
                    <FormInput
                        name={i18n?.t('address')}
                        label={i18n?.t('Address')}
                        placeholder={i18n?.t('Address')}
                    />
                    <PhoneNumberInput
                        name={i18n?.t('phone')}
                        label={i18n?.t('Phone Number')}
                        placeholder={i18n?.t('Phone Number')}
                        rules={[
                            {
                                required: true,
                                message: ('Please input your password!'),
                            },
                            {
                                min: 6,
                                message: ('Password must be at least 6 characters long!'),
                            },
                        ]}
                        hasFeedback
                    />
                    <FormInput
                        textArea={true}
                        name={i18n?.t('about')}
                        label={i18n?.t('About')}
                        placeholder='About'
                    />
                    <FormDatePicker
                        name={i18n?.t('dob')}
                        label={i18n?.t('Date of Birth')}
                        placeholder={i18n?.t('Date of Birth')}
                    />
                    <FormSelect
                        name={i18n?.t('gender')}
                        label={i18n?.t('Gender')}
                        placeholder={i18n?.t('Gender')}
                        options={genders.map((gender) => ({
                            label: gender.label[i18n.langCode],
                            value: gender.value,
                        }))}
                    />

                    <button
                        type='submit'
                        className='rounded bg-primary px-[30px] py-3 text-[16px] font-medium capitalize text-white duration-300 hover:scale-105'
                    >
                        {i18n?.t('Save Change')}
                    </button>
                </div>
            </Form>
        </>
    );
};

export default AccountSettings;
