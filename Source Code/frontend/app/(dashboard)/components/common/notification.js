"use client";
import dayjs from "dayjs";
import React from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAction, useActionConfirm } from "../../../helpers/hooks";
import {
    readAdminNotification,
    readAllMarkAdminNotification,
    deleteAdminNotification
} from "../../../helpers/backend";
import { IoSadOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import Link from "next/link";
import { useI18n } from "../../../providers/i18n";

dayjs.extend(relativeTime);

const NotificationDropdown = ({ isOpen = true, notices, getNotifications, setLimit, limit }) => {
    if (!isOpen) return null;
    const i18n = useI18n();

    const handleShowMore = () => {
        setLimit(limit + 5);
        getNotifications({
            limit: limit + 5
        });
    };

    const handleDeleteNotification = (notificationId) => {
        useActionConfirm(deleteAdminNotification, { _id: notificationId }, () => {
            getNotifications();
        });
    };

    return (
        <div className="w-80">
            <div
                className="px-4 py-2 mt-4 border-b"
                style={{
                    borderColor: "#E67529",
                }}
            >
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium" style={{ color: "#E67529" }}>
                        {i18n?.t("Notifications")}
                    </h4>
                    <button
                        onClick={() => {
                            useAction(readAllMarkAdminNotification, {}, () => {
                                getNotifications();
                            });
                        }}
                        className="text-xs hover:underline"
                        style={{ color: "#E67529" }}
                    >
                        {i18n?.t("Mark all as read")}
                    </button>
                </div>
            </div>
            <div className="max-h-60 overflow-y-auto">
                {notices?.docs?.length > 0 ? (
                    notices?.docs?.map((notification) => (
                        <div
                            key={notification?._id}
                            className={`${!notification?.isRead
                                ? "bg-gray-100 border-b border-b-gray-200"
                                : ""
                                } px-4 py-3 flex items-start relative`}
                        >
                            <div
                                className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: "#FFE6D7", color: "#E67529" }}
                            >
                                <span className="material-icons">info</span>
                            </div>
                            <div className="ml-3 flex-1">
                                {
                                    notification?.data?.type === "order" ? (
                                        <Link href={`/admin/order/view/${notification?.data?.orderId}`} className="text-sm font-medium text-gray-800 line-clamp-1 hover:underline">{notification?.title}</Link>
                                    ) : (
                                        <>
                                            {
                                                notification?.data?.type === "product_add" ? (
                                                    <Link href={`/admin/product/view/${notification?.data?._id}`} className="text-sm font-medium text-gray-800 line-clamp-1 hover:underline">{notification?.title}</Link>
                                                ) : (
                                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{notification?.title}</p>
                                                )
                                            }

                                        </>
                                    )
                                }

                                <p className="text-xs text-gray-600 line-clamp-2">{notification?.message}</p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2 justify-between">
                                    <span>{dayjs(notification?.createdAt)?.fromNow()}</span>
                                    <span onClick={() => {
                                        notification?.isRead ? null : useAction(readAdminNotification, { _id: notification?._id }, () => {
                                            getNotifications();
                                        });
                                    }} className="font-semibold hover:underline cursor-pointer">{notification?.isRead ? i18n?.t("Marked as read") : i18n?.t("Mark as read")}</span>
                                </p>
                            </div>
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification?._id);
                                }}
                            >
                                <AiOutlineDelete size={16} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-3 flex items-center gap-2 justify-center">
                        <IoSadOutline />
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {i18n?.t("No Notification Found")}
                        </p>
                    </div>
                )}

                {
                    notices?.totalDocs > limit && (<>
                        <button onClick={handleShowMore} className="text-xs hover:underline py-1 text-white mx-auto mt-2 px-3 block text-center bg-primary rounded-sm">{i18n?.t("Show more")}</button>
                    </>
                    )
                }
            </div>
        </div>
    );
};


export default NotificationDropdown;
