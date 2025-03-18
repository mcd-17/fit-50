import { deleteNotice, getMembersNotice, getNotices, postNotice } from "../../controllers/notice.controller";
import { Router } from "express";
import { isAnyUser } from "../../middlewares/auth.middleware";
import { createMessage, deleteMessage, getChatList, getMessages, userListMessageSend } from "../../controllers/message/message.controller";

const messageRoutes = Router();

messageRoutes.post('/', isAnyUser, createMessage)
messageRoutes.get('/list', isAnyUser, getMessages)
messageRoutes.get('/list/users', isAnyUser, getChatList)
messageRoutes.delete('/delete', isAnyUser, deleteMessage)

export default messageRoutes;

