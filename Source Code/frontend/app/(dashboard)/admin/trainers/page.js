'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Form, Modal, Progress } from 'antd';
import Image from 'next/image';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import { useAction, useFetch } from '../../../helpers/hooks';
import { addTrainer, delTrainer, employeePasswordChange, fetchTrainers } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import FormInput from '../../../../components/form/input';
import PhoneNumberInput from '../../components/form/phoneNumberInput';
import PageTitle from '../../components/common/page-title';
import FormPassword from '../../../../components/form/password';

const Page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchTrainers);
    const [viewModal, setViewModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [open, setOpen] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [trainerId, setUserId] = useState('');

    const columns = [
        {
            text: 'Registered At',
            dataField: 'createdAt',
            formatter: (_, d) => (<>{dayjs(d?.createdAt).format('DD MMM YYYY')}</>),
        },
        {
            text: 'Name',
            dataField: 'name',
        },
        {
            text: 'Phone Number',
            dataField: 'phone',
        },
        {
            text: 'Email',
            dataField: 'email',
        }
        ,
        {
            text: "",
            dataField: "hasSubscription",
            formatter: (_, d) => (
                <>
                    {
                        <Button
                            className='border-primary bg-primary text-white !py-[3px] !h-fit !text-xs'
                            onClick={() => {
                                setIsReset(true);
                                setUserId(d?._id);
                            }}
                        >
                            {i18n.t('Reset Password')}
                        </Button>
                    }
                </>
            ),
        }
    ];
    const handleResetPassword = async (values) => {
        return useAction(
            employeePasswordChange,
            {
                _id: trainerId,
                new_password: values?.password,
                confirm_password: values?.confirm_password
            },
            () => {
                setIsReset(false);
                getData();
                form.resetFields();
            }
        );
    };

    return (
        <>
            <PageTitle title={'Trainers List'} />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        onClick={() => {
                            setOpen(true);
                        }}
                    >
                        {i18n?.t('Add Trainer')}
                    </Button>
                }
                indexed
                onDelete={delTrainer}
                pagination
                langCode={langCode}
                onView={(trainer) => {
                    setSelectedTrainer(trainer);
                    setViewModal(true);
                }}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n?.t('Add Trainer')}
                footer={null}
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    layout='vertical'
                    onFinish={(values) =>
                        useAction(addTrainer, values, () => {
                            setOpen(false);
                            getData();
                            form.resetFields();
                        })
                    }
                    className='mt-5'>
                    <FormInput name='name' label={'Name'} required={true} placeholder={"Enter Name"} />
                    <div className='flex flex-col gap-4'>
                        <PhoneNumberInput
                            name='phone'
                            label={`${i18n?.t('Phone Number')}`}
                            required={true}
                        />
                        <FormInput name='email' label={'Email'} required={true} className="!mt-4" placeholder={"Enter Email"} />
                    </div>
                    <FormPassword
                        name='password'
                        label={'Password'}
                        required={true}
                        placeholder={"Enter Password"}
                    />
                    <Button
                        type='submit'
                        className='mt-2.5 !px-10 !h-fit !py-2'
                    >
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>
            <Modal
                open={viewModal}
                onCancel={() => setViewModal(false)}
                title={<p className='text-2xl font-semibold '>{i18n?.t('Trainer Details')}</p>}
                footer={null}
            >
                {selectedTrainer && (
                    <div className='w-full flex gap-6 flex-col bg-white rounded-lg pb-3'>
                        <div className='flex justify-center mt-5'>
                            <Image
                                src={selectedTrainer.image ? selectedTrainer.image : "/defaultimg.jpg"}
                                width={120}
                                height={120}
                                alt='profile image'
                                className='w-[120px] h-[120px] rounded-full shadow-md border'
                            />
                        </div>
                        <div className='w-full'>
                            {[
                                { label: i18n?.t("Name"), value: selectedTrainer.name, icon: '👤' },
                                { label: i18n?.t("Email"), value: selectedTrainer.email, icon: '✉️' },
                                { label: i18n?.t("Phone"), value: selectedTrainer.phone, icon: '📞' },
                                { label: i18n?.t("Date"), value: dayjs(selectedTrainer.createdAt).format('DD-MMM-YYYY'), icon: '⚧️' },
                            ].map((item, index) => (

                                <div key={index} className={`flex justify-between items-center gap-4 pb-4 w-full ${index < 6 ? 'border-b border-gray-200' : ''}`}>
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="text-gray-500">{item.icon}</span>
                                        <h3 className='text-sm text-gray-600 capitalize font-semibold'>{item.label}</h3>
                                    </div>
                                    <h3 className='text-sm text-gray-800 font-medium truncate mt-4'>{item.value ? item.value : "N/A"}</h3>
                                </div>
                            ))}
                        </div>
                        {
                            selectedTrainer?.skills?.length > 0 && (
                                <div className='mt-3 '>
                                    <h1 className='text-[#2B2B2B] text-xl font-semibold'>Trainer Skills</h1>
                                    <hr className='mt-5' />
                                    <div className='mt-4 flex flex-col gap-6'>
                                        {
                                            selectedTrainer?.skills?.map(skill => (
                                                <div key={skill?._id} className=''>
                                                    <h3 className='text-[#2b2b2b] text-sm font-semibold capitalize'>{skill?.name}</h3>
                                                    <Progress strokeColor="#E67529" percent={skill?.level} size="small" />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}
            </Modal>
            <Modal
                open={isReset}
                onCancel={() => { setIsReset(false); form.resetFields(); }}
                footer={null}
                title={i18n?.t('Reset Password')}
                destroyOnClose={true}
                maskClosable={false}
            >
                <Form
                    onFinish={handleResetPassword}
                    layout='vertical'
                    className='space-y-4'
                >
                    <FormPassword
                        name='password'
                        label={i18n.t('New Password')}
                        type={'password'}
                        placeholder={i18n?.t('Enter New Password')}
                    />
                    <FormPassword name='confirm_password'
                        label={i18n.t('Confirm Password')}
                        className='mb-4' confirm={true}
                        placeholder={"Enter Confirm Password"}
                    />
                    <Button type='submit' loading={loading}>
                        {i18n?.t('Submit')}
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default Page;
