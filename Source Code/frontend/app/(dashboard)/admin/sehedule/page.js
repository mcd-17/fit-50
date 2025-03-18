'use client';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import Table from '../../components/form/table';
import { useAction, useFetch } from '../../../helpers/hooks';
import { delSchedule, fetchAdminSheduleList, fetchTrainers, postSchedule } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import Button from '../../../../components/common/button';
import FormInput, { HiddenInput } from '../../../../components/form/input';
import { columnFormatter, noSelected } from '../../../helpers/utils';
import FormSelect from '../../components/form/select';
import PageTitle from '../../components/common/page-title';

const Sehedule = () => {
    const [form] = Form.useForm();
    const i18n = useI18n();
    let { lang, languages, langCode } = useI18n();
    const [data, getData, { loading }] = useFetch(fetchAdminSheduleList);
    const [trainers] = useFetch(fetchTrainers);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const [formData, setFromData] = useState([]);

    useEffect(() => {
        const defaultLanguage = languages?.docs?.find((lang) => lang.code === 'en') ? 'en' : langCode;
        setSelectedLang(defaultLanguage);
    }, [languages, langCode]);

    const columns = [
        {
            text: "Day",
            dataField: "day",
            formatter: (_, d) => <span>{d?.day}</span>,
        },
        {
            text: "Trainer Name",
            dataField: "trainer, name",
            formatter: (_, d) => <span>{d?.trainer?.name}</span>,
        },
        {
            text: "Time Slots",
            dataField: "time_slots",
            formatter: (_, d) => <span>{d?.time_slots}</span>,
        },
        {
            text: "Event",
            dataField: "event",
            formatter: (_, d) => columnFormatter(d?.event),
        },
    ];

    return (
        <>
            <PageTitle title={'Sehedule List'} />
            <Table
                columns={columns}
                data={data}
                loading={loading}
                onReload={getData}
                action={
                    <Button
                        className='!py-2'
                        onClick={() => {
                            form.resetFields();
                            setOpen(true);
                            setIsEdit(false);
                        }}
                    >
                        {i18n?.t("Add Schedule")}
                    </Button>
                }
                onEdit={(values) => {
                    form.resetFields();
                    form.setFieldsValue({
                        ...values,
                        trainer: values?.trainer?._id,
                    });
                    setOpen(true);
                    setIsEdit(true);
                }}
                onDelete={delSchedule}
                indexed
                pagination={true}
                lang={lang}
                langCode={langCode}
            />
            <Modal
                open={open}
                onCancel={() => {
                    setOpen(false);
                }}
                title={i18n?.t(isEdit ? "Edit Schedule" : "Add Schedule")}
                footer={null}
                destroyOnClose={true}
            >
                <div className="flex justify-start flex-wrap gap-3">
                    {languages?.docs?.map((l, index) => (
                        <button
                            onClick={() => {
                                setSelectedLang(l.code);
                            }}
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
                        const multiLangFields = ['event'];
                        const formattedData = multiLangFields.reduce((acc, field) => {
                            acc[field] = {};
                            languages?.docs?.forEach(lang => {
                                if (values[field] && values[field][lang.code]) {
                                    acc[field][lang.code] = values[field][lang.code];
                                }
                            });
                            return acc;
                        }, {});
                        const finalData = {
                            _id: values?._id || "",
                            day: values?.day || "",
                            time_slots: values?.time_slots || "",
                            event: formattedData.event || {},
                            trainer: values?.trainer || ""
                        };

                        return useAction(
                            postSchedule,
                            {
                                ...finalData,
                            },
                            () => {
                                setOpen(false);
                                getData();
                            }
                        );
                    }}
                    className="mt-2"
                >
                    {isEdit && <HiddenInput name="_id" />}
                    <div className="grid md:grid-cols-2 gap-3 grid-cols-1">
                        <FormSelect
                            placeholder={"Select Day"}
                            name="day"
                            label={i18n?.t('Day')}
                            required
                            options={[
                                { label: i18n?.t('Saturday'), value: "Saturday" },
                                { label: i18n?.t('Sunday'), value: "Sunday" },
                                { label: i18n?.t('Monday'), value: "Monday" },
                                { label: i18n?.t('Tuesday'), value: "Tuesday" },
                                { label: i18n?.t('Wednesday'), value: "Wednesday" },
                                { label: i18n?.t('Thursday'), value: "Thursday" },
                                { label: i18n?.t('Friday'), value: "Friday" },
                            ]}
                        />
                        <FormSelect
                            placeholder={'Time Slots'}
                            name="time_slots"
                            label={i18n?.t('Time Slots')}
                            required
                            options={[
                                { label: "9:00 am", value: "9:00 am" },
                                { label: "10:00 am", value: "10:00 am" },
                                { label: "11:00 am", value: "11:00 am" },
                                { label: "12:00 pm", value: "12:00 pm" },
                                { label: "1:00 pm", value: "1:00 pm" },
                                { label: "2:00 pm", value: "2:00 pm" },
                                { label: "3:00 pm", value: "3:00 pm" },
                                { label: "4:00 pm", value: "4:00 pm" },
                                { label: "5:00 pm", value: "5:00 pm" },
                                { label: "6:00 pm", value: "6:00 pm" },
                                { label: "7:00 pm", value: "7:00 pm" },
                                { label: "8:00 pm", value: "8:00 pm" },
                            ]}
                        />
                    </div>
                    <FormSelect
                        placeholder={'Select Trainer'}
                        name="trainer"
                        label={i18n?.t('Select Trainer')}
                        required
                        options={trainers?.docs?.map((trainer) => ({
                            label: trainer?.name,
                            value: trainer?._id,
                        }))}
                    />
                    {languages?.docs?.map((l, index) => (
                        <div key={index} style={{ display: l.code === selectedLang ? 'block' : 'none' }}>
                            <FormInput
                                name={['event', l.code]}
                                label={i18n?.t('Event')}
                                placeholder={'Event'}
                                key={index}
                                required
                                onBlur={(e) => {
                                    if (formData?.length === 0) {
                                        setFromData([{ lang: selectedLang, value: e.target.value }]);
                                    } else {
                                        const uniqueData = formData?.filter((data) => data?.lang !== selectedLang);
                                        const moreData = [...uniqueData, { lang: selectedLang, value: e.target.value }];
                                        setFromData(moreData);
                                    }
                                }}
                            />
                        </div>
                    ))}

                    <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("Submit")}</Button>
                </Form>

            </Modal>
        </>
    );
};

export default Sehedule;
