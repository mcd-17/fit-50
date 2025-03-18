import { DatePicker, Form } from 'antd';
import { useI18n } from '../../app/providers/i18n';
import { useState, useEffect } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

const FormInput = ({
    label, name, rows, placeholder, required, isEmail, initialValue, rules = [], textArea, type, readOnly, onChange, onBlur, form
}) => {
    const i18n = useI18n();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue || '');

    useEffect(() => {
        setInputValue(initialValue);
    }, [initialValue]);

    let initRules = [
        { required: required },
    ];

    if (isEmail) {
        initRules.push({ type: 'email', message: `${i18n?.t(`Please enter a valid email address`)}` });
    }

    const handlePasswordChange = (e) => {
        setInputValue(e.target.value);
        if (onChange) onChange(e);
    };

    const handleBlur = (e) => {
        if (onBlur) onBlur(e);
    };

    let input;
    if (textArea) {
        input = <textarea placeholder={i18n?.t(placeholder)} className="form-input" rows={rows} />;
    } else if (type === 'date') {
        input = <DatePicker />;
    } else if (type === 'password') {
        input = (
            <div className="relative">
                <input
                    className="form-input pr-10"
                    type={passwordVisible ? 'text' : 'password'}
                    value={inputValue}
                    onChange={handlePasswordChange}
                    onBlur={handleBlur}
                    placeholder={i18n?.t(placeholder)}
                    readOnly={readOnly}
                />
                <span
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                >
                    {passwordVisible ? <IoEye className='text-white text-lg' /> : <IoEyeOff className='text-white text-lg' />}
                </span>
            </div>
        );
    } else {
        input = (
            <input
                className="form-input"
                type={type}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    if (onChange) onChange(e);
                }}
                onBlur={onBlur}
                placeholder={i18n?.t(placeholder)}
                readOnly={readOnly}
            />
        );
    }

    return (
        <Form.Item
            name={name}
            label={i18n?.t(label)}
            rules={[...initRules, ...rules]}
            className="mb-4"
        >
            {input}
        </Form.Item>
    );
};

export default FormInput;
export const HiddenInput = ({ name, initialValue }) => {
    return (
        <Form.Item
            name={name}
            initialValue={initialValue || ''}
            hidden
        >
            <input className="form-input" autoComplete="off" />
        </Form.Item>
    );
};