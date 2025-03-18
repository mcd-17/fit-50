'use client';
import React, { useEffect, useState } from 'react';
import FormInput from '../form/input';
import {  Form, Input, message, Modal } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '../../app/contexts/user';
import { fetchAdminSettings, postLogin, postResetPassword, postVerifyOtp, sendOtp } from '../../app/helpers/backend'
import OTPInput from 'react-otp-input';
import { useTimer } from 'use-timer';
import { useI18n } from '../../app/providers/i18n';
import { useFetch } from '../../app/helpers/hooks';


const SignIn = () => {
    const router = useRouter();
    const i18n = useI18n();
    const [data] = useFetch(fetchAdminSettings);
    const [loadingRequest, setLoadingRequest] = useState(true);
    const { getUser, user } = useUser();
    const [form] = Form.useForm();
    const [otpform] = Form.useForm();
    const [newform] = Form.useForm();
    const [otpModal, setOtpModal] = useState(false);
    const [newPass, setNewPass] = useState(false);
    const [email, setEmail] = useState('');
    const [forgetValues, setForgetValues] = useState({});
    const [forget, setForget] = useState(false);
    const [getEmail, setGetEmail] = useState('');
    const handleSubmit = async (values) => {
        setLoadingRequest(true)
        const { error, msg, data } = await postLogin(values)
        if (error) {
            message.error(msg)
            setLoadingRequest(false)
        }
        else {
            if (data?.role === "trainer") {
                localStorage.setItem('token', data?.token)
                await getUser()
                setLoadingRequest(false)
                router.push("/trainer")
                message.success(msg)
            } else if (data?.role === "admin") {
                setLoadingRequest(false)
                localStorage.setItem('token', data?.token)
                await getUser()
                router.push("/admin")
                message.success(msg)
            }
            else if(data?.role === "employee"){
                setLoadingRequest(false)
                localStorage.setItem('token', data?.token)
                await getUser()
                router.push("/admin")
                message.success(msg)
            }
            else {
                localStorage.setItem('token', data?.token)
                await getUser()
                setLoadingRequest(false)
                router.push("/user")
                message.success(msg)
            }
        }
    }

    const { time, start, pause, reset, status } = useTimer({
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
            }else if(user.role === 'employee'){
                router.push('/admin');
            }
        }
        setLoadingRequest(false);
    }, [user, router]);

    return (
        <div className='px-2 sm:px-8 md:px-0 lg:mt-[120px] mt-[20px] max-w-[1320px] mx-auto'>
            <h2 className='heading text-center font-poppins'>{i18n?.t("Sign In to your Account")} </h2>
            <div className='lg:mt-[116px] mt-[40px] w-full flex items-center flex-col md:flex-row space-x-0 md:space-x-14 lg:space-x-20 bg-primary rounded'>
                <div className='w-[50%] relative'>
                    <p className='p-0 md:p-6 mt-10 md:mt-0 text-element md:!flex !hidden !text-5xl md:!text-[80px] lg:!text-[100px] xl:!text-[130px] md:!text-6xl font-montserrat !text-center'>
                        {data?.title?.slice(0, 8)}
                    </p>
                    <Image
                        className='hidden md:flex absolute lg:left-[9.15rem] md:left-[1.15rem] md:top-[calc(-290px)]'
                        src='/signin.png'
                        alt='Login Image'
                        width={350}
                        height={780}
                    />
                </div>
                <div className='md:w-[50%] w-full md:pl-6 pl-4 md:px-0 pr-4 md:pr-6 lg:pr-[100px] xl:pr-[112px] py-10'>
                    <div className='text-white control-form'>
                        <p className='text-[32px] font-bold font-montserrat capitalize'>{i18n?.t('Sign In')} </p>
                        <div className='mt-4 md:mt-10'>
                            <Form className='space-y-4 ' onFinish={handleSubmit} form={form}>
                                <FormInput
                                    label={i18n?.t('Email')}
                                    name='email'
                                    placeholder={i18n?.t('Email')}
                                    type='email'
                                    className="border placeholder:!text-black text-gray/70 border-[#ffff] w-full p-4 rounded bg-primary"
                                    rules={[{ required: true, message: (i18n?.t('Please input your email!')) }, { type: 'email', message: (i18n?.t('Please enter a valid email address')) }]}
                                />
                                <FormInput
                                    label={i18n?.t('Password')}
                                    name='password'
                                    placeholder={i18n?.t('Password')}
                                    type='password'
                                    className="border custom-input text-white border-[#D9D9D9] w-full p-4 rounded bg-primary"
                                    rules={[
                                        {
                                            required: true,
                                            message: (i18n?.t('Please input your password!')),
                                        },
                                    ]}
                                />
                                <div className='description !text-white mt-3 md:mt-0'>
                                    <div onClick={() => setForget(true)} className='!text-white cursor-pointer description underline font-poppins'>{i18n?.t('Forgot Password?')}</div>
                                </div>
                                <button
                                    type="submit"
                                    className="auth-button flex items-center gap-2 justify-center !text-primary !bg-white font-poppins h-[56px] !mt-12"
                                >
                                    {i18n?.t('Sign In')}
                                    {loadingRequest && (
                                        <span className="custom-loader ml-2"></span>
                                    )}
                                </button>
                            </Form>
                            <p className='mt-4 !text-white description font-poppins'>{i18n?.t('Don’t have an account?')} <Link className='text-white underline font-poppins' href='/signup'>{i18n?.t('Sign Up')}</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='otp-modals'>
                <Modal open={forget} maskClosable={false} className='relative !w-[520px]  flex flex-col h-fit items-center  mx-auto' footer={null} width={1000} onCancel={() => setForget(false)} >
                    <div className=' sm:w-[422px] w-full flex flex-col items-center mt-3 '>
                        <h1 className='md:text-[32px] text-2xl font-bold mb-3 text-center capitalize text-[#2B2B2B]'>{('forget your password')}</h1>
                        <p className='md:text-sm text-xs text-center font-poppins  '>Please confirm your email address below and we will send you a verification code.</p>
                        <Form
                            form={form}
                            onFinish={async (values) => {
                                if (!!values?.email) {
                                    setEmail(values?.email)
                                    const { error, msg, data } = await sendOtp({ email: values?.email, action: 'forgot_password' });
                                    if (error) {
                                        return message.error(msg);
                                    } else {
                                        setOtpModal(true);
                                        message.success(`${('OTP sent to')} ${values?.email}`);
                                        setForgetValues(values);
                                        setGetEmail(values?.email);
                                        setForget(false);
                                    }
                                }
                            }}
                            layout="vertical"
                        >
                            <div className="sm:w-[422px] w-[280px] forgetPass mt-10">
                                <FormInput
                                    name="email"
                                    label={('Email')}
                                    rules={[{ required: true, message: (i18n?.t('Please input your email!')) }, { type: 'email', message: (i18n?.t('Please enter a valid email address')) }]}
                                    placeholder={(i18n?.t('Email'))}
                                    className="!py-2 "
                                />
                            </div>

                            <button className='bg-primary text-white w-full !text-lg py-[14px] rounded-md mt-6 button_paragraph'  >{i18n?.t('Continue')}</button>
                        </Form>
                    </div>
                </Modal>
            </div>
            {/* otp modal  */}
            <div className=''>
                <Modal open={otpModal} maskClosable={false} className=' !w-[520px] rounded flex flex-col items-center ' footer={null} width={1000} onCancel={() => setOtpModal(false)} >
                    <div className='  py-5 w-full flex flex-col items-center '>
                        <h1 className='md:text-[32px] text-2xl font-bold mb-3 text-center capitalize text-[#2B2B2B]'>{i18n?.t('Verify Code')}</h1>
                        <p className='md:text-sm text-xs text-center font-poppins w-[70%] '>{i18n?.t('Please enter the verification code sent to')} {getEmail} <span className='font-medium text-primary'>{getEmail}</span> </p>
                        <Form
                            form={otpform}
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
                                            ...forgetValues,
                                            otp: values?.otp,
                                            action: 'forgot_password',
                                            email: forgetValues?.email
                                        }
                                        const { error, msg, data } = await postVerifyOtp(payload);
                                        if (error) {
                                            return message.error(msg);
                                        } else {
                                            message.success(msg);
                                            localStorage.setItem('token', data.token);
                                            setOtpModal(false);
                                            setNewPass(true)
                                            otpform.resetFields()
                                        }
                                    }
                                }
                            }
                        >

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
                            <p className="dark:text-White_Colo capitalize mt-6 mb-2 md:text-sm text-xs font-poppins">
                                {i18n?.t(`Didn't receive the code?`)} {
                                    time === 0 ?
                                        <span
                                            className="text-primary cursor-pointer"
                                            onClick={async () => {
                                                const { error, msg } = await sendOtp({ email: email, action: 'forgot_password' });
                                                if (error) return message.error(msg)
                                                message.success(msg)
                                                reset()
                                                start()

                                            }}
                                        >
                                            {i18n?.t("Resend")}
                                        </span>
                                        :
                                        <span className="text-primary">
                                            {(`resend in`)} {time} {('s')}
                                        </span>
                                }
                            </p>
                            <button className='bg-primary text-white w-full !text-lg py-[14px] rounded-md mt-2 button_paragraph'  >{('Verify')}</button>
                            <p className='md:text-sm text-xs font-poppins mt-6'>{i18n?.t("Already have an account?")}<span className='text-primary'><Link onClick={() => setOtpModal(false)} href='/signin'>{i18n?.t('Sign in now')}</Link></span></p>
                        </Form>
                    </div>
                </Modal>
            </div>
            <div className=''>
                <Modal open={newPass} maskClosable={false} className=' !w-[520px] rounded flex flex-col items-center ' footer={null} width={1000} onCancel={() => setNewPass(false)} >
                    <div className=' py-5 w-full flex flex-col  '>
                        <h1 className='md:text-[32px] text-2xl font-bold mb-3 text-center capitalize text-[#2B2B2B]'>{i18n?.t('Reset your password')}</h1>
                        <Form form={newform} layout="vertical" onFinish={async (values) => {
                            const payload = {
                                ...values,
                                token: localStorage.getItem('token')
                            }
                            const { error, msg, data } = await postResetPassword(payload)
                            if (error) {
                                message.error(msg)
                            } else {
                                message.success(msg)
                                router.push('/signin')
                                setNewPass(false)
                                newform.resetFields()
                            }
                        }}>
                            <div className='w-full mt-8'>
                                <Form.Item
                                    name="password"
                                    label={i18n?.t("New Password")}
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n?.t('Please input your password!'),
                                        },
                                    ]}
                                    hasFeedback
                                    className='w-full'
                                >
                                    <Input.Password placeholder={i18n?.t("'Enter new password'")} className=' focus:text-dark_text border w-full rounded-md h-10  pl-2 py-3' />
                                </Form.Item>
                                <Form.Item
                                    name="confirm_password"
                                    label={"Re-type Password"}
                                    dependencies={['password']}
                                    className='w-full mt-3'
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
                                                return Promise.reject(new Error(i18n?.t('The two passwords that you entered do not match!')));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder={i18n?.t("'Re-type password'")} className=' focus:text-dark_text w-full border rounded-md h-10  pl-2 py-3' />
                                </Form.Item>
                            </div>
                            <button className='bg-primary text-white w-full h-10 rounded-md mt-4 button_paragraph'  >{i18n?.t('Reset')}</button>
                        </Form>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
export default SignIn;
