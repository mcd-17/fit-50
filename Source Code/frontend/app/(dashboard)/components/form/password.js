"use clint"

import {Form} from 'antd';
import {useState} from "react";
import {FiEye, FiEyeOff} from "react-icons/fi";

const FormPassword = ({name, label, required, placeholder, min = 6, initialValue,  confirm = false, noCurrent = false}) => {
    const t = d => d
    let rules = [
        {required, message: t('Please enter a password')},
        {min: confirm ? 0 : min, message: t('Password must be at least 6 characters')}
    ]

    if (confirm) {
        rules.push(({getFieldValue}) => ({
            validator(_, value) {
                if ((!value && required) || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
        }))
    }

    if (noCurrent) {
        rules.push(({getFieldValue}) => ({
            validator(_, value) {
                if ((!value && required) || getFieldValue('current_password') !== value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error(t("New password can't be same as current password")));
            },
        }))
    }

    return (
        <Form.Item
            name={name}
            label={label}
            className="mb-4"
            rules={rules}
            initialValue={initialValue || ''}
        >
            <PasswordInputField
                placeholder={placeholder}
            />
        </Form.Item>
    )
}

export default FormPassword



const PasswordInputField = ({value, onChange, placeholder, ...props}) => {
    const [visible, setVisible] = useState(false)
    return (
        <div className="relative">
            <input
                value={value}
                onChange={onChange}
                {...props}
                type={visible ? 'text' : 'password'}
                className="form-input !pr-8"
                placeholder={placeholder}/>
            <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                role="button"
                onClick={() => setVisible(!visible)}>
                {visible ? <FiEye className="text-gray-700"/> : <FiEyeOff className="text-gray-700"/>}
            </div>
        </div>
    )
}