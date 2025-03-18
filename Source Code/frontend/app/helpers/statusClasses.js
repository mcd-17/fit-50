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
