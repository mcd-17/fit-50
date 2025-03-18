'use client';

import dayjs from "dayjs";
import { useState } from "react";
import { Form, Modal } from "antd";
import Button from "../../../../components/common/button";
import { fetchAdminGallery, deleteGallery, postSingleImage, postGallery } from "../../../helpers/backend";
import { useAction, useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import Table, { TableImage } from "../../components/form/table";
import MultipleImageInput from "../../components/form/multiImage";
import PageTitle from "../../components/common/page-title";

const Page = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchAdminGallery);
    const [open, setOpen] = useState(false);

    const columns = [
        {
            text: 'Uploaded At',
            dataField: 'createdAt',
            formatter: (_, d) => (<>{dayjs(d?.createdAt).format('DD MMM YYYY')}</>),
        },
        {
            text: 'Image',
            dataField: 'image',
            formatter: (_, d) => <TableImage url={d?.image} />,
        },
    ]

    const onFinish = async (values) => {
        if (values?.image[0]?.originFileObj) {
            const image = values?.image[0]?.originFileObj;
            const { data } = await postSingleImage({ image: image, image_name: 'gallery' });
            values.image = data;
        } else {
            values.image = values?.image[0]?.url;
        }
        const submitData = {
            ...values,
        };
        return useAction(postGallery, submitData, () => {
            setOpen(false);
            getData();
        });
    };
    return (
        <div>
            <PageTitle title={'Gallery List'} />
            <Table
                indexed
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                        }}>{i18n.t("Add Gallery")}</Button>}
                data={data}
                columns={columns}
                onReload={getData}
                loading={loading}
                onDelete={deleteGallery}
                pagination
                title={<h3 className="text-xl font-medium">{i18n?.t("Gallery")}</h3>}
            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title={i18n?.t("Add Gallery")}
            >
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    className="space-y-4"
                >
                    <MultipleImageInput
                        name="image"
                        label={i18n?.t("Image")}
                    />
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        {i18n?.t("Submit")}
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}
export default Page