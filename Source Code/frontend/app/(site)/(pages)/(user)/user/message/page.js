'use client'
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import { FiSend, FiChevronLeft, FiPaperclip } from 'react-icons/fi'
import { useAction, useActionConfirm, useFetch } from '../../../../../helpers/hooks'
import { deleteMessage, fetchUser, messageList, pdfFileUpload, postMessage, postSingleImage, userListMessaged } from '../../../../../helpers/backend'
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime";
import { initializeSocket } from '../../../../../helpers/socket'
import { MdDelete, MdDownload } from 'react-icons/md'
import { FaRegImages } from 'react-icons/fa6'
import { Form, Modal, Image as AntImage, Tooltip } from 'antd'
import MultipleImageInput from '../../../../../(dashboard)/components/form/multiImage'
import UploadFileComponent from '../../../../../(dashboard)/components/form/pdfUpload'
dayjs.extend(relativeTime);
import { useI18n } from '../../../../../providers/i18n';
import { HiDotsVertical } from "react-icons/hi";

export default function MedicalChat() {
    const i18n = useI18n()
    const [imageForm] = Form.useForm();
    const [users, getUsers] = useFetch(userListMessaged)
    const [messageLists, getmessageList, { loading }] = useFetch(messageList, {}, false)
    const [pdfUpload, setPdfUpload] = useState(false)
    const [activeChat, setActiveChat] = useState(null)
    const [activeChatId, setActiveChatId] = useState(null)
    const [message, setMessage] = useState(null)
    const [imageModal, setImageModal] = useState(false)
    const [memberRole, setMemberRole] = useState(null)
    const [image, setImage] = useState(null)
    const [limit, setLimit] = useState(10)

    const chatEndRef = useRef(null)
    useEffect(() => {
        if (chatEndRef.current && limit <= 10) {
            chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight
        }
    }, [messageLists, activeChatId]);

    useEffect(() => {
        if (activeChatId != null) {
            getmessageList({ to: activeChatId, activeId: activeChatId })
        } else {

        }
    }, [activeChatId])

    const handleSendMessage = async (e) => {
        if (message == null) {
            return
        }
        e.preventDefault()
        const { error, msg } = await postMessage({ to: activeChatId, message: message })
        if (error === false) {
            setMessage('')
            getmessageList({
                to: activeChatId
            })
            getUsers()
        }
    }

    useEffect(() => {
        const socket = initializeSocket()
        socket.on("newMessage", (message) => {
            fetchUser().then(({ error, data }) => {
                if (error === false) {
                    if (data?._id === message?.to) {
                        getmessageList({
                            to: message?.from
                        })
                        getUsers()
                    }
                }
            });
        });
    }, [])


    useEffect(() => {
        getmessageList({
            limit: limit,
            to: activeChatId
        })
    }, [limit])

    const handleChatClick = (id, name, role) => {
        setActiveChat(null)
        setActiveChatId(null)
        setMemberRole(null)
        setMemberRole(role)
        setActiveChat(name)
        setActiveChatId(id)
    }
    const renderChatList = () => (
        <div
            className={`w-full md:w-[40%] md:border-r border-r-none ${activeChat ? "hidden lg:block" : "block"
                } bg-white shadow-lg`}
        >
            {/* Header Section */}
            <div className="px-6 py-4 border-b bg-gray-50">
                <h1 className="text-lg font-semibold text-gray-800 font-poppins">Inbox</h1>
            </div>
            <div className="px-6 py-4 border-b bg-white">
                <input
                    type="text"
                    placeholder="Search chats..."
                    onChange={(e) => {
                        getUsers({ search: e.target.value })
                    }}
                    className="w-full px-4 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            {/* Chat List Section */}
            <div className="overflow-y-auto hide-scrollbar h-[calc(80vh-73px)] space-y-2">
                {users?.map((item, index) => (
                    <div
                        key={index}
                        className={`p-4 cursor-pointer transition-all duration-300 ${activeChatId === item?.chatUser?._id
                            ? "bg-orange-100 border border-orange-300"
                            : "hover:bg-orange-50"
                            }`}
                        onClick={() => {
                            handleChatClick(item?.chatUser?._id, item?.chatUser?.name, item?.chatUser?.role)
                            setImage(item?.chatUser?.image ? item?.chatUser?.image : "/defaultimg.jpg")
                        }

                        }
                    >
                        <div className="flex gap-4 items-center">
                            <Image
                                width={48}
                                height={48}
                                src={item?.chatUser?.image ? item?.chatUser?.image : "/defaultimg.jpg"}
                                alt="User"
                                className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold text-gray-900 text-sm font-poppins capitalize line-clamp-1">
                                        {item?.chatUser?.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {item?.unseenCount > 0 && (
                                            <span className="bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold">
                                                {item?.unseenCount}
                                            </span>
                                        )}
                                        <p className="text-xs text-gray-500 font-poppins line-clamp-1">
                                            {dayjs(item?.lastMessage?.createdAt).fromNow()}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-poppins capitalize mb-1">
                                    {item?.chatUser?.role}
                                </p>
                                {item?.lastMessage?.message && (
                                    <p
                                        className={`text-xs ${item?.unseenCount > 0
                                            ? "text-gray-700 font-medium"
                                            : "text-gray-400"
                                            } font-poppins line-clamp-1`}
                                    >
                                        {item?.lastMessage?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );



    const renderChatArea = () => (
        <div className={`flex-1 flex flex-col w-full md:w-[60%] ${activeChat ? 'block' : 'hidden lg:flex'}`}>
            <div className="py-4 md:px-4 px-0 border-b flex items-center gap-3">
                <button className="lg:hidden" onClick={() => { setActiveChat(null); setActiveChatId(null); getmessageList() }}>
                    <FiChevronLeft className="h-6 w-6" />
                </button>
                <Image width={48} height={48} src={image ? image : "/defaultimg.jpg"} alt="Dr. Noura" className="h-12 w-12 rounded-full" />
                <div>
                    <h2 className="font-semibold">{activeChat || "Dr. Noura Bin Maha"}</h2>
                    <p className="text-sm text-gray-600 capitalize">{memberRole}</p>
                </div>
            </div>

            <div
                className="flex-1 p-4 overflow-y-auto hide-scrollbar h-[calc(100vh-200px)]"
                ref={chatEndRef}
            >
                {
                    messageLists?.totalDocs >= limit && (
                        <button
                            onClick={() => {
                                setLimit(limit + 10)
                            }}
                            className='flex w-fit mx-auto cursor-pointer items-center gap-2 rounded bg-primary px-[8px] py-[4px] text-xs text-white'>{loading ? "Loading..." : "Load More"}</button>
                    )
                }
                {
                    <div className="flex flex-col-reverse gap-6">
                        {messageLists?.docs?.map((msg) => (
                            <div
                                key={msg?._id}
                                className={`flex ${msg?.to !== activeChatId ? "justify-start" : "justify-end"
                                    }`}
                            >
                                {/* Image Message */}
                                {msg?.image ? (
                                    <div className={`max-w-[60%] flex flex-col relative  ${msg?.to !== activeChatId ? "items-start " : "items-end pr-2 "
                                        }`}>
                                        {msg?.to === activeChatId && (
                                            <div className='flex justify-end absolute -right-5'>
                                                <Tooltip trigger={'click'} placement='left' title={<div className='cursor-pointer'>
                                                    <p onClick={() =>
                                                        useActionConfirm(
                                                            deleteMessage,
                                                            { _id: msg?._id },
                                                            getmessageList,
                                                            i18n.t("Are you sure you want to delete this message?"),
                                                            i18n.t("warning"),
                                                            false
                                                        )
                                                    }>{i18n.t('Delete')}</p>
                                                </div>}>
                                                    <div
                                                        className={`${msg?.to !== activeChatId ? "hidden" : "flex justify-center items-center mb-2 w-[30px] h-[30px] rounded-full "
                                                            }`}
                                                    >
                                                        <HiDotsVertical
                                                            size={18}
                                                            className="text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        )}
                                        <div className="w-full h-fit overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300">
                                            <AntImage
                                                alt="message-img"
                                                src={msg?.image}
                                                width={200}
                                                className="h-[200px] w-[200px] object-contain rounded-lg"
                                            />
                                        </div>
                                    </div>
                                ) : msg?.file ? (
                                    // File Message
                                    <div className={`max-w-[60%] flex flex-col relative  ${msg?.to !== activeChatId ? "items-start " : "items-end pr-2 "
                                        }`}>
                                        <div
                                            className={`rounded-lg relative px-4 py-3 break-words ${msg?.to !== activeChatId ? "bg-gray-50  w-fit " : "bg-primary w-fit "} shadow-md`}
                                        >
                                            {/* Delete Button */}
                                            {msg?.to === activeChatId && (
                                                <div className='flex justify-end absolute -right-7'>
                                                    <Tooltip trigger={'click'} placement='left' title={<div className='cursor-pointer'>
                                                        <p onClick={() =>
                                                            useActionConfirm(
                                                                deleteMessage,
                                                                { _id: msg?._id },
                                                                getmessageList,
                                                                i18n.t("Are you sure you want to delete this message?"),
                                                                i18n.t("warning"),
                                                                false
                                                            )
                                                        }>{i18n.t('Delete')}</p>
                                                    </div>}>
                                                        <div
                                                            className={`${msg?.to !== activeChatId ? "hidden" : "flex justify-center items-center mb-2 w-[30px] h-[30px] rounded-full "
                                                                }`}
                                                        >
                                                            <HiDotsVertical
                                                                size={18}
                                                                className="text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                                                            />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            )}

                                            {/* File Link with Download Text and Icon */}
                                            {msg?.file && (
                                                <a
                                                    href={msg?.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download // This triggers a download when clicked
                                                    className={` md:text-sm text-xs font-medium underline break-words hover:text-blue-800 flex items-center ${msg?.to !== activeChatId ? " text-textMain" : "text-white "
                                                        }`}
                                                >
                                                    {/* Add a download icon */}
                                                    <MdDownload size={16} className="mr-2" />
                                                    {i18n.t('Click to download')} {msg?.file?.split("/")?.pop()}
                                                </a>
                                            )}

                                            {/* Timestamp */}

                                        </div>
                                        <div className="flex justify-end items-center mt-2">
                                            <p className="text-xs text-gray-500 font-medium">
                                                {dayjs(msg?.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`max-w-[60%] flex flex-col relative  ${msg?.to !== activeChatId ? "items-start " : "items-end pr-2 "
                                        }`}>
                                        <div className='flex justify-end absolute -right-5'>
                                            <Tooltip trigger={'click'} placement='left' title={<div className='cursor-pointer'>
                                                <p onClick={() =>
                                                    useActionConfirm(
                                                        deleteMessage,
                                                        { _id: msg?._id },
                                                        getmessageList,
                                                        i18n.t("Are you sure you want to delete this message?"),
                                                        i18n.t("warning"),
                                                        false
                                                    )
                                                }>{i18n.t('Delete')}</p>
                                            </div>}>
                                                <div
                                                    className={`${msg?.to !== activeChatId ? "hidden" : "flex justify-center items-center mb-2 w-[30px] h-[30px] rounded-full "
                                                        }`}
                                                >
                                                    <HiDotsVertical
                                                        size={18}
                                                        className="text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200"
                                                    />
                                                </div>
                                            </Tooltip>
                                        </div>
                                        <div
                                            className={`rounded-lg px-4 py-3 break-words ${msg?.to !== activeChatId ? "bg-gray-50  w-fit " : "bg-primary w-fit "
                                                } shadow-md`}
                                        >
                                            <p className={`text-sm font-medium ${msg?.to !== activeChatId ? " text-textMain " : "text-white"}`}>
                                                {msg?.message}
                                            </p>

                                        </div>
                                        <div className={`flex  items-center mt-1 ${msg?.to !== activeChatId ? " justify-start" : "justify-end"}`}>
                                            <p className={`text-xs font-medium text-textMain/80 "
                                                    }`}>
                                                {dayjs(msg?.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                }

            </div>

            <form
                onSubmit={handleSendMessage}
                className="flex items-center sm:gap-3 gap-2 border-t border-gray-300 sm:p-4 p-2 bg-white shadow-sm rounded-lg"
            >
                <input
                    required
                    type="text"
                    placeholder="Write a message..."
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setImageModal(!imageModal)}
                    className="flex items-center justify-center sm:w-10 sm:h-10 sm:bg-gray-100 hover:bg-gray-200 text-primary rounded-lg focus:outline-none"
                >
                    <FaRegImages className="md:text-xl text-base" />
                </button>
                <button
                    type="button"
                    onClick={() => { setImageModal(!pdfUpload); setPdfUpload(!pdfUpload) }}
                    className="flex items-center justify-center sm:w-10 sm:h-10 sm:bg-gray-100 hover:bg-gray-200 text-primary rounded-lg focus:outline-none"
                >
                    <FiPaperclip className="md:text-xl text-base" />
                </button>
                <button
                    type="submit"
                    className="flex items-center justify-center sm:w-10 sm:h-10 sm:bg-primary sm:text-white text-primary rounded-lg hover:bg-primary-dark focus:outline-none"
                >
                    <FiSend className="md:text-xl text-lg" />
                </button>
            </form>
            <Modal
                visible={imageModal}
                onCancel={() => { setImageModal(false); setPdfUpload(false) }}
                maskClosable={false}
                footer={null}
            >
                <Form
                    form={imageForm}
                    onFinish={async (values) => {
                        if (!pdfUpload && values?.image[0]?.originFileObj) {
                            const { error, data } = await postSingleImage({
                                image: values?.image[0]?.originFileObj,
                                image_name: "message",
                            });
                            if (!error) {
                                const { error, msg } = await postMessage({
                                    to: activeChatId,
                                    message: "",
                                    image: data
                                })
                                if (!error) {
                                    setMessage("")
                                    getmessageList({
                                        to: activeChatId
                                    })
                                    getUsers()
                                    setImageModal(false)
                                    imageForm.resetFields()
                                }
                            }
                        } else if (values?.pdf?.file?.originFileObj) {
                            const { error, data } = await pdfFileUpload({
                                files: values?.pdf?.file?.originFileObj,
                                pdf_name: "message",
                            });
                            if (!error) {
                                const { error, msg } = await postMessage({
                                    to: activeChatId,
                                    message: "",
                                    file: data
                                })
                                if (!error) {
                                    setMessage("")
                                    getmessageList({
                                        to: activeChatId
                                    })
                                    getUsers()
                                    setPdfUpload(false)
                                    setImageModal(false)
                                    imageForm.resetFields()
                                }
                            }
                        }
                    }}
                >
                    <div className="space-y-4">
                        <div className="text-lg font-semibold text-gray-700">
                            {pdfUpload
                                ? "Upload PDF (Max length: 6 MB)"
                                : "Upload Image (Max length: 6 MB)"}
                        </div>
                        {pdfUpload ? (
                            <UploadFileComponent
                                label="Choose PDF file"
                                name="pdf"
                                required
                                className="w-full"
                            />
                        ) : (
                            <MultipleImageInput
                                label="Choose Image"
                                name="image"
                                required
                                className="w-full"
                            />
                        )}
                        <button className="bg-primary text-white py-2 px-4 rounded-md mt-2">Send</button>
                    </div>
                </Form>

            </Modal>
        </div>
    )

    return (
        <div className="flex h-[85vh] w-full bg-white">
            {renderChatList()}
            {activeChat ? renderChatArea() : (
                <div className="flex-1 md:flex hidden items-center justify-center flex-col text-center p-4">
                    <Image width={200} height={200} src="/message.png" alt="Empty Inbox" className='w-52 h-52 object-fill' />
                    <p className="text-lg font-medium font-poppins text-textMain mt-10">Click an inbox card to view the message.</p>
                </div>
            )}
        </div>
    )
}
