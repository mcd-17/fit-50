'use client'
import { Form, message } from 'antd';
import Image from 'next/image';
import React from 'react';
import Button from '../../../../../components/common/button';
import { postContactUs } from '../../../../helpers/backend';
import { motion } from 'framer-motion';
import { useI18n } from '../../../../providers/i18n';
import { useCurrency } from '../../../../contexts/site';
import { usePathname } from 'next/navigation';

const Joining = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const {findDefaultTheme} = useCurrency()
    const pathName = usePathname()

    const onFinish = async (values) => {
        const res = await postContactUs(values)
        if (res?.error === false) {
            message.success(res?.msg)
            form.resetFields();
        } else {
            message.error(res?.message)
        }
    };

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className='flex text-white lg:gap-4 gap-y-4 items-center lg:flex-row flex-col container lg:pb-[120px] pb-[60px] overflow-hidden'>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3 }}
                variants={leftToRightVariant}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='lg:w-1/2 w-full  '>
                <Image src={'/join.png'} width={500} height={400} alt='joining image' className='w-full h-full ' />
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.3 }}
                variants={rightToLeftVariant}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='lg:w-1/2 w-full md:px-4  px-3 lg:px-0 py-4 flex items-center '>
                <div className=' w-full '>
                    <h2 className='text-xl capitalize'>{i18n?.t("get in touch")}</h2>
                    <h1 className='text-5xl mt-[25px] text-primary font-bold mb-[50px] '>{i18n?.t("Join today!")} </h1>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        className="space-y-4 font-poppins"
                    >
                        <div className="grid sm:grid-cols-2 gap-6 mt-5 pb-2 ">
                            <div className=" ">
                                <h3 className='capitalize text-xl font-medium font-montserrat text-white mb-4'>{i18n?.t("First Name")}</h3>
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: i18n?.t("Please Provide Your First Name") }]}
                                >
                                    <input placeholder={i18n?.t('Enter First Name')} type="text" className={`w-full px-4 py-[18px] border outline-none rounded ${findDefaultTheme?.name === "home3" && pathName=== "/" ? "bg-black border-gray-100 text-white" : " bg-white text-textMain"}`} />
                                </Form.Item>
                            </div>
                            <div className=" ">
                                <h3 className='capitalize text-xl font-medium font-montserrat text-white mb-4'>{i18n?.t("Last Name")}</h3>
                                <Form.Item
                                    name="subject"
                                    rules={[{ required: true, message: i18n?.t("Please Provide Your Last Name") }]}
                                >
                                    <input placeholder={i18n?.t('Enter Last Name')} type="text" className={`w-full px-4 py-[18px] border outline-none rounded ${findDefaultTheme?.name === "home3" && pathName=== "/"  ? "bg-black border-gray-100 text-white" : " bg-white text-textMain"}`} />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6 mt-5 pb-2 ">
                            <div className=" ">
                                <h3 className='capitalize text-xl font-medium font-montserrat text-white mb-4'>{i18n?.t("Email")}</h3>
                                <Form.Item
                                    name="email"
                                    rules={[{ required: true, message: i18n?.t("Please Provide Your Email") }]}
                                >
                                    <input placeholder={i18n?.t('Enter Email')} type="email" className={`w-full px-4 py-[18px] border outline-none rounded ${findDefaultTheme?.name === "home3" && pathName=== "/"  ? "bg-black border-gray-100 text-white" : " bg-white text-textMain"}`} />
                                </Form.Item>
                            </div>
                            <div className=" ">
                                <h3 className='capitalize text-xl font-medium font-montserrat text-white mb-4'>{i18n?.t("Phone Number")}</h3>
                                <Form.Item
                                    name="phone"
                                    rules={[{ required: true, message: i18n?.t("Please Provide Your Phone Number") }]}
                                >
                                    <input placeholder={i18n?.t('Enter Phone Number')} type="number" className={`w-full px-4 py-[18px] border outline-none rounded ${findDefaultTheme?.name === "home3" && pathName=== "/"  ? "bg-black border-gray-100 text-white" : " bg-white text-textMain"}`} />
                                </Form.Item>
                            </div>
                        </div>
                        <div className=" ">
                            <h3 className='capitalize text-xl font-medium font-montserrat text-white mb-4'>{i18n?.t("Massage")}</h3>
                            <Form.Item
                                name="message"
                                rules={[{ required: true, message: i18n?.t("Please Provide Your Massage") }]}
                            >
                                <textarea placeholder={i18n?.t('Enter Massage')} type="text" className={`w-full px-4 py-[18px] border outline-none rounded ${findDefaultTheme?.name === "home3" && pathName=== "/"  ? "bg-black border-gray-100 text-white" : " bg-white text-textMain"}`} rows={5} />
                            </Form.Item>
                        </div>

                        <div className="!mt-[50px]">
                            <Button
                            pathName={findDefaultTheme?.name }
                                type="submit"
                                className="!px-8"
                            >
                                {i18n?.t("Submit")}
                            </Button>
                        </div>
                    </Form>
                </div>
            </motion.div>
        </div>
    );
};

export default Joining;