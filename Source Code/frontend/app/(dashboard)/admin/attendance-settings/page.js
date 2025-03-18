'use client';
import React, { useEffect } from 'react';
import { Card, Col, Form, Row } from 'antd';
import { message } from 'antd';
import PageTitle from '../../components/common/page-title';
import { fetchAdminSettings, fetchAttendanceSettings, postAdminSettings, postAttendanceSettings } from '../../../helpers/backend';
import FormInput, { HiddenInput } from '../../components/form/input';
import { useFetch } from '../../../helpers/hooks';
import Button from '../../../../components/common/button';
import { useI18n } from '../../../providers/i18n';
import FormSelect from '../../components/form/select';

const AdminSettings = () => {
    const [form] = Form.useForm();
    const i18n = useI18n()
    const [data, getData] = useFetch(fetchAttendanceSettings)
  

    useEffect(() => {
        if (data) {
            form.setFieldsValue(data);
        }
    }, [data, form]);

    const handleFinish = async (values) => {
        const data = {
            ...values,
            _id: values?._id || undefined
        }
        const { err, msg } = await postAttendanceSettings(data)
        if (err) {
            message.error(msg)
        } else {
            message.success(msg)
            getData()
        }
    }
    const data2 = {
        checkInTime: "01:00",
        checkOutTime: "24:00",
        weekend: [0, 1]
    };
    
    const generateTimeSlots = (start, end) => {
        let slots = [];
        let [startHour] = start.split(":").map(Number);
        let [endHour] = end.split(":").map(Number);
    
        for (let hour = startHour; hour <= endHour; hour++) {
            const period = hour >= 12 ? "PM" : "AM";
            const displayHour = hour % 12 || 12; 
            const label = `${displayHour}:00 ${period}`;
            const value = `${hour.toString().padStart(2, '0')}:00`;
    
            slots.push({ label, value });
        }
        return slots;
    };
    const timeSlots = generateTimeSlots(data2.checkInTime, data2.checkOutTime);
    const weekendDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return (
        <div className='lg:w-1/2 w-full'>
            <PageTitle title="Attendance Settings" />
            <Card>
                <Row>
                    <Col span={24}>
                        <Form form={form} layout="vertical" onFinish={handleFinish}>
                            <div className="">
                                <HiddenInput name="_id" />
                                <FormSelect placeholder={i18n?.t("Select Check In Time")} name="checkInTime" label={"Check In Time"}
                                    options={timeSlots} required />
                                <FormSelect placeholder={i18n?.t("Select Check Out Time")} name="checkOutTime" label={"Check Out Time"}
                                    options={timeSlots} required />
                                <FormSelect placeholder={i18n?.t("Select Weekend Days")} name="weekend" label={"Weekend Days"}
                                multi={true}
                                    options={weekendDays?.map((day,index)=>({label:day,value:index}))} required />
                            </div>
                            <Button type='submit' className="mt-4"> {i18n?.t("Submit")} </Button>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AdminSettings;