"use client"
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, message } from 'antd';
import { MdLocalPhone, MdLockOutline, MdOutlineFace } from 'react-icons/md';
import { HiMail } from 'react-icons/hi';
import axios from 'axios';
const { Option } = Select;
import { useRouter } from "next/navigation";
import Head from 'next/head';
import { useI18n } from '../../../providers/i18n';


const Setting = () => {
    const i18n = useI18n()
    const router = useRouter();
    const [getSetting, setSetting] = useState(true);
    const [getLoader, setLoader] = useState(false)

    useEffect(() => {
        const checkEnvFile = async () => {
            const { data } = await axios.get(process.env.backend_url);
            if (data?.status === true && data?.env === false) {
                setSetting(pre => pre = true);

            } else {
                router.push('/signin')
            }
        }
        checkEnvFile();
    }, [])

    const onFinish = async (values) => {
        setLoader(pre => pre = true)

        const adminInfo = {};
        adminInfo["name"] = values.name;
        adminInfo["email"] = values.email;
        adminInfo["phone"] = values.phone;
        adminInfo["password"] = values.password;
        adminInfo["confirmPassword"] = values.confirmPassword;

        delete values["name"]
        delete values["email"]
        delete values["phone"]
        delete values["password"]
        delete values["confirmPassword"]

        const DATABASE_URL = values.database_string;

        const valueString = (
            values.database_string + "\n \n"

            + values.aws_bucket_name + "\n"
            + values.aws_access_key_id + "\n"
            + values.aws_secret_access_key + "\n"
            + values.aws_region + "\n"

            + values.website_name + "\n"
            + values.frontend_url + "\n"
            + values.backend_url + "\n"
        )

        const { data } = await axios.post(process.env.backend_url + 'setting', { valueString, adminInfo, DATABASE_URL })

        if (data?.status === true && data?.env === true) {
            message.success('Setup Successful, Please Restart Backend Server');

        } else {
            message.warning(data?.message)
        }
        setLoader(pre => pre = false)
    };

    if (getSetting === true) {
        return (
           <div>
             <div className='flex justify-center items-center pb-[5%] pt-[3%] bg-gray-200 min-h-screen relative'>
                <div className='h-auto md:w-1/2 border rounded p-10 hero_font_family bg-white shadow scrollbar'>
                    <h3 className='text-center text-primary pb-4 border-b-[1px] border-b-primary'>Quick Setup</h3>
                    <p className='text-center'> --- Please avoid auto suggestion --- </p>
                    <Form
                        layout="horizontal"
                        onFinish={onFinish}
                        className='my-4'
                    >
                        <div className='mb-5'>
                            <p className="text-[16px] mb-6 border-b-[1px] border-b-primary">Create Admin</p>
                            <div className='flex'>
                                <span ><MdOutlineFace className='text-2xl mt-2 mr-2' /></span>
                                <Form.Item
                                    name="name"
                                    className='border-b-2 w-full'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your name!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Enter Name for Example: yourname_123 or yourname123' bordered={false} />
                                </Form.Item>
                            </div>
                            <div className='flex'>
                                <span ><HiMail className='text-2xl mt-2 mr-2' /></span>
                                <Form.Item
                                    name="email"
                                    className='border-b-2  w-full'
                                    rules={[
                                        {
                                            required: true,
                                            message: i18n.t('Please input your email!'),
                                        },
                                        {
                                            type: 'email'
                                        }
                                    ]}
                                >
                                    <Input placeholder='Admin Email...' bordered={false} />
                                </Form.Item>
                            </div>
                            <div className='flex relative'>
                                <span ><MdLocalPhone className='text-2xl mt-2 mr-2' /></span>
                                <Form.Item
                                    name="phone"
                                    className='border-b-2  w-full'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your phone!',
                                        },
                                    ]}
                                >
                                    <Input placeholder='Admin Phone Number...' bordered={false} />
                                </Form.Item>
                            </div>
                            <div className='flex'>
                                <span><MdLockOutline className='text-2xl mt-2 mr-2' /></span>
                                <Form.Item
                                    name="password"
                                    className='border-b-2  w-full'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Input Valid Password!',
                                        },
                                        {
                                            min: 6,
                                            message: 'Please provide at least 6 characters'
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder='Password...' bordered={false} />
                                </Form.Item>
                            </div>
                            <div className='flex'>
                                <span><MdLockOutline className='text-2xl mt-2 mr-2' /></span>
                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={["password"]}
                                    className='border-b-2  w-full'
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue("password") === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject("Incorrect Password!")
                                            }
                                        })
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password placeholder='Confirm Password...' bordered={false} />
                                </Form.Item>
                            </div>
                        </div>

                        <div className='mb-5'>
                            <p className="text-[16px] mb-6 border-b-[1px] border-b-primary">Database Setup</p>
                            <Form.Item
                                name="database_string"
                                label='Database String'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input database string!',
                                    },
                                ]}
                            >
                                <Input defaultValue={"DATABASE_URL="} />
                            </Form.Item>


                            <Form.Item
                                name="website_name"
                                label='Website Name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required!',
                                    },
                                ]}
                                extra='For example: Gymstick'
                            >
                                <Input defaultValue={"WEBSITE_NAME="} />
                            </Form.Item>

                            <Form.Item
                                name="frontend_url"
                                label='Frontend URL'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required!',
                                    },
                                ]}
                                extra='For example: https://nextjs.gymstick.appstick.com.bd/'
                            >
                                <Input defaultValue={"FRONTEND_URL="} />
                            </Form.Item>

                            <Form.Item
                                name="backend_url"
                                label='BACKEND URL'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Required!',
                                    },
                                ]}
                                extra='For example: https://nextjs.gymstick.appstick.com.bd/'
                            >
                                <Input defaultValue={"BACKEND_URL="} />
                            </Form.Item>

                        </div>

                        <div>
                            <p className="text-[16px] mb-6 border-b-[1px] border-b-primary">AWS Bucket Information</p>
                            <Form.Item
                                name="aws_bucket_name"
                                label='AWS Bucket Name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input AWS Bucket Name!',
                                    },
                                ]}
                            >
                                <Input defaultValue={"AWS_BUCKET_NAME="} />
                            </Form.Item>
                            <Form.Item
                                name="aws_access_key_id"
                                label='AWS Access Key'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input AWS Access Key!',
                                    },
                                ]}
                            >
                                <Input defaultValue={"AWS_ACCESS_KEY_ID="} />
                            </Form.Item>
                            <Form.Item
                                name="aws_secret_access_key"
                                label='AWS Secret Access Key'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input AWS Secret Access Key!',
                                    },
                                ]}
                            >
                                <Input defaultValue={"AWS_SECRET_ACCESS_KEY="} />
                            </Form.Item>
                            <Form.Item
                                name="aws_region"
                                label='AWS Region'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input AWS Region!',
                                    },
                                ]}
                            >
                                <Input defaultValue={"AWS_REGION="} />
                            </Form.Item>
                        </div>


                        <div className='relative'>
                            <Form.Item>
                                <button type="submit" className='bg-primary hover:bg-primary text-white px-6 py-2 rounded shadowHover mt-5'>
                                    Submit
                                </button>
                            </Form.Item>

                            {
                                getLoader == true &&
                                <div className="flex justify-center absolute top-0 left-[40%]">
                                    <div>
                                        <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </Form>
                </div>
            </div>
           </div>
        )
    }

    return (
        <div>
            <Head>
                <title>Website Setting</title>
            </Head>
            {
                <div className="flex justify-center pt-[10%]">
                    <div>
                        <p className='text-purple-700 font-semibold text-[14px]'>Please Wait...</p>
                    </div>
                </div>
            }
        </div>
    );
};

export default Setting;