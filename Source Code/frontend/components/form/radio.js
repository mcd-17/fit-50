import React, {useState} from "react"
import {Form, Select, Radio} from "antd"

const FormRadio = (
    {
        name,
        label,
        initialValue,
        options = [],
        onSelect,
        onChange,
        placeholder,
        required = false,
        rules = [],
        search = false,
        isMulti = false,
        className
    }
) => {

    let initRules = []
    if (required) {
        initRules.push({required: true, message: 'Please select a option'})
    }

    const [value, setValue] = useState(1);

    return (
        <Form.Item
            rules={[...initRules, ...rules]}
            name={name}
            label={label}
            required
            initialValue={initialValue || ''}

        >
            <Radio.Group value={value} required onChange={(v) => onChange(v.target.value)}>
                {options.map((option, i) => (
                    <Radio value={option.value} key={i}>{option.text}</Radio>
                ))}
            </Radio.Group>
        </Form.Item>
    )
}
export default FormRadio
