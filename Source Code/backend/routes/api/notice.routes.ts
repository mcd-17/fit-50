import { deleteNotice, getMembersNotice, getNotices, postNotice } from "../../controllers/notice.controller";
import { Router } from "express";
import { isTrainer, isUser } from "../../middlewares/auth.middleware";

const noticeRoutes = Router();

noticeRoutes.post('/', isTrainer, postNotice)
noticeRoutes.get('/list', isTrainer, getNotices)
noticeRoutes.get('/list/user', isUser, getMembersNotice)
noticeRoutes.delete('/delete', isTrainer, deleteNotice)
export default noticeRoutes;

