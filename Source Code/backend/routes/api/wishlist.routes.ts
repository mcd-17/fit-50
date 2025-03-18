import { Router } from "express";
import { isAnyUser } from "../../middlewares/auth.middleware";
import { addOrRemoveProductFromWishlist, getWishlist } from "../../controllers/wishlist.controller";


const wishlistRoutes = Router();

wishlistRoutes.get('/list', isAnyUser, getWishlist)
wishlistRoutes.post('/add', isAnyUser, addOrRemoveProductFromWishlist)

export default wishlistRoutes;