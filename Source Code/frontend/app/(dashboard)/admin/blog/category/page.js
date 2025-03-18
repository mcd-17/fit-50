"use client";

import { Form,Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../components/common/page-title';
import Table from '../../../components/form/table';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import Button from '../../../../../components/common/button';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { blogCategoryList, delCategory, postCategory } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { columnFormatter, noSelected } from '../../../../helpers/utils';
import dayjs from 'dayjs';

const BlogCategory = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(blogCategoryList);
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
            text: "Name",
            dataField: "name",
            formatter: (value) => columnFormatter(value),
        },
    ];

    const handleSubmit = (values) => {
        let formattedData = {};
        for (let i = 0; i < values.length; i++) {
            const ele = values[i];
            formattedData[ele?.lang] = ele?.value
        }
        return useAction(
            values?._id ? postCategory : postCategory,
            {
                _id: values?._id,
                name: values?.name,
            },
            () => {
                setOpen(false);
                getData();
            }
        );
    };

    return (
        <div>
            <PageTitle title="Blog Categories" />
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
                        {i18n.t("Add Category")}
                    </Button>
                }
                onEdit={(values) => {
                    form.setFieldsValue({
                        ...values,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delCategory}
                indexed
                pagination
                langCode={langCode}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n.t(isEdit ? "Edit Category" : "Add Category")}
                footer={null}
                destroyOnClose={true}
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
                    className='mt-5'
                >
                    {isEdit && <HiddenInput name="_id" />}
                    {languages?.docs.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                name={['name', l.code]}
                                label={('Name')}
                                placeholder={i18n.t('Enter Name')}
                                key={index}
                                required
                                onBlur={(e) => {
                                    if (formData?.length === 0) {
                                        setFromData([{ lang: selectedLang, value: e.target.value }])
                                    } else {
                                        const uniqueData = formData?.filter((data) => data?.lang !== selectedLang)
                                        const moreData = [...uniqueData, { lang: selectedLang, value: e.target.value }]
                                        setFromData(moreData)
                                    }
                                }}
                            />
                        </div>
                    ))}
                    <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n.t("Submit")}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogCategory;