'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import Button from '../../../../../../../../components/common/button';
import { Form, Modal } from 'antd';
import FormInput from '../../../../../../../../components/form/input';
import { useAction } from '../../../../../../../helpers/hooks';
import { postMessage } from '../../../../../../../helpers/backend';
import { useRouter } from 'next/navigation';

const ListItem = ({ data,role="" }) => {
    const [form] = Form.useForm();
    const [open,setOpen] = useState(false)
    const [trainerId, setTrainerId] = useState('');
    const router = useRouter()

    return (
        <div className='w-full'>
            <div className='flex justify-between py-4 border-b items-center text-center'>
                <div className='w-[80px]'>
                    <Image src={data?.image ? data?.image : "/defaultimg.jpg"} width={50} height={50} alt={data?.name || "image"} className='rounded-full sm:w-[56px] sm:h-[56px] w-[40px] h-[40px]' />
                </div>
                <div className='flex-1 line-clamp-1 text-center'>{data?.name ? data?.name : "-"}</div>
                <div className='flex-1 line-clamp-1 text-center'>{data?.email ? data?.email : "-"}</div>
                <div className='flex-1 line-clamp-1 text-center'>{data?.phone ? data?.phone : "-"}</div>
                {
                    role==="trainer" && <Button
                    className='border-primary bg-primary text-white !py-[3px] !h-fit !text-xs'
                    onClick={() => {
                        setOpen(true);
                        setTrainerId(data?._id);
                    }}
                >
                    {('Send Message')}
                </Button>
                }
            </div>
            <Modal
                open={open}
                onCancel={() =>{ setOpen(false); setTrainerId('');}}
                footer={null}
                width={600}
                className="rounded-lg"
                destroyOnClose
                maskClosable={false}
            >
                <Form 
                form={form}
                onFinish={(values) => {
                    useAction(postMessage, {
                        to: trainerId,
                        message: values?.message
                    }, () => {
                    form.resetFields();
                    setOpen(false);
                    setTrainerId('');
                    router.push('/user/message')
                    })
                   
                }}
                >
                <FormInput name='message' label={'Message'} textArea={true} placeholder={"please write your message here"} required={true} />
                <Button
                type='submit'
                    className='border-primary bg-primary text-white !py-[6px] !h-fit !text-xs mt-2'
                >
                    {('Send Message')}
                </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default ListItem;