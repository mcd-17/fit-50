import { Router } from "express";
import { isAdminOrEmployee, isAdminOrTrainerOrEmployee, isAnyUser, isTrainer } from "../../middlewares/auth.middleware";
import { deleteCategory, getCategories, getCategory, postCategory } from "../../controllers/blog/category.controller";
import { delTag, getTag, getTags, postTag } from "../../controllers/blog/tag.controller";
import { deleteBlog, getBlogDetails, getBlogs, getBlogsForUser, getPopularBlogs, getTrainerBlogDetails, getTrainersBlogs, postBlog, toggleBlogAddToPopular, toggleBlogPublish } from "../../controllers/blog/blog.controller";
import { delBlogComment, postBlogComment } from "../../controllers/blog/comment.controller";

const blogRoutes = Router()

blogRoutes.get('/category/list', getCategories)
blogRoutes.get('/category', isAdminOrEmployee, getCategory)
blogRoutes.post('/category', isAdminOrEmployee, postCategory)
blogRoutes.delete('/category', isAdminOrEmployee, deleteCategory)

blogRoutes.get('/tag/list', getTags)
blogRoutes.get('/tag', isAdminOrEmployee, getTag)
blogRoutes.post('/tag', isAdminOrEmployee, postTag)
blogRoutes.delete('/tag', isAdminOrEmployee, delTag)

blogRoutes.get('/list', isAdminOrTrainerOrEmployee, getBlogs)
blogRoutes.post('/', isAdminOrTrainerOrEmployee, postBlog)
blogRoutes.delete('/', isAdminOrTrainerOrEmployee, deleteBlog)

blogRoutes.get('/trainers', isTrainer, getTrainersBlogs)
blogRoutes.get('/trainers/details', isTrainer, getTrainerBlogDetails)

blogRoutes.get('/toggle-publish', isAdminOrTrainerOrEmployee, toggleBlogPublish)
blogRoutes.get('/toggle-popular', isAdminOrTrainerOrEmployee, toggleBlogAddToPopular)

blogRoutes.get('/popular', getPopularBlogs)
blogRoutes.get('/details', getBlogDetails)

blogRoutes.get('/lists', getBlogsForUser)

blogRoutes.post("/comment", isAnyUser, postBlogComment)
blogRoutes.delete("/comment", isAnyUser, delBlogComment)

export default blogRoutes;