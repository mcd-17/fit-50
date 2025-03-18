"use client";
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { useI18n } from '../../../../providers/i18n';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import Button from '../../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { delTag, fetchTagsList, postTag } from '../../../../helpers/backend';
import { columnFormatter, noSelected } from '../../../../helpers/utils';
import dayjs from 'dayjs';

const BlogTags = () => {
    const i18n = useI18n();
    const [form] = Form.useForm();
    const [data, getData, { loading }] = useFetch(fetchTagsList);
    let { languages, langCode } = useI18n();
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();
    const [open, setOpen] = useState(false);
    const [formData, setFromData] = useState([])

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
            text: 'Name',
            dataField: "name",
            formatter: (value) => columnFormatter(value),
        },
    ];

    const handleSubmit = (values) => {
        let formattedData = {};
        for (let i = 0; i < formData.length; i++) {
            const ele = formData[i];
            formattedData[ele?.lang] = ele?.value
        }
        return useAction(
            values?._id ? postTag : postTag,
            {
                name: formattedData,
                _id: values?._id,
            },
            () => {
                setOpen(false);
                getData();
            }
        );
    };

    return (
        <div>
            <PageTitle title={("Blog Tags")} />
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
                        {i18n?.t("Add New")}
                    </Button>
                }
                onEdit={(values) => {
                    form.setFieldsValue({
                        ...values,
                        values: values?.name[langCode],
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delTag}
                indexed
                pagination
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n.t(isEdit ? "Edit Blog Tag" : "Add Blog Tags")}
                footer={null}
            >
                <div className="flex justify-start flex-wrap gap-3">
                    {languages?.docs?.map((l, index) => (
                        <button
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            key={index}
                        >
                            {l.name}
                        </button>
                    ))}
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    {
                        isEdit && <HiddenInput name="_id" />
                    }
                    <div className="mt-4">
                        {languages?.docs?.map((l, index) => (
                            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                <FormInput
                                    name={['name', l.code]}
                                    label={i18n?.t("Name")}
                                    key={index}
                                    required={true}
                                    onBlur={(e) => {
                                        if (formData?.length === 0) {
                                            setFromData([{ lang: selectedLang, value: e.target.value }])
                                        } else {
                                            const uniqueData = formData?.filter((data) => data?.lang !== selectedLang)
                                            const moreData = [...uniqueData, { lang: selectedLang, value: e.target.value }]
                                            setFromData(moreData)
                                        }
                                    }}
                                    placeholder={"Enter Tag Name"}
                                    className="mt-2.5"
                                />
                            </div>
                        ))}
                    </div>
                    <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("Submit")}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogTags;