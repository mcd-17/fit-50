import {DeleteObjectCommand, PutObjectCommand, S3} from "@aws-sdk/client-s3";
import * as process from "process";
import {generateID} from "./helpers";

export const s3UploadFiles = async (files, folder) => {
    if (files.length === 0) return Promise.resolve([])
    const s3 = new S3();
    const params = files.map((file) => {
        return {
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${process.env.WEBSITE_NAME}-storage/${folder}/${generateID('', 8)}-${file.name}`.replaceAll(' ', '-'),
            Body: file.data
        }
    });

    return await Promise.all(params.map(async (param) => {
        await s3.send(new PutObjectCommand(param))
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${param.Key}`
    }));
}


export const s3DeleteFiles = async (files) => {
    if (files.length === 0) return Promise.resolve()
    const s3 = new S3();
    const params = files.map((file) => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.replace(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`, ''),
        }
    });
    return await Promise.all(params.map(async (param) => await s3.send(new DeleteObjectCommand(param))));
}

export const s3UploadFile = async (file, folder) => {
    const s3 = new S3();
    const randNumber = generateID('', 8)
    const params = {
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${process.env.WEBSITE_NAME}-storage/${folder}/${randNumber}-${file.name}`.replaceAll(' ', '-'),
        Body: file.data
    }
    // @ts-ignore
    await s3.send(new PutObjectCommand(params))
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`
}