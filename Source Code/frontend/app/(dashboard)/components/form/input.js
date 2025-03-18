import { DatePicker, Form } from 'antd';
import { useI18n } from '../../../providers/i18n';

const FormInput = ({ label, name, placeholder, required, isEmail, initialValue, rules = [], textArea, type, readOnly, onChange }) => {
    const i18n = useI18n();
    let initRules = [
        {
            required: required,
            message: `Please provide ${typeof label === 'string' && label?.toLowerCase() || 'a value'}`
        },
    ]
    if (isEmail) {
        initRules.push({ type: 'email', message: 'Please enter a valid email address' })
    }

    let input = <input className="form-input" type={type} onChange={onChange} placeholder={i18n?.t(placeholder)} readOnly={readOnly} />
    textArea && (input = <textarea className="form-input" />)
    type === 'date' && (input = <DatePicker />)

    return (
        <Form.Item
            name={name}
            label={i18n?.t(label)}
            rules={[...initRules, ...rules]}
            className="mb-4"
            initialValue={initialValue || ''}
            placeholder={i18n?.t(placeholder)}
        >
            {input}
        </Form.Item>
    )
}

export default FormInput;


export const HiddenInput = ({ name, initialValue }) => {
    return (
        <Form.Item
            name={name}
            initialValue={initialValue || ''}
            hidden
        >
            <input className="form-input" />
        </Form.Item>
    )
}