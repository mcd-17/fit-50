import { Form } from 'antd';
import React, { useEffect } from 'react';
import JodiEditor from '../../../components/form/jodiEditor';
import PageTitle from '../../../components/common/page-title';
import Button from '../../../../../components/common/button';
import { useAction, useFetch } from '../../../../helpers/hooks';
import { fetchMarketingSettings, postMarketingSettings } from '../../../../helpers/backend';

const EmailTemplate = () => {
    const [form] = Form.useForm();
    const [settings, getSettings, { loading }] = useFetch(fetchMarketingSettings)
    useEffect(() => {
        form.setFieldsValue({
            email_template1: settings?.email_template[0],
            email_template2: settings?.email_template[1]
        })
    }, [settings])
    return (
        <div>
            <div className='px-4 pt-5 pb-1 bg-white rounded-sm mb-4'>
                <PageTitle title={"Email Template"} />
            </div>
            <div className='bg-white p-4 rounded'>
                <Form
                    form={form}
                    onFinish={(values) => {
                        let email_template = [values?.email_template1, values?.email_template2]
                        return useAction(postMarketingSettings, {
                            ...settings,
                            email_template: email_template
                        }, () => {
                            getSettings();
                        })
                    }}
                >
                    <div className="my-6 flex flex-col gap-4">
                        <JodiEditor label={"Email Template 1"} placeholder={("Message")} name={'email_template1'} required />
                        <JodiEditor label={"Email Template 1"} placeholder={("Message")} name={'email_template2'} required />
                    </div>
                    <Button className='mt-4 !py-1' type="primary" htmlType="submit">Save</Button>
                </Form>

            </div>
        </div>

    );
};

export default EmailTemplate;