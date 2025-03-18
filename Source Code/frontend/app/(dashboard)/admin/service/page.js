"use client";
import React, { useEffect, useState } from 'react';
import { Form, Modal, Tooltip } from 'antd';
import PageTitle from '../../components/common/page-title';
import Table, { TableImage } from '../../components/form/table';
import { useAction, useFetch } from '../../../helpers/hooks';
import { delService, fetchServices, postService, postSingleImage } from '../../../helpers/backend';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import MultipleImageInput from '../../../../components/form/multiImage';
import { noSelected } from '../../../helpers/utils';
import { useI18n } from '../../../providers/i18n';
import dayjs from 'dayjs';

const AdminService = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    let { languages, langCode } = useI18n();
    const [open, setOpen] = useState(false);
    const [data, getData, { loading }] = useFetch(fetchServices);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState(langCode);

    useEffect(() => {
        setSelectedLang(langCode)
    }, [langCode])

    const columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        {
            text: "Icon", dataField: "icon",
            formatter: (_, d) => (
                <div className="flex space-x-1">
                    <TableImage url={d?.icon} />
                </div>
            ),
        },
        {
            text: "Image", dataField: "image",
            formatter: (_, d) => (
                <div className="flex space-x-1">
                    <TableImage url={d?.image} />
                </div>
            ),
        },
        { text: "Name", dataField: "name", formatter: (name) => <span className=''>{name[langCode]}</span> },
        {
            text: "Description", dataField: "description",
            formatter: (description) => <span className=''>{
                <Tooltip title={description[langCode]?.length > 30 ? description[langCode] : ''}
                >
                    <span className='cursor-help'>
                        {description[langCode]?.length > 30 ? description[langCode]?.slice(0, 30) + '...' : description[langCode]}
                    </span>
                </Tooltip>
            }</span>,
        },

    ];
    return (
        <div>
            <PageTitle title="Services List" />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                            setIsEdit(false);
                        }}
                    >
                        {i18n.t("Add New")}
                    </Button>
                }
                onEdit={(values) => {
                    form.setFieldsValue({
                        name: values.name,
                        description: values.description,
                        icon: values.icon ? [{ uid: '-1', name: 'icon.png', status: 'done', url: values.icon }] : [{ url: values?.icon }],
                        image: values.image ? [{ uid: '-1', name: 'image.png', status: 'done', url: values.image }] : [{ url: values?.image }],
                        _id: values._id,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delService}
                indexed
                pagination
                langCode={langCode}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n.t(isEdit ? "Edit Service" : "Add Service")}
                footer={null}
            >
                <div className="flex justify-start flex-wrap gap-3">
                    {languages?.docs?.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l?.code === selectedLang
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            key={index}
                        >
                            {l?.name}
                        </button>
                    ))}
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={async (values) => {
                        if (values?.icon[0]?.originFileObj) {
                            const image = values?.icon[0]?.originFileObj;
                            const { data } = await postSingleImage({ image: image, image_name: "service" });
                            values.icon = data;
                        } else {
                            values.icon = values?.icon[0]?.url ? values?.icon[0]?.url : values?.icon;
                        }

                        if (values?.image[0]?.originFileObj) {
                            const image = values?.image[0]?.originFileObj;
                            const { data } = await postSingleImage({ image: image, image_name: "service" });
                            values.image = data;
                        } else {
                            values.image = values?.image[0]?.url ? values?.image[0]?.url: values?.image;
                        }
                        const multiLangFields = ['name', 'description'];
                        const formattedData = multiLangFields.reduce((acc, field) => {
                            acc[field] = {};
                            languages?.docs?.forEach(lang => {
                                if (values[field] && values[field][lang.code]) {
                                    acc[field][lang.code] = values[field][lang.code];
                                }
                            });
                            return acc;
                        }, {});

                        const poaload = {
                            _id: values?._id,
                            ...values,
                            ...formattedData
                        };
                        return useAction(
                            postService,
                            poaload,
                            () => {
                                setOpen(false);
                                getData();
                            }
                        );
                    }}
                >
                    {
                        isEdit && <HiddenInput name="_id" />
                    }

                    <div className="mt-4">
                        {languages?.docs?.map((l, index) => (
                            <div key={index} style={{ display: l?.code === selectedLang ? 'block' : 'none' }}>
                                <FormInput placeholder={("Enter Name")} label={("Name")} name={['name', l?.code]} required />
                                <FormInput placeholder={("Enter Description")} label={("Description")} name={['description', l?.code]} required textArea />
                            </div>
                        ))}
                    </div>
                    <MultipleImageInput label={("Icon")} name={"icon"} required />
                    <MultipleImageInput label={("Image")} name={"image"} required />
                    <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n.t("Submit")}</Button>
                </Form>
            </Modal>
        </div>
    );
};


export default AdminService;