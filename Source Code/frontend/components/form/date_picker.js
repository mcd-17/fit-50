import React from "react"
import { Form, DatePicker } from "antd"

const FormDatePicker = ({ name, label, initialValue, onChange, placeholder, extra, disabled = false, tooltip = '', required = false, showTime = false }) => {

    return (
        <Form.Item
            name={name}
            label={label}
            initialValue={initialValue || ''}
            placeholder={placeholder}
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




