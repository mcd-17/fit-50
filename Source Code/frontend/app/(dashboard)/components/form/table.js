
import { FaEye, FaPencilAlt, FaTimes, FaTrashAlt } from "react-icons/fa";
import { message, Modal } from 'antd';
import { useState } from "react";
import { useActionConfirm } from "../../../helpers/hooks";
import Loader from '/components/common/loader'
import SearchInput from '../../components/form/search'
import { useI18n } from "../../../providers/i18n";
import Pagination from "../../../../components/common/pagination";
import { InfinitySpin } from "react-loader-spinner";

const Table = ({
    columns,
    data,
    indexed,
    loading = false,
    noActions,
    actions,
    action,
    onView,
    onEdit,
    onDelete,
    onReload,
    pagination = false,
    shadow = true,
    title,
    noHeader = false,
    afterSearch,
    onSearchChange,
    langCode
}) => {
    const i18n = useI18n();
    const handleEditClick = (data) => {
        onEdit(data);

    };

    const handleDeleteClick = async (data) => {
        if (onDelete) {
            await useActionConfirm(
                onDelete,
                { _id: data._id },
                onReload,
                'Are you sure you want to delete this item?',
                'Yes, Delete'
            );
        }
    };

    let cols = noActions ? columns : [...columns, {
        text: i18n.t("Action"),
        dataField: 'no_actions',
        className: 'w-44 text-right',
        formatter: (noActions, data) => {
            return (
                <div className="flex justify-end gap-2.5">
                    {actions && actions(data)}
                    {onView && (
                        <button className="btn btn-outline-success btn-sm focus:shadow-none border border-green-700 text-green-700 p-2 rounded hover:bg-green-700 hover:text-white"
                            title="View" onClick={() => onView(data)}>
                            <FaEye />
                        </button>
                    )}
                    {data.disableEdit === 1 && !onView && data.disableDelete === 1 && !actions && '-'}
                    {onEdit && (data?.disableEdit !== 1) && (
                        <button className="border border-indigo-700 text-indigo-700 p-2 rounded hover:bg-indigo-700 hover:text-white focus:shadow-none"
                            title="Edit" onClick={() => handleEditClick(data)}>
                            <FaPencilAlt size={12} />
                        </button>
                    )}
                    {onDelete && (data?.disableDelete !== 1) && (
                        <button className="border border-red-700 p-2 rounded hover:bg-red-700 text-red-600 hover:text-white focus:shadow-none"
                            title="Delete" onClick={() => handleDeleteClick(data)}>
                            <FaTrashAlt size={12} />
                        </button>
                    )}
                </div>
            )
        }
    }];

    return (
        <>
            <div className={`w-full bg-white ${shadow ? 'shadow-lg' : ''} rounded-sm mb-4`}>
                {noHeader || (
                    <header className="px-4 pt-3 pb-2 border-b gap-3 border-gray-100 flex justify-between flex-wrap">
                        {title ? (
                            <>
                                {typeof title === 'string' ? (
                                    <h4 className="text-base font-medium text-[#003049]">{i18n?.t(title)}</h4>
                                ) : title}
                            </>
                        ) : (
                            <div className="flex flex-wrap">
                                <SearchInput
                                    className="w-44"
                                    onChange={e => {
                                        const search = e.target.value || undefined;
                                        onReload({ search, langCode, page: 1 });
                                        onSearchChange && onSearchChange(search, langCode);
                                    }}
                                />
                                {afterSearch}
                            </div>
                        )}
                        {action}
                    </header>
                )}
                <div className="p-3 relative">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead className="text-xs font-semibold uppercase bg-gray-50 text-gray-500">
                                <tr>
                                    {indexed && (
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">#</div>
                                        </th>
                                    )}
                                    {cols?.map((column, index) => (
                                        <th className="p-2 whitespace-nowrap text-left" key={index}>
                                            <div className={`font-semibold ${column?.className || ''}`}>
                                                {i18n?.t(column?.text)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td className="h-96 pb-16">
                                            <div style={{ height: 200 }} className='absolute w-full flex justify-center'>
                                            <InfinitySpin width='140' color='#E67529' />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {(pagination ? data?.docs : data)?.map((row, index) => (
                                            <tr key={index}>
                                                {indexed && (
                                                    <td className="p-2 whitespace-nowrap text-gray-500">
                                                        {(pagination ? (data?.page - 1) * data.limit : 0) + index + 1}
                                                    </td>
                                                )}
                                                {cols?.map((column, index) => (
                                                    <td className={`p-2 whitespace-nowrap text-gray-700 ${column?.className || ''}`}
                                                        key={index}>
                                                        {column.formatter ? column.formatter(row[column.dataField], row) : (row[column.dataField] || '-')}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pagination && (
                        <div className="pt-3 mt-3 border-t">
                            <Pagination
                                page={data?.page} total={data?.totalDocs}
                                onSizeChange={limit => onReload({ limit, langCode })}
                                limit={data?.limit}
                                totalPages={data?.totalPages}
                                onPageChange={page => onReload({ page, langCode })}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Table


export const DetailTable = ({ data, columns, title, actions }) => {
    const i18n = useI18n()
    return (
        <div className="bg-white shadow-md rounded-md p-4">
            {!!title && <div className="text-xl font-semibold mb-4">{i18n?.t(title)}</div>}
            <div className="body">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <tbody>
                            {columns?.map((column, index) => (
                                <tr key={index} className="border-b border-gray-300">
                                    <td className="py-2 px-4">{i18n?.t(column?.text)}</td>
                                    <td className="py-2 px-4 text-sm">{!!data ? !!column?.formatter ? column?.formatter(data[column.dataIndex], data) : data[column.dataIndex] : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {actions}
            </div>
        </div>
    )
}

export const TableImage = ({ url }) => {
    const [image, setImage] = useState();
    return (
        <div className='w-inline-block h-8'>
            <img
                role='button'
                src={url}
                alt='Image'
                onClick={() => setImage(url)}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            <Modal
                width={800}
                open={image}
                onCancel={() => setImage(undefined)}
                footer={null}
                bodyStyle={{ padding: 0, zIndex: 60 }}
                closeIcon={
                    <FaTimes
                        size={18}
                        className='  rounded hover:!bg-none text-primary'
                    />
                }
            >
                <div className="flex justify-center items-center" >

                    <img className='w-100 ' style={{ minHeight: 400 }} src={image} alt='' />
                </div>
            </Modal>
        </div>
    );
};
