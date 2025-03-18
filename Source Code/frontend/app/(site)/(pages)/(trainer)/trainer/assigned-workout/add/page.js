'use client';
import React, { useEffect, useState } from 'react';
import { Form, Checkbox, DatePicker, Radio, notification } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import FormSelect from '../../../../../../../components/form/select';
import FormInput from '../../../../../../../components/form/input';
import { fetchServices, fetchTrainerGroupList, fetchuserlistForGroup, postTrainerWorkout } from '../../../../../../helpers/backend';
import { useAction, useFetch } from '../../../../../../helpers/hooks';
import { useI18n } from '../../../../../../providers/i18n';
import Button from '../../../../../../../components/common/button';
import dayjs from 'dayjs';
import { noSelected } from '../../../../../../helpers/utils';
import { useRouter } from 'next/navigation';

const Page = () => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);
    const [groupList, getGroupList] = useFetch(fetchTrainerGroupList);
    const [userList, getUserlist] = useFetch(fetchuserlistForGroup, {}, false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedLang, setSelectedLang] = useState();
    const [services, getServices] = useFetch(fetchServices);
    const { lang, languages, langCode } = useI18n();
    const [selectedRadio, setSelectedRadio] = useState(1);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const i18n = useI18n();
    const [form] = Form.useForm();
    const { push } = useRouter();

    useEffect(() => {
        setSelectedLang(langCode);
    }, [langCode]);



    const onFinish = (values) => {
        const multiLangFields = ['description'];
        const formattedData = multiLangFields.reduce((acc, field) => {
            acc[field] = {};
            languages.docs.forEach((lang) => {
                if (values[field] && values[field][lang.code]) {
                    acc[field][lang.code] = values[field][lang.code];
                }
            });
            return acc;
        }, {});

        if (selectedDays.length === 0) {
            notification.error({ message: 'Please select days' });
            return;
        }
        if (selectedWorkouts.length === 0) {
            notification.error({ message: 'Please select workout' });
            return;
        }

        const payload = {
            ...values,
            ...formattedData,
            start_date: dayjs(values?.start_date).format('YYYY-MM-DD'),
            end_date: dayjs(values?.end_date).format('YYYY-MM-DD'),
            group: values?.group,
            workouts: values?.workouts,
            selected_days: values?.selected_days,
            description: values?.description,
        };
        const payload2 = {
            ...values,
            ...formattedData,
            start_date: dayjs(values?.start_date).format('YYYY-MM-DD'),
            end_date: dayjs(values?.end_date).format('YYYY-MM-DD'),
            members: values?.members,
            workouts: values?.workouts,
            selected_days: values?.selected_days,
            description: values?.description,
        };
        useAction(postTrainerWorkout, selectedRadio === 2 ? payload2 : payload, () => {
            push('/trainer/assigned-workout');
            form.resetFields();
        });
    };

    const handleGroupChange = (value) => {
        setSelectedGroup(value);
        getUserlist({ _id: value });
    };
    const handleRadioChange = (e) => {
        form.resetFields();
        setSelectedRadio(e.target.value);
        if (e.target.value === 1) {
            setSelectedMembers([]);
        } else {
            setSelectedGroup(null);
        }
    };

    return (
        <div>
            <div className=''>
                <div className='flex justify-between'>
                    <h3 className='profileHeading' >{i18n?.t("Add Workout")}</h3>
                    <Button onClick={() => push('/trainer/assigned-workout')} className='!h-fit !py-1'>{i18n?.t("Back")}</Button>
                </div>
                <Form
                    form={form}
                    layout='horizontal'
                    onFinish={onFinish}
                >
                    <div className="w-full sm:flex gap-6 my-4">
                        <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
                            <Radio value={1}>{i18n?.t("Group")}</Radio>
                            <Radio value={2}>{i18n?.t("Member")}</Radio>
                        </Radio.Group>
                    </div>

                    <div className={`grid ${selectedRadio === 1 ? 'grid-cols-1' : 'md:grid-cols-2'} grid-cols-1 lg:gap-4 gap-2 mb-4`}>
                        <FormSelect
                            name="group"
                            label="Group"
                            options={groupList?.docs?.map(group =>
                            ({
                                label: group?.name[i18n?.langCode],
                                value: group?._id,
                            })
                            )}
                            placeholder="Select group"
                            onChange={handleGroupChange}
                        />
                        {selectedRadio === 2 && (
                            <div className='multiselect'>
                                <FormSelect
                                    name="members"
                                    label="Members"
                                    multi={true}
                                    options={userList?.docs[0]?.members?.map(m => ({
                                        label: m?.name,
                                        value: m?._id,
                                    }))}
                                    placeholder="Please select group first to add members"
                                    className='!overflow-auto'

                                />
                            </div>

                        )}
                    </div>

                    <div>

                        <div className='grid md:grid-cols-2 grid-cols-1 lg:gap-4 gap-2'>
                            <Form.Item name="start_date" label={i18n?.t("Start Date")} rules={[{ required: true, message: 'Please select start date' }]}>
                                <DatePicker
                                    className="border pt-2 pb-[11px] rounded w-full"
                                    placeholder={i18n?.t("Select date")}
                                    suffixIcon={<CalendarOutlined />}
                                />
                            </Form.Item>
                            <Form.Item name="end_date" label={i18n?.t("End Date")} rules={[{ required: true, message: 'Please select end date' }]}>
                                <DatePicker
                                    className="border pt-2 pb-[11px] rounded w-full"
                                    placeholder={i18n?.t("Select date")}
                                    suffixIcon={<CalendarOutlined />}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className='relative mt-4 mb-14'>
                        <div className='flex gap-3 items-center z-50 absolute right-0'>
                            <div className='flex h-fit gap-3'>
                                {languages?.docs?.map((l, index) => (
                                    <div
                                        onClick={() => setSelectedLang(l.code)}
                                        className={`rounded-full cursor-pointer px-3 py-1 text-sm font-medium transition-colors duration-200 ${l.code === selectedLang
                                            ? 'bg-primary text-white '
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        key={index}
                                    >
                                        {l.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {languages?.docs.map((l, index) =>
                        (
                            <div
                                className='selector-width w-full space-y-6'
                                key={index}
                                style={{ display: l.code === selectedLang ? 'block' : 'none' }}
                            >
                                <div className='w-full gap-6 whitespace-pre sm:flex'>
                                    <FormInput
                                        required={true}
                                        name={['description', l.code]}
                                        textArea={true}
                                        rows={4}
                                        placeholder={i18n?.t("Type a description")}
                                        label={i18n?.t("Description")}
                                    />
                                </div>

                            </div>
                        )
                        )}
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 lg:gap-4 gap-2 mt-5'>
                        <div className='mb-4 rounded border'>
                            <div className='rounded-t bg-primary p-3 text-white'>
                                <h3 className='text-lg font-semibold'>{i18n?.t("Select Day")}</h3>
                            </div>
                            <div className='p-[26px]'>
                                <Form.Item name='selected_days'>
                                    <Checkbox.Group
                                        value={selectedDays}
                                        onChange={(checkedValues) => setSelectedDays(checkedValues)}
                                    >
                                        {[
                                            'saturday',
                                            'sunday',
                                            'monday',
                                            'tuesday',
                                            'wednesday',
                                            'thursday',
                                            'friday',
                                        ].map((day) => (
                                            <div className='flex items-center space-x-4 capitalize' key={day}>
                                                <Checkbox value={day}></Checkbox>
                                                <li>{i18n?.t(day)}</li>
                                            </div>
                                        ))}
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                        </div>
                        <div className='mb-4 rounded border '>
                            <div className='rounded-t bg-primary p-3 text-white'>
                                <h3 className='text-lg font-semibold'>{i18n?.t("Select Workouts")}</h3>
                            </div>
                            <div className='p-[26px] overflow-auto h-[35vh] hide-scrollbar  '>
                                <Form.Item name='workouts' className='h-[250px] '>
                                    <Checkbox.Group
                                        value={selectedWorkouts}
                                        onChange={(checkedValues) => setSelectedWorkouts(checkedValues)}
                                    >
                                        {services?.docs?.map((d) => (
                                            <div className='flex items-center space-x-4 capitalize' key={d?._id}>
                                                <Checkbox value={d?._id}></Checkbox>
                                                <li>{d?.name[langCode]}</li>
                                            </div>
                                        ))}
                                    </Checkbox.Group>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 flex justify-start'>
                        <Button type='submit' onClick={() => noSelected({ form, setSelectedLang })} className="mt-2.5">{i18n?.t("Submit")}</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Page;
