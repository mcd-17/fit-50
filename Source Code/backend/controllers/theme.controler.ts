import { Theme } from "../models/theme.model";

export const getAllThemes = async (req, res) => {
    try {
        const themes = await Theme.find();
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets themes',
            data: themes
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

export const updateThemeStatus = async (req, res) => {
    try {
        const { _id } = req.body;

        const currentDefaultTheme = await Theme.findOne({ _id, isDefault: true });
        if (currentDefaultTheme) {
            return res.status(200).send({
                error: false,
                msg: 'This theme is already active',
                data: currentDefaultTheme,
            });
        }

        await Theme.updateMany({}, { isDefault: false });
        const theme = await Theme.findOneAndUpdate(
            { _id },
            { isDefault: true },
            { new: true }
        );

        return res.status(200).send({
            error: false,
            msg: 'Successfully updated theme',
            data: theme,
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error",
        });
    }
};

