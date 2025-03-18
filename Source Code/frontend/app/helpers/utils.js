import { useI18n } from "../providers/i18n";
const statusWarning = 'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize';
const statusSuccess = 'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize';
const statusDanger = 'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800 capitalize';
const statusInfo = 'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize';
const statusSecondary = 'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize';
const statusFuchsia = 'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-800 capitalize';

export const statusClass = {
    'Under Approval': statusWarning,
    'Approved': statusInfo,
    'Published': statusSuccess,
    'Unpublished': statusSecondary,
    'Rejected': statusDanger,
    'suspended': statusDanger,
    'pending': statusWarning,
    'approved': statusInfo,
    'rejected': statusDanger,
    'processing': statusInfo,
    'active': statusInfo,
    'completed': statusSuccess,
    'complete': statusSuccess,
    'cancelled': statusDanger,
    'failed': statusDanger,
    'refunded': statusDanger,
    'on-hold': statusWarning,
    'trash': statusInfo,
    'accepted': statusInfo,
    'started': statusSuccess,
    'driver_pending': statusDanger,
    'user_pending': statusDanger,
    'ride': statusDanger,
    'add_money': statusSuccess,
    'paid': statusFuchsia,
    'break': statusWarning,
};
export const getStatusClass = (status) => {
    return statusClass[status] || 'status-default';
};

export const getTimeFormat = seconds => {
    return seconds > 0 ? `${(seconds / 3600).toFixed(0)}:${((seconds / 60 >> 0) % 60).toString().padStart(2, '0')}` : ''
}

export const noSelected = ({ form, setSelectedLang }) => {
    const data = form?.getFieldsValue();
    const emptyLanguages = new Set();

    for (let key in data) {
        for (let lang in data[key]) {
            if (!data[key][lang]) {
                emptyLanguages.add(lang);
            }
        }
    }

    if ([...emptyLanguages][0]) {
        setSelectedLang([...emptyLanguages][0]);
    }
}

export const columnFormatter = (value) => {
    const { langCode } = useI18n();
    if (value && typeof value === 'object') {
        if (langCode && value[langCode]) {
            return value[langCode];
        }
        return value['en'] || '';
    }

    return '';
}

export const StatusButton = ({ isActive }) => {
    const buttonClass = isActive ? 'bg-green-300 text-white' : 'bg-red-300 text-white';
  
    return (
      <button className={`px-2 py-1 rounded-full ${buttonClass}`}>
        {isActive ? 'Active' : 'Inactive'}
      </button>
    );
  };