import Category from "../../models/blog/category.model";


// get all categories
export const getCategories = async (req, res) => {
    try {
        const { query } = req
        const filter = {}
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Category.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets categories',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// get category details
export const getCategory = async (req, res) => {
    try {
        let { query } = req
        let data = await Category.findById(query._id)
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Category not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets category',
            data: data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


// create or update category
export const postCategory = async (req, res) => {
    try {
        const { body } = req;

        if (body._id) {
            await Category.findOneAndUpdate({ _id: body._id }, { name: body.name });
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated Category'
            });
        } else {

            const languageKeys = Object.keys(body.name);
            const query = languageKeys.map((lang) => {
                return { [`name.${lang}`]: body.name[lang] };
            });
            const exist = await Category.findOne({
                $or: query
            });
            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: `Category already exists`
                });
            }

            const newCategory = new Category({ name: body.name });

            await newCategory.save();
            return res.status(200).send({
                error: false,
                msg: 'Category has been created successfully',
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}


// delete category
export const deleteCategory = async (req, res) => {
    try {
        let { query } = req;
        const category = await Category.findByIdAndDelete(query._id)

        if (!category) {
            return res.status(400).send({
                error: true,
                msg: 'Category not found'
            })
        }
        return res.status(200).send({
            error: false,
            msg: 'Category has been deleted successfully',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
