"use client";
import React, { useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { Form } from 'antd';
import Image from 'next/image';
import { fetchUser, userProfileUpdate } from '../../../helpers/backend';
import FormInput from '../../../../components/form/input';
import MultipleImageInput from '../../../../components/form/multiImage';
import PhoneNumberInput from '../../../../components/form/phoneNumberInput';
import { useAction, useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';

const AdminProfile = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [user, getUser] = useFetch(fetchUser)
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        form.setFieldsValue({
            ...user,
            image:
                user?.image?.length > 0
                    ? [
                        {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: user?.image,
                        },
                    ]
                    : [],
        })
    }, [user])

    return (
        <div className=' xl:w-3/5 lg:w-4/5 md:w-full mx-auto   '>
            <div className=" bg-white px-4 pt-10 sm:p-10 shadow-sm ">
                <div className='container mx-auto flex gap-3'>
                    <span
                        role="button"
                        onClick={() => setEdit(false)}
                        className={`font-semibold  cursor-pointer hover:text-primary ${!edit && 'text-primary'}`}>{i18n?.t('My Profile')}</span>
                    <span className="text-gray-500">|</span>
                    <a
                        role="button"
                        onClick={() => setEdit(true)}
                        className={`font-semibold uppercase flex hover:text-primary items-center ${edit && 'text-primary'}`}>
                        <FiEdit className="inline-block mr-1" />
                        {i18n?.t('Edit profile')}
                    </a>
                </div>
            </div>

            {
                edit ?
                    <div className='rounded-b-lg bg-white p-10 shadow-sm '>
                        <div className='container mx-auto'>
                            <Form layout="vertical" form={form}
                                onFinish={
                                    async (values) => {
                                        useAction(userProfileUpdate, { ...values, image: values?.image?.length > 0 ? values?.image[0]?.originFileObj : null }, () => {
                                            getUser()
                                            setEdit(false)
                                        })
                                    }}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 user-phone">
                                    <FormInput placeholder={("Enter Name")} name="name" label={"Name"} required />
                                    <MultipleImageInput name="image"
                                        label={"Profile Picture"}
                                        max={1}
                                        required
                                        style={{ backgroundColor: '#888AA0' }}
                                        className="!bg-[#D2D2D2]" />
                                    <FormInput placeholder={("Enter Email")} name="email" label={"Email"} readOnly style={{ backgroundColor: '#888AA0' }} className="!bg-[#D2D2D2]" />
                                    <PhoneNumberInput placeholder={("Enter Phone Number")} name="phone" label={('Phone Number')} />
                                </div>
                                <Button type='submit' className="mt-5">{i18n?.t('Update')}</Button>
                            </Form>
                        </div>
                    </div>
                    :
                    <div className='rounded-b-lg bg-white px-10 py-10 shadow-sm'>
                        <div className='container mx-auto'>
                            <div className="flex flex-col gap-1 my-3 items-center">
                                {user?.image ?
                                    <Image width={1000} height={100} src={user?.image} alt="user image" className="w-32 h-32 rounded-full border border-primary" />
                                    :
                                    <Image width={1000} height={100} src="/user.png" alt="user image" className="w-32 h-32 rounded-full border border-primary" />
                                }
                            </div>
                            <div className="flex justify-between flex-wrap items-center gap-4 mt-10">
                                <div className="flex flex-col ">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-700">{i18n?.t('Name')} :</p>
                                        <p className="font-semibold">{user?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-sm text-gray-700">{i18n?.t('Email')} :</p>
                                    <div className="flex gap-x-1 items-center">
                                        <p className="font-semibold">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <p className="text-sm text-gray-700">{i18n?.t('Phone')} :</p>
                                    <div className="flex gap-x-2 items-center">
                                        <p className="font-semibold">{user?.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
};

export default AdminProfile;