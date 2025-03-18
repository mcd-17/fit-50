import { Router } from "express";
import { isAdminOrTrainerOrEmployee, isAnyUser } from "../../middlewares/auth.middleware";
import { fileRemoveFromAws, multipleImageUpload, singleImageUpload,pdfUpload } from "../../controllers/files.controller";

const filesRoutes = Router();

filesRoutes.post('/single-image-upload', isAnyUser, singleImageUpload)
filesRoutes.post('/pdf-upload', isAnyUser, pdfUpload)
filesRoutes.post('/file-remove', isAdminOrTrainerOrEmployee, fileRemoveFromAws)
filesRoutes.post('/multiple-image-upload', isAdminOrTrainerOrEmployee, multipleImageUpload)

export default filesRoutes;