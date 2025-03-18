import Tags from "../../models/blog/tag.model";


// get tags list
export const getTags = async (req, res) => {
    try {
        const { query } = req;
        const filter = {};
        const langCode = query.langCode || 'en';

        if (!!query.search) {
            filter[`name.${langCode}`] = { $regex: new RegExp(query.search.toLowerCase(), "i") };
        }

        let data = await Tags.paginate(filter, {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
            select: '-__v',
        });
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets tags',
            data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
};

// get tag details
export const getTag = async (req, res) => {
    try {
        let { query } = req;
        let data = await Tags.findById(query._id);
        if (!data) {
            return res.status(400).send({
                error: true,
                msg: 'Tag not found',
            });
        }
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets tag',
            data: data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
}

// create or update tag
export const postTag = async (req, res) => {
    try {
        let { body } = req;
        if (!!body._id) {
            await Tags.findByIdAndUpdate(body._id, body);
            return res.status(200).send({
                error: false,
                msg: 'Tag has been updated successfully',
            });
        } else {
            const languageKeys = Object.keys(body.name);
            const query = languageKeys.map((lang) => {
                return { [`name.${lang}`]: body.name[lang] };
            });
            const exist = await Tags.findOne({
                $or: query,
            });
            if (exist) {
                return res.status(400).send({
                    error: true,
                    msg: 'Tag already exists',
                });
            }

            await Tags.create(body);
            return res.status(200).send({
                error: false,
                msg: 'Tag has been created successfully',
            });
        }
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
}

// delete tag
export const delTag = async (req, res) => {
    try {
        let { query } = req;
        const tag = await Tags.findByIdAndDelete(query._id);

        if (!tag) {
            return res.status(400).send({
                error: true,
                msg: 'Tag not found',
            });
        }

        return res.status(200).send({
            error: false,
            msg: 'Tag has been deleted successfully',
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error',
        });
    }
}
