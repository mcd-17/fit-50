import {Form, Select} from "antd";
import { useI18n } from "../../../providers/i18n";

const FormSelect = ({label, name, required,onSearch, initialValue, options, search, rules = [], multi, tags, placeholder, onSelect, onChange, allowClear, disabled, title}) => {
    const i18n = useI18n();
    let initRules = [
        {required: required, message: `${i18n.t(`Please select ${label || 'a option'}`)}`},
    ]
   

    return (
        <Form.Item
            label={i18n?.t(label)}
            name={name}
            className="mb-3"
            rules={[...initRules, ...rules]}
            initialValue={initialValue}
        >
            <Select
                mode={multi ? 'multiple' : tags ? 'tags' : 'default'}
                popupClassName={tags ? 'd-none' : ''}
                allowClear={allowClear}
                onSelect={onSelect}
                disabled={disabled}
                onChange={onChange}
                placeholder={i18n?.t(placeholder)}
                filterOption={(input, option) => {
                    if (typeof option.children === 'string') {
                        return option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    return 0
                }}
                showSearch={search}
                title={title}
                onSearch={onSearch}
            >
                {options?.map((option, index) => (
                    <Select.Option key={index} disabled={option.disabled}
                                   value={option?._id || option?.value}>{option.name || option?.label}</Select.Option>
                ))}
            </Select>
        </Form.Item>

    )
}

export default FormSelect