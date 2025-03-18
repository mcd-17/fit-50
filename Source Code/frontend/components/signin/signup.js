"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Form, message, Modal } from 'antd';
import FormInput from '../form/input';
import { useRouter } from 'next/navigation';
import { useUser } from '../../app/contexts/user';
import OTPInput from 'react-otp-input';
import { useTimer } from 'use-timer';
import { fetchAdminSettings, postRegister, sendOtp } from '../../app/helpers/backend';
import PhoneNumberInput from '../form/phoneNumberInput';
import { useI18n } from '../../app/providers/i18n';
import { useFetch } from '../../app/helpers/hooks';

const SignUp = () => {
    const [form] = Form.useForm();
    const router = useRouter()
    const i18n = useI18n();
    const [data] = useFetch(fetchAdminSettings);
    const [loadingRequest, setLoadingRequest] = useState(true)
    const [value, setValue] = useState('user');
    const [otpModal, setOtpModal] = useState(false);
    const [email, setEmail] = useState('');
    const [registrationValues, setRegistrationValues] = useState({});
    const { getUser, user } = useUser();
    const [getEmail, setGetEmail] = useState('');
    const { time, start, pause, reset } = useTimer({
        initialTime: 150,
        timerType: 'DECREMENTAL',
    });

    useEffect(() => {
        if (email) {
            start()
        }
        if (time === 0) pause()
    }, [time, start, pause, email])

    useEffect(() => {
        if (user?.role) {
            setLoadingRequest(false);
            if (user.role === 'admin') {
                router.push('/admin');
            } else if (user.role === 'user') {
                router.push('/user');
            } else if (user.role === 'trainer') {
                router.push('/trainer');
            }
        }
        setLoadingRequest(false);
    }, [user, router]);

    return (
        <div className='container lg:my-[120px] my-[60px] otp-modal'>
            <h2 className='heading text-center font-poppins'>{i18n?.t('Create An Account')}</h2>
            <div className='bg-primary flex h-full px-4 sm:px-[27px] lg:px-[77px] sm:py-[20px] py-4 lg:py-[50px] gap-[66px] mt-10 rounded'>
                <div className='relative lg:w-1/2 w-full h-full hidden lg:block'>
                    <p className='p-0 md:p-6 mt-10 md:mt-0 text-element  text-5xl xl:text-[100px] lg:text-[86px] font-montserrat !text-center absolute top-[50%]'>{data?.title?.slice(0, 8)}</p>
                    <Image className='relative h-full w-full' src='/signup.png' alt='Login Image ' width={400} height={780} />
                </div>
                <div className=' lg:w-1/2 w-full control-form '>
                    <div className='text-white'>
                        <p className='text-[32px] font-bold font-montserrat capitalize'>{i18n?.t("let's join us")}</p>
                        <div className='my-6 flex gap-5 text-[16px] font-medium'>
                            <h2 className='font-poppins'>{i18n?.t('Create An User Account')} <Link href="/signin" className='text-primary font-bold'>{i18n?.t('Sign in')}</Link></h2>
                        </div>
                        <div className=''>
                            <Form className='space-y-4  '
                                form={form}
                                onFinish={async (values) => {
                                    if (!!values?.email) {
                                        setEmail(values?.email)
                                        const { error, msg, data } = await sendOtp({ email: values?.email, phone: values?.phone, role: value || 'user', action: 'registration' });
                                        if (error) {
                                            return message.error(msg);
                                        } else {
                                            message.success(`${('OTP sent to')} ${values?.email} `)
                                            setOtpModal(true);
                                            setGetEmail(values?.email)

                                            values.role = value || 'user';
                                            setRegistrationValues(values);
                                        }
                                    }
                                }}>
                                <FormInput
                                    label={i18n?.t('Name')}
                                    name='name'
                                    placeholder={i18n?.t('Name')}
                                    type='text'
                                    className="border custom-input placeholder:text-black border-[#D9D9D9] w-full p-4 rounded bg-primary"
                                    rules={[{ required: true, message: i18n?.t('Please input your Name!') }]}
                                />
                                <FormInput
                                    label={i18n?.t('Email')}
                                    name='email'
                                    placeholder={i18n?.t('Email')}
                                    type='email'
                                    className="border custom-input text-white border-[#D9D9D9] w-full p-4 rounded bg-primary"
                                    rules={[{ required: true, message: i18n?.t('Please input your Email!') }, { type: 'email', message: i18n?.t('Please enter a valid email address') }]}
                                />
                                <PhoneNumberInput name="phone" label={i18n?.t('Phone Number')} required={true} />
                                <FormInput
                                    label={i18n?.t('Password')}
                                    name='password'
                                    placeholder={i18n?.t('Password')}
                                    type='password'
                                    className="border custom-input text-white border-[#D9D9D9] w-full p-4 rounded bg-primary"
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n?.t('Please input your password!'),
                                        },
                                        {
                                            min: 6,
                                            message: i18n?.t('Password must be at least 6 characters long!'),
                                        },
                                    ]}
                                    hasFeedback
                                />
                                <FormInput
                                    label={i18n?.t('Confirm Password')}
                                    name='confirm_password'
                                    placeholder={i18n?.t('Confirm Password')}
                                    type='password'
                                    className="border custom-input !mb-10 text-white border-[#D9D9D9] w-full p-4 rounded bg-primary"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n?.t('Please confirm your password!'),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(i18n.t('The new password that you entered do not match!')));
                                            },
                                        }),
                                    ]}
                                />
                                <button type='submit' className='auth-button flex items-center gap-2 justify-center !text-primary !bg-white font-poppins h-[56px] !mt-12'>{i18n?.t('Sign Up')} {loadingRequest && (
                                    <span className="custom-loader ml-2"></span>
                                )}</button>
                            </Form>
                            <p className='mt-4 !text-white description !text-left font-poppins'>{i18n?.t('Already have an account ?')}<Link className='text-white underline font-poppins' href='/signin'> {i18n?.t('Signin')}</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>
                <Modal open={otpModal} maskClosable={false} className=' !w-[520px] rounded flex flex-col items-center' footer={null} width={1000} onCancel={() => setOtpModal(false)} >
                    <div className='w-full flex flex-col items-center mt-5'>
                        <h1 className='md:text-[32px] text-2xl font-bold mb-3 text-center capitalize text-[#2B2B2B]'>{('Verify Code')}</h1>
                        <p className='md:text-sm text-xs text-center font-poppins w-[70%] '>{i18n?.t('Please enter the verification code sent to your email')} <span className='font-medium text-primary'>{getEmail}</span> </p>
                        <Form
                            name="basic"
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={
                                async (values) => {
                                    if (!!values?.otp) {
                                        const payload = {
                                            ...registrationValues,
                                            otp: values?.otp,
                                        }
                                        const { error, msg, data } = await postRegister(payload);
                                        if (error) {
                                            return message.error(msg);
                                        } else {
                                            setOtpModal(false);

                                            if (data?.role === "agent") {
                                                router.push("/agent-profile")
                                                localStorage.setItem('token', data.token)
                                                message.success(msg)
                                            } else if (data?.role === "admin") {
                                                router.push("/admin")
                                                localStorage.setItem('token', data.token)
                                                message.success(msg)
                                            }
                                            else {
                                                router.push("/")
                                                localStorage.setItem('token', data.token)
                                                getUser()
                                                message.success(msg)
                                            }
                                        }
                                    }
                                }
                            }
                        >

                            <div className='w-full flex flex-col items-center  '>
                                <Form.Item
                                    name="otp"
                                    className='my-8'
                                >
                                    <OTPInput
                                        numInputs={4} renderInput={(props) => <input {...props} />} inputStyle={{
                                            width: '50px',
                                            height: '48px',
                                            marginRight: '1rem',
                                            fontSize: '20px',
                                            border: '1px solid #F79C39',
                                            outline: 'none',
                                            borderRadius: '8px',
                                        }} />

                                </Form.Item>
                                <p className="dark:text-White_Colo capitalize mt-6 mb-2 md:text-sm text-xs font-poppins  ">
                                    {i18n?.t(`Didn't receive the code?`)} {
                                        time === 0 ?
                                            <span
                                                className="text-primary cursor-pointer"
                                                onClick={async () => {
                                                    const { error, msg } = await sendOtp({ email: email, action: 'registration' });
                                                    if (error) return message.error(msg)
                                                    message.success(msg)
                                                    reset()
                                                    start()

                                                }}
                                            >
                                                {i18n?.t('Resend')}
                                            </span>
                                            :
                                            <span className="text-primary">
                                                {i18n?.t(`resend in`)} {time} {('s')}
                                            </span>
                                    }
                                </p>
                                <button className='bg-primary text-white w-full !text-lg py-[14px] rounded-md mt-2 button_paragraph'  >{i18n?.t('Verify')}</button>
                                <p className='md:text-sm text-xs font-poppins mt-6'>{i18n.t("Already have an account?")} <span className='text-primary'><Link onClick={() => setOtpModal(false)} href='/signin'>{i18n?.t('Sign in now')}</Link></span></p>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
export default SignUp;
