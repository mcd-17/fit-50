import MarketingSettings from "../../models/marketing/marketing-setting.model"

export const getMarketingSettings = async (req, res) => {
    try {
        let settings = await MarketingSettings.findOne()
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets settings',
            data: settings
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}
export const updateSettings = async (req, res) => {
    try {
        let { body } = req;
        let existingSettings = await MarketingSettings.findOne({});
        if (!existingSettings) {
            existingSettings = new MarketingSettings({});
        }
        if (body.email) {
            existingSettings.email = body.email;
        }
        if (body.email_template) {
            existingSettings.email_template = body.email_template;
        }
        await existingSettings.save();
        return res.status(200).send({
            error: false,
            msg: "Successfully updated settings",
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            error: true,
            msg: "Server failed",
        });
    }
};
