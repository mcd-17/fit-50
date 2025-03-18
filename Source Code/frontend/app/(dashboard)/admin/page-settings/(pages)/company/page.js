"use client";
import { Card, Form, message } from 'antd';
import React, { useEffect } from 'react';
import { fetchSinglePage, postMultipleImage, postPage } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { useFetch } from '../../../../../helpers/hooks';
import { HiddenInput } from '../../../../../../components/form/input';
import MultipleImageInput from '../../../../../../components/form/multiImage';
import Button from '../../../../../../components/common/button';

const CompanyDetails = ({ slug }) => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [page, getPage] = useFetch(fetchSinglePage, {}, false);
    useEffect(() => {
        getPage({ slug: slug });
    }, [slug]);

    useEffect(() => {
        if (page?._id) {
            const initialFormValues = {
                _id: page._id,
                title: page.title,
                slug: page.slug,
                images: Array.isArray(page?.content?.company_details?.images)
                    ? page?.content?.company_details?.images?.map(image => ({ url: image }))
                    : [{ url: page?.content?.company_details?.images }],

            };
            form.setFieldsValue(initialFormValues);
        }
    }, [page]);

    const handleUploadImages = async (imageFiles, imageName) => {
        const img = imageFiles?.map((image) => image.originFileObj);
        const images = { images: img, image_name: imageName };
        const { data } = await postMultipleImage(images);
        return data;

    };

    const onFinish = async (values) => {
        const imageUploads = await handleUploadImages(values.images || [], 'images');
        const formData = {
            title: values.title || 'Company Details',
            slug: values.slug || page?.slug,
            content: {
                company_details: {
                    images: imageUploads,
                },
            },
            content_type: 'json',
        };

        if (values._id) {
            formData._id = page._id;
        }

        postPage(formData).then((res) => {
            if (res?.error === false) {
                message.success(res?.msg);
                getPage({ slug: slug });
            } else {
                message.error("Failed to submit data");
            }
        });
    };

    return (
        <div>
            <Card>
                <h6 className="text-secondary py-2 header_4">{i18n?.t('Company Details')}</h6>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <HiddenInput name="slug" />
                    <HiddenInput name="_id" />
                    <MultipleImageInput name="images" label={i18n?.t('Company Details Image')} required={true} max={5} />
                    <Button type="submit" className="mt-2.5">
                        {i18n?.t("Submit")}
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default CompanyDetails;
