import { isAdminOrEmployee, isAnyUser } from "../../middlewares/auth.middleware";
import { deleteCategory, getCategoryList, postCategory } from "../../controllers/product/category.controller";
import { Router } from "express";
import { addProduct, addProductToCart, deleteProduct, deleteProductReview, getCartList, getProductDetails, getProductList, getProductListAdmin, getProductReviews, postProductReview, removeProductFromCart, toggleProductPublish, updateProduct } from "../../controllers/product/product.controller";
import { deleteProductReviewValidator } from "../../middlewares/product.middleware";

const productRoutes = Router();

productRoutes.get('/category/list', getCategoryList)
productRoutes.post('/category', isAdminOrEmployee, postCategory)
productRoutes.delete('/category', isAdminOrEmployee, deleteCategory)

productRoutes.get('/list', isAdminOrEmployee, getProductListAdmin)
productRoutes.post('/add', isAdminOrEmployee, addProduct)
productRoutes.post('/update', isAdminOrEmployee, updateProduct)
productRoutes.get('/details', getProductDetails)
productRoutes.post('/publish', isAdminOrEmployee, toggleProductPublish)
productRoutes.delete('/delete', isAdminOrEmployee, deleteProduct)

productRoutes.get('/', getProductList)

productRoutes.post('/cart', isAnyUser, addProductToCart)
productRoutes.delete('/cart', isAnyUser, removeProductFromCart)
productRoutes.get('/cart/list', isAnyUser, getCartList)

productRoutes.post('/review', isAnyUser, postProductReview)
productRoutes.get('/review', getProductReviews)
productRoutes.delete('/review', isAdminOrEmployee, deleteProductReviewValidator, deleteProductReview)

export default productRoutes;