'use client';
import { Form, Input, message } from 'antd';
import React from 'react';
import { postChangePassword } from '../../../../helpers/backend';
import Button from '../../../../../components/common/button';
import { useI18n } from '../../../../providers/i18n';

const AdminChangePassword = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();

    return (
        <div className='mx-auto lg:w-3/5 sm:w-4/5 rounded bg-white px-10 py-10 '>
            <h1 className='text-2xl font-bold md:text-xl '>{i18n?.t('Change Password')}</h1>
            <hr className='border-Font2_Color w-full mt-5' />
            <div className='mx-auto bg-white py-8'>
                <Form
                    layout='vertical'
                    form={form}
                    onFinish={async (values) => {
                        const { error, msg } = await postChangePassword(values);
                        if (!error) {
                            localStorage.setItem('token', '');
                            message.success(msg);
                            window.location.href = '/signin';
                        } else {
                            message.error(msg);
                        }
                    }}
                >
                    <div className='flex flex-col gap-5'>
                        <Form.Item
                            name='old_password'
                            label={i18n?.t('Old Password')}
                            rules={[
                                {
                                    required: true,
                                    message: i18n?.t('Please input your old password!'),
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder={i18n?.t('Enter Your Old Password')}
                                className='focus:text-dark_text h-10 w-full rounded-md border pl-2'
                            />
                        </Form.Item>
                        <Form.Item
                            name='new_password'
                            label='New Password'
                            rules={[
                                {
                                    required: true,
                                    message: i18n?.t('Please input your password!'),
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                placeholder={i18n?.t('Enter Your New Password')}
                                className='focus:text-dark_text h-10 w-full rounded-md border pl-2'
                            />
                        </Form.Item>
                        <Form.Item
                            name='confirm_password'
                            label={i18n?.t('Confirm Password')}
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: i18n?.t('Please confirm your password!'),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('new_password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                'The new password that you entered do not match!'
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder={i18n?.t('Confirm Your Password')}
                                className='focus:text-dark_text h-10 w-full rounded-md border pl-2'
                            />
                        </Form.Item>
                        <Button type='submit' className='w-fit'>
                            {i18n?.t('Change Password')}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AdminChangePassword;
