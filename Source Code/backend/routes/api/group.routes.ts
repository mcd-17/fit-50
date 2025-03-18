import { Router } from "express";
import { isAdminOrEmployee, isAdminOrTrainerOrEmployee, isTrainer, isUser } from "../../middlewares/auth.middleware";
import { deleteGroup, getGroupDetails, getGroupListAdmin, getGroupListUser, getGroupMemberDetails, getGroupMembers, getTrainerList, getUserGroups, joinOrLeaveGroup, postGroup, trainerGroupList } from "../../controllers/group.controller";


const groupRoutes = Router()

groupRoutes.get('/list/admin', isAdminOrEmployee, getGroupListAdmin)
groupRoutes.post('/add', isAdminOrEmployee, postGroup)
groupRoutes.get('/trainers', isAdminOrEmployee, getTrainerList)
groupRoutes.delete('/delete', isAdminOrEmployee, deleteGroup)

groupRoutes.get('/list', getGroupListUser)
groupRoutes.get('/details', getGroupDetails)

groupRoutes.post('/join', isUser, joinOrLeaveGroup)

groupRoutes.get('/user', isUser, getUserGroups)

groupRoutes.get('/trainer/list', isTrainer, trainerGroupList)
groupRoutes.get('/trainer/members', isAdminOrTrainerOrEmployee, getGroupMembers)
groupRoutes.get('/trainer/member', isAdminOrTrainerOrEmployee, getGroupMemberDetails)

export default groupRoutes