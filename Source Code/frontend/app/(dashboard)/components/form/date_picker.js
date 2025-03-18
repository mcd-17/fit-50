import React from "react"
import { Form, DatePicker } from "antd"
import { useI18n } from "../../../providers/i18n"

const FormDatePicker = ({ name, label, initialValue, onChange, placeholder, extra, disabled = false, tooltip = '', required = false, showTime = false }) => {
    const i18n = useI18n()  
    return (
        <Form.Item
            name={name}
            label={i18n?.t(label)}
            initialValue={initialValue || ''}
            placeholder={i18n?.t(placeholder)}
            extra={extra && extra}
            rules={[
                {
                    required: required,
                    message: 'Please input your ' + label + '!',
                },
            ]}
        >
            <DatePicker title={disabled && tooltip} disabled={disabled} showTime={showTime} onOk={onChange} className={'form-control'} />
        </Form.Item>
    )
}
export default FormDatePicker




