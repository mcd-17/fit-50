"use client"
import { Form, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { allProductCategory, delProductCategory, postProductCategory } from '../../../../helpers/backend';
import { useAction, useFetch } from '../../../../helpers/hooks';
import Button from '../../../../../components/common/button';
import Table from '../../../components/form/table';
import PageTitle from '../../../components/common/page-title';
import { columnFormatter, noSelected } from '../../../../helpers/utils';
import FormInput, { HiddenInput } from '../../../../../components/form/input';
import { useI18n } from '../../../../providers/i18n';
import dayjs from 'dayjs';
const page = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    let { languages, langCode } = useI18n();

    const [open, setOpen] = useState(false);
    const [data, getData, { loading }] = useFetch(allProductCategory);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState();
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
            text: ("Name"),
            dataField: "name",
            formatter: (value) => columnFormatter(value),
        },
    ];
    return (
        <div>
            <PageTitle title="Product Categories" />
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
                    form.resetFields();
                    form.setFieldsValue({
                        ...values,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delProductCategory}
                indexed
                pagination
                langCode={langCode}
            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={(isEdit ? "Edit Category" : "Add Category")}
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
                    onFinish={(values) => {
                        const multiLangFields = ['name'];
                        const formattedData = multiLangFields.reduce((acc, field) => {
                            acc[field] = {};
                            languages?.docs?.forEach(lang => {
                                if (values[field] && values[field][lang.code]) {
                                    acc[field][lang.code] = values[field][lang.code];
                                }
                            });
                            return acc;
                        }, {});
                        return useAction(
                            values?._id ? postProductCategory : postProductCategory,
                            {
                                ...formattedData,
                                _id: values?._id
                            },
                            () => {
                                setOpen(false);
                                getData();
                            }
                        );
                    }}
                    className='mt-2'
                >
                    {isEdit && <HiddenInput name="_id" />}

                    {
                        languages?.docs?.map((l, index) => (
                            <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                                <FormInput
                                    name={['name', l.code]}
                                    label={`${i18n?.t('Name')}`}
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
                                    placeholder={`${i18n?.t('Enter Name')}`}
                                />
                            </div>
                        ))
                    }
                    <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("Submit")}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default page;
