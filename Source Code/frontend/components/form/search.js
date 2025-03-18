import {FiSearch} from "react-icons/fi";
import { useI18n } from "../../app/providers/i18n";

const SearchInput = ({className, wrapperClassName, value, onChange, placeholder}) => {
    const i18n = useI18n();
    return (
        <div className={`relative mr-2 ${wrapperClassName || ''}`}>
            <input
                className={`form-input ${className || ''}`}
                style={{borderRadius: 4, padding: '8px 8px 8px 32px'}}
                value={value} onChange={onChange} placeholder={placeholder || i18n?.t('Search')}/>
            <FiSearch className="absolute top-3 left-2.5 text-gray-500"/>
        </div>

    )
}
export default SearchInput