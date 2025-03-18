import { s3DeleteFiles, s3UploadFile, s3UploadFiles } from "../utils/s3bucket";

// single image upload
export const singleImageUpload = async (req, res) => {
    try {
        let { body, files } = req;
        if (!files?.image) {
            return res.status(400).send({
                error: true,
                msg: 'Image is required'
            })
        }
        // video files
        const mimetypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/avi', 'video/mpeg']
        if (mimetypes.includes(files?.image?.mimetype) === false) {
            return res.status(404).send({
                error: true,
                msg: 'Only the image file is acceptable',
            })
        }

        let image_name = body.image_name || 'image';
        let image = await s3UploadFile(files.image, image_name)
        return res.status(200).send({
            error: false,
            data: image,
            msg: 'Image uploaded successfully'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error"
        })
    }
}

// multiple image upload
export const multipleImageUpload = async (req, res) => {
    try {
        let { body, files } = req;
        if (!files?.images) {
            return res.status(400).send({
                error: true,
                msg: 'Images are required'
            })
        }
        if (!Array.isArray(files?.images)) {
            files.images = [files.images]
        }
        if (files?.images?.length === 0) {
            return res.status(400).send({
                error: true,
                msg: 'At least one image is required'
            })
        }
        let invalid = files?.images?.find((file: any) => !(['image/jpeg', 'image/png', 'image/jpg'].includes(file?.mimetype)))
        if (!!invalid) {
            return res.status(400).send({
                error: true,
                msg: 'Only jpeg and png files are allowed for images'
            })
        }

        let image_name = body.image_name || 'image';
        let images = await s3UploadFiles(files?.images || [], image_name)
        return res.status(200).send({
            error: false,
            data: images,
            msg: 'Images uploaded successfully'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Internal Server Error'
        })
    }
}


// remove file from aws
export const fileRemoveFromAws = async (req, res) => {
    try {
        let { body } = req;
        if (!body?.file) {
            return res.status(400).send({
                error: true,
                msg: 'File is required'
            })
        }
        if (!!body?.file) {
            await s3DeleteFiles([body?.file])
            return res.status(200).send({
                error: false,
                msg: 'File removed successfully'
            })
        }
    }
    catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const pdfUpload = async (req, res) => {
    try {
        let { body, files } = req;
        if (!files?.files || !files?.files.mimetype) {
            return res.status(400).send({
                error: true,
                msg: 'PDF is required',
            });
        }

        if (files?.files.mimetype !== "application/pdf") {
            return res.status(400).send({
                error: true,
                msg: 'Only PDF files are acceptable',
            });
        }

        // Ensure file name is set correctly
        const fileName = files?.files.originalname || files?.files.name || 'default.pdf';

        // Upload file to S3
        let pdf = await s3UploadFile(files?.files, `pdf/${fileName}`);

        return res.status(200).send({
            error: false,
            data: pdf,
            msg: 'PDF uploaded successfully',
        });
    } catch (e) {
        console.error("Error during PDF upload:", e);
        return res.status(500).send({
            error: true,
            msg: "Internal Server Error",
        });
    }
};
