import React, { useEffect, useState } from 'react';
import PageTitle from '../../../../components/common/page-title';
import { Form, Radio } from 'antd';
import FormInput from '../../../../components/form/input';
import { useAction, useFetch } from '../../../../../helpers/hooks';
import { fetchGroups, fetchMarketingGroupList, fetchMarketingSettings, sendMarketingMail } from '../../../../../helpers/backend';
import FormSelect from '../../../../components/form/select';
import { columnFormatter } from '../../../../../helpers/utils';
import FormCheckbox from '../../../../components/form/checkbox';
import JodiEditor from '../../../../components/form/jodiEditor';
import Button from '../../../../../../components/common/button';
import FormDatePicker from '../../../../components/form/date_picker';

const SendEmail = () => {
    const [form] = Form.useForm();
    const [groups] = useFetch(fetchMarketingGroupList);
    const [settings, getSettings, { loading }] = useFetch(fetchMarketingSettings)
    const [value, setValue] = useState(0);
    const [value2, setValue2] = useState(0);
    useEffect(() => {
        form.setFieldsValue({
            content: settings?.email_template[value]
        })
    }, [settings, value])
    const onFinish = (values) => {
        const payload = {
            content: values.content,
            subject: values.subject,
            scheduled_date: value2 === 0 && !values?.scheduled_date ? undefined : values?.scheduled_date,
            to: values.to,
            individual_mail: values.individual_mail,
            subscriber: values.subscriber,
            user: values.user,
            trainer: values.trainer,
            employee: values.employee

        }
        useAction(sendMarketingMail, payload, () => {
            const fieldsToReset = Object.keys(values).filter(key => key !== "content");
            form.resetFields(fieldsToReset);
        })
    }
    return (
        <div className='!w-full'>
            <div className='px-4 pt-5 pb-1 bg-white rounded-sm mb-4'>
                <PageTitle title={"Send Email"} />
            </div>
            <div className='rounded p-4 bg-white'>
                <Form onFinish={onFinish} form={form}>
                    <h2 className='py-2 px-3 bg-[#E5E7EB] rounded mb-2'>Email's credentials will be collected from settings.</h2>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <FormInput name={"individual_mail"} label={"To : Individual"} type={"email"} placeholder={"Enter Email Address"} />
                        <FormSelect placeholder={"Select Group"} options={groups?.docs?.map((item) => ({ label: item?.name, value: item?._id }))} name={"to"} label={"To : Group"} />
                    </div>
                    <div className='flex items-center flex-wrap gap-4'>
                        <FormCheckbox label={"Subscribed User"} name={"subscriber"} />
                        <FormCheckbox label={"Member"} name={"user"} />
                        <FormCheckbox label={"Trainer"} name={"trainer"} />
                        <FormCheckbox label={"Employee"} name={"employee"} />
                    </div>
                    <FormInput placeholder={"Enter Subject"} name={"subject"} label={"Subject"} required={true} />
                    <Form.Item >
                        <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
                            <Radio value={0}>Mail Template 1</Radio>
                            <Radio value={1}>Mail Template 2</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <div className="my-6">
                        <JodiEditor placeholder={("Message")} name={'content'} required />
                    </div>
                    <Form.Item>
                        <Radio.Group onChange={(e) => setValue2(e.target.value)} value={value2}>
                            <Radio value={0}>Send Now</Radio>
                            <Radio value={1}>Schedule For Later</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {
                        value2 === 1 && (
                            <FormDatePicker name={"scheduled_date"} label={"Scheduled Date"} placeholder={"Select Date"} showTime={true} />
                        )
                    }
                    <Button className='!py-1 mt-3' loading={loading} type={'submit'}>Send</Button>
                </Form>
            </div>
        </div>
    );
};

export default SendEmail;