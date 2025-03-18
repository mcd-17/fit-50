'use client';
import React, { useEffect } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { message } from 'antd';
import PageTitle from '../../components/common/page-title';
import { fetchAdminSettings, postAdminSettings } from '../../../helpers/backend';
import FormInput, { HiddenInput } from '../../components/form/input';
import PhoneNumberInput from '../../components/form/phoneNumberInput';
import MultipleImageInput from '../../components/form/multiImage';
import { useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';

const AdminSettings = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [data, getData] = useFetch(fetchAdminSettings)

    useEffect(() => {
        if (data) {
            const updatedData = {
                ...data,
                logo: data?.logo?.length > 0 ? [
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data?.logo,
                    },
                ] : []
            };
            form.setFieldsValue(updatedData);
        }
    }, [data, form]);

    const handleFinish = async (values) => {
        const data = {
            ...values,
            _id: values?._id || undefined,
            logo: values?.logo[0]?.originFileObj,
        }
        const { err, msg } = await postAdminSettings(data)
        if (err) {
            message.error(msg)
        } else {
            message.success(msg)
            getData()
        }
    }

    return (
        <div>
            <PageTitle title="Admin Settings" />
            <Card>
                <Row>
                    <Col span={24}>
                        <Form form={form} layout="vertical" onFinish={handleFinish}>
                            <div className=" user-phone grid lg:grid-cols-2 grid-cols-1 gap-x-10 gap-y-5">
                                <HiddenInput name="_id" />
                                <FormInput placeholder={i18n?.t("Enter Title")} name="title" label={"Title"} required />
                                <FormInput placeholder={i18n?.t("Enter Description")} name="description" label={"Description"} required />
                                <FormInput placeholder={i18n?.t("Enter Email")} name="email" label={"Email"} required isEmail />
                                <PhoneNumberInput placeholder={i18n?.t("Enter Phone Number")} name="phone" label={"Phone Number"} required />
                                <FormInput placeholder={i18n?.t("Enter Address")} name="address" label={"Address"} required />
                                <FormInput placeholder={i18n?.t("Enter Copyright")} name="footer_text" label={"Copyright"} required />
                                <FormInput placeholder={i18n?.t("Enter Facebook Link")} name="facebook" label={"Facebook Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Twitter Link")} name="twitter" label={"Twitter Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Instagram Link")} name="instagram" label={"Instagram Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Linkedin Link")} name="linkedin" label={"Linkedin Link"} required />
                                <FormInput placeholder={i18n?.t("Enter Youtube Link")} name="youtube" label={"Youtube Link"} required />
                                <div className='grid grid-cols-2'>
                                    <MultipleImageInput name="logo" label={"Logo"} required />
                                </div>
                            </div>
                            <Button type='submit' className="mt-4"> {i18n?.t("Submit")} </Button>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AdminSettings;