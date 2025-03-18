'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useI18n } from '../../../../../../../providers/i18n';
import { FiEye } from 'react-icons/fi';
import { MdMessage } from "react-icons/md";
import { Form, Modal } from 'antd';
import { useAction } from '../../../../../../../helpers/hooks';
import FormInput from '../../../../../../../../components/form/input';
import Button from '../../../../../../../../components/common/button';
import { postMessage } from '../../../../../../../helpers/backend';

const ListItem = ({ data }) => {
    const { push } = useRouter();
    const members = data?.docs[0]?.members || [];
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [open,setOpen] = useState(false)
    const [trainerId, setTrainerId] = useState('');
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="groupTableHead">{i18n?.t("Profile")}</th>
                        <th className="groupTableHead">{i18n?.t("Name")}</th>
                        <th className="groupTableHead">{i18n?.t("Email")}</th>
                        <th className="groupTableHead">{i18n?.t("Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="px-6 py-4">
                                <Image
                                    src={member?.image ? member?.image : "/defaultimg.jpg"}
                                    width={40}
                                    height={40}
                                    alt={member?.name || "image"}
                                    className="rounded-full shadow-md max-w-[45px] max-h-[40px]"
                                />
                            </td>
                            <td className="groupTableData">{member?.name || "N/A"}</td>
                            <td className="groupTableData">{member?.email || "N/A"}</td>
                            <td className="px-6 flex items-center gap-2 py-4 text-center">
                                <button
                                    onClick={() => push(`/trainer/group/view/${member?._id}`)}
                                    className="bg-white shadow-sm shadow-gray-400 text-[#2b2b2b] hover:bg-primary hover:text-white duration-500 p-1 rounded"
                                    title="Edit" >
                                    <FiEye size={22} />
                                </button>
                                <button
                                    onClick={() => {
                                        setOpen(true);
                                        setTrainerId(member?._id);
                                    }}
                                    className="bg-white shadow-sm shadow-gray-400 text-[#2b2b2b] hover:bg-primary hover:text-white duration-500 p-1 rounded"
                                    title="Send Message" >
                                    <MdMessage size={22} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
                onFinish={async (values) => {
                    const  { error, msg, data} = await postMessage({
                        to: trainerId,
                        message: values?.message
                    })
                    if(!error){
                        form.resetFields();
                        setOpen(false);
                        setTrainerId('');
                        push('/trainer/message')
                    }
                   
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
