"use client";
import React, { useEffect, useState } from 'react';
import { Form, message, Modal, Tooltip } from 'antd';

import { useFetch } from '../../../helpers/hooks';
import { delFaq, fetchFaq, postFaq } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import Table from '../../components/form/table';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';

const AdminFaq = () => {
    const i18n = useI18n()
    const [form] = Form.useForm();
    let { languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchFaq);

    const [open, setOpen] = useState(false);
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
        { text: "Question", dataField: "question", formatter: (question) => <span className=''>{columnFormatter(question)}</span> },
        {
            text: "Answer", dataField: "answer",
            formatter: (answer) => <span className=''>{
                <Tooltip title={columnFormatter(answer)?.length > 40 ? columnFormatter(answer)?.slice(0, 40) + '...' : columnFormatter(answer)} placement="topLeft">
                    <span className='cursor-help'>
                        {columnFormatter(answer)?.length > 40 ? columnFormatter(answer)?.slice(0, 40) + '...' : columnFormatter(answer)}
                    </span>
                </Tooltip>
            }</span>,
        },

    ];

    const handleSubmit = (values) => {
        postFaq(values).then((res) => {
            if (res?.error === false) {
                message.success(res?.msg);
                setOpen(false);
                getData();
            }
        });
    };

    return (
        <div>
            <PageTitle title='Frequently Ask Question' />
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
                        }}>
                        {i18n?.t("Add New")}
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
                onDelete={delFaq}
                indexed
                pagination
                langCode={langCode}

            />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                title={i18n?.t("Frequently Ask Question Details")}
                footer={null}>
                <div className="flex justify-start flex-wrap gap-3 mb-4 mt-4">
                    {languages?.docs?.map((l, index) => (
                        <div
                            onClick={() => setSelectedLang(l.code)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                ? 'bg-primary text-white cursor-pointer'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                                }`}
                            key={index}
                        >
                            {l.name}
                        </div>
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

                    {languages?.docs?.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                name={['question', l.code]}
                                label={`${'Question'} (${l.name})`}
                                required={true}
                                placeholder={"Question"}
                            />
                            <FormInput
                                name={['answer', l.code]}
                                textArea
                                label={`${'Answer'} (${l.name})`}
                                required={true}
                                placeholder={"Answer"}
                            />
                        </div>
                    ))}

                    <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("Submit")}</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminFaq;