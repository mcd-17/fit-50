import Settings from "../models/settings.model"
import Language from "../models/language.model"

import Groq from "groq-sdk";

// get all languages
export const getLanguages = async (req, res) => {
    try {
        let data = await Language.find({ active: true }, 'name code flag active default rtl')
        return res.status(200).send({
            error: false,
            msg: "Languages",
            data,
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}
export const getLanguageList = async (req, res) => {
    try {
        const { query } = req;

        let filter: any = {};
        if (query.active !== undefined) {
            filter.active = query.active === 'true';
        }
        if(!!query.search){
            filter['name'] = { $regex: new RegExp(query.search.toLowerCase(), "i") }
        }
        let data = await Language.paginate(
            filter,
            {
                page: query.page || 1,
                limit: query.limit || 10,
                sort: { createdAt: -1 },
                select: "-translations"
            }
        );

        return res.status(200).send({
            error: false,
            msg: "Language list",
            data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

// get language
export const getLanguage = async (req, res) => {
    try {
        let { query } = req;
        let filter: any = {
            _id: query._id,
        }
        let data = await Language.findOne(filter, 'name code flag active rtl')
        if (!data) {
            return res.status(404).send({
                error: true,
                msg: "Language not found"
            })
        }
        return res.status(200).send({
            error: false,
            msg: "Language",
            data,
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// create or update language
export const postLanguage = async (req, res) => {
    try {
        let { body } = req;
        if (!!body._id) {
            let find = await Language.findOne({ _id: body._id })
            if (!find) {
                return res.status(404).send({
                    error: true,
                    msg: "Language not found"
                })
            }
            !!body.name && (find.name = body.name)
            !!body.code && (find.code = body.code)
            !!body.flag && (find.flag = body.flag)
            !!body.translations && (find.translations = body.translations)
            typeof body.rtl === "boolean" && (find.rtl = body.rtl)
            typeof body.active === "boolean" && (find.active = body.active)

            if (typeof body.default !== 'undefined') {
                if (!!body.default && !find.default) {
                    await Language.updateMany({}, { default: false })
                } else {
                    if (find.default && !body.default) {
                        return res.status(400).send({
                            error: true,
                            msg: 'At least one language must be default'
                        })
                    }
                }
            }

            if (body.active !== undefined) {
                let language = await Language.findById(body._id, 'default active')
                if (language?.default === false) {
                    language.active = body.active
                    await language.save()
                    return res.status(200).send({
                        error: false,
                        msg: 'Successfully updated language status'
                    })
                }
                return res.status(401).send({
                    error: true,
                    msg: 'Default language status is not changeable'
                })
            }

            typeof body.default === "boolean" && (find.default = body.default)
            await find.save()
            return res.status(200).send({
                error: false,
                msg: "Language updated",
            })
        }
        let data = await Language.create(body)
        return res.status(200).send({
            error: false,
            msg: "Language created",
            data,
        })
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).send({
                error: true,
                msg: "Language already exist"
            })
        }
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// get language translations
export const getLanguageTranslations = async (req, res) => {
    try {
        let { query } = req;
        let filter: any = {
            _id: query._id,
        }
        if (!query._id) {
            const allTranslationsData = await Language.find({}, 'name code flag default translations')
            return res.status(200).send({
                error: false,
                msg: "Language translations",
                data: allTranslationsData,
            })
        }
        let data = await Language.findOne(filter, 'name code flag default translations')
        if (!data) {
            return res.status(404).send({
                error: true,
                msg: "Language not found"
            })
        }
        return res.status(200).send({
            error: false,
            msg: "Language translations",
            data,
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// delete language
export const deleteLanguage = async (req, res) => {
    try {
        let { query } = req;
        let data = await Language.findOneAndDelete({ _id: query._id })
        if (!data) {
            return res.status(404).send({
                error: true,
                msg: "Language not found"
            })
        }
        return res.status(200).send({
            error: false,
            msg: "Language deleted",
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}


export const translateLanguage = async (req, res) => {
    try {
        const { body } = req;
        const langCode = body.langCode;

        const settings = await Settings.findOne({}, 'ai_key');
        const groq = new Groq({ apiKey: settings.ai_key });

        const translatedBody = {};
        for (const [key, value] of Object.entries(body)) {
            if (key !== 'langCode') {
                const prompt = `Translate only the given text to ${langCode} without any explanation: "${value}"`;
                const response = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    model: "llama3-8b-8192",
                });

                let translatedText = response.choices[0].message.content;

                translatedText = translatedText.replace(/\(.*?\)/g, '').trim();

                translatedBody[key] = translatedText;
            }
        }

        return res.status(200).send({
            error: false,
            msg: "Successfully translated content",
            data: translatedBody,
        });

    } catch (error) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
};

export const getPublicLanguageList = async (req, res) => {
    try {
        const { query } = req;
        let data = await Language.paginate(
            { active: true },
            {
                page: query.page || 1,
                limit: query.limit || 10,
                sort: { createdAt: -1 },
                select: "-translations"
            }
        );
        return res.status(200).send({
            error: false,
            msg: "Language list",
            data,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        });
    }
}