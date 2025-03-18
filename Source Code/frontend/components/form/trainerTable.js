import { Pagination } from "antd";
import { useActionConfirm } from "../../app/helpers/hooks";
import { FiEdit, FiEye } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import SearchInput from "../../components/form/search";
import { Loader } from "../common/loader";
import { useI18n } from "../../app/providers/i18n";

const TrainerTable = ({
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
        await useActionConfirm(
            onDelete,
            { _id: data._id },
            onReload,
            'Are you sure you want to delete this item?',
            'Yes, Delete'
        );

    };

    let cols = noActions ? columns : [...columns, {
        text: i18n.t('Action'),
        dataField: 'no_actions',
        className: 'w-44 text-right',
        formatter: (noActions, data) => {
            return (
                <div className="flex justify-end gap-2.5">
                    {actions && actions(data)}
                    {onDelete && (data?.disableDelete !== 1) && (
                        <button className="bg-white shadow-sm shadow-gray-400 text-[#2b2b2b] hover:bg-primary hover:text-white duration-500 p-1 rounded"
                            title="Delete" onClick={() => handleDeleteClick(data)}>
                            <RiDeleteBinLine size={22} />
                        </button>
                    )}
                    {data.disableEdit === 1 && !onView && data.disableDelete === 1 && !actions && '-'}
                    {onEdit && (data?.disableEdit !== 1) && (
                        <button className="bg-white shadow-sm shadow-gray-400 text-[#2b2b2b] hover:bg-primary hover:text-white duration-500 p-1 rounded"
                            title="Edit" onClick={() => handleEditClick(data)}>
                            <FiEdit size={22} />
                        </button>
                    )}
                    {onView && (
                        <button className="bg-white shadow-sm shadow-gray-400 text-[#2b2b2b] hover:bg-primary hover:text-white duration-500 p-1 rounded"
                            title="View" onClick={() => onView(data)}>
                            <FiEye size={22} />
                        </button>
                    )}
                </div>
            )
        }
    }];

    return (
        <>
            <div className={`w-full rounded-lg mb-4 ${shadow ? '' : ''} bg-white`}>
                {noHeader || (
                    <header className="px-2 pt-4 pb-3 gap-5 border-b border-gray-200 flex justify-between flex-wrap bg-gray-50 rounded-t-lg ">
                        {title ? (
                            <>
                                {typeof title === 'string' ? (
                                    <h4 className="text-lg font-semibold text-[#003049]">{title}</h4>
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
                <div className="relative">
                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="table-auto w-full border border-gray-200 rounded-lg">
                            <thead className="text-xs font-poppins font-semibold uppercase text-gray-700 bg-gray-100 rounded-t-lg">
                                <tr>
                                    {indexed && (
                                        <th className="p-3 whitespace-nowrap">
                                            <div className="font-semibold text-left">#</div>
                                        </th>
                                    )}
                                    {cols?.map((column, index) => (
                                        <th className="p-3 whitespace-nowrap text-left" key={index}>
                                            <div className={`font-semibold ${column?.className || ''}`}>
                                                {column.text}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={cols.length + (indexed ? 1 : 0)} className="h-96 pb-16">
                                            <div style={{ height: 200 }} className='absolute w-full flex justify-center'>
                                                <Loader />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {(pagination ? data?.docs : data)?.length === 0 ? (
                                            <tr>
                                                <td colSpan={cols.length + (indexed ? 1 : 0)} className="text-center py-10 text-gray-500">
                                                    {i18n?.t('No Data Found')}
                                                </td>
                                            </tr>
                                        ) : (
                                            (pagination ? data?.docs : data)?.map((row, index) => (
                                                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                    {indexed && (
                                                        <td className="p-3 whitespace-nowrap text-gray-500">
                                                            {(pagination ? (data?.page - 1) * data.limit : 0) + index + 1}
                                                        </td>
                                                    )}
                                                    {cols?.map((column, index) => (
                                                        <td className={`p-3 whitespace-nowrap text-gray-700 ${column?.className || ''}`} key={index}>
                                                            {column.formatter ? column.formatter(row[column.dataField], row) : (row[column.dataField] || '-')}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pagination && (
                        <div className="py-4 mt-5">
                            <Pagination
                                current={data?.page}
                                total={data?.totalDocs}
                                pageSize={data?.limit}
                                onChange={(page, pageSize) => onReload({ page, limit: pageSize, langCode })}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TrainerTable;