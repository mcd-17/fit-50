import { isAdminOrEmployee } from "../../middlewares/auth.middleware";
import { deleteGallery, getGallery, postGallery } from "../../controllers/gallery.controller";
import { Router } from "express";

const GalleryRoutes = Router();
GalleryRoutes.get('/list', getGallery)
GalleryRoutes.post('/post',isAdminOrEmployee, postGallery)
GalleryRoutes.delete('/delete', isAdminOrEmployee, deleteGallery)

export default GalleryRoutes