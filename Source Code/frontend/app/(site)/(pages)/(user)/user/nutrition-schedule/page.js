'use client';
import { Modal, Table } from 'antd';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useFetch } from '../../../../../helpers/hooks';
import { fetchUserNutrationSchedule } from '../../../../../helpers/backend';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter } from '../../../../../helpers/utils';
import dayjs from 'dayjs';
import { useState } from 'react';

const Page = () => {
    const [data, getData, { loading }] = useFetch(fetchUserNutrationSchedule, {});
    const [edit, setEdit] = useState(false);
    const i18n = useI18n();
    const [nutritionDetails, setNutritionDetails] = useState({});
    const columns = [
        {
            text: i18n?.t('Start Date'),
            dataField: 'start_date',
            formatter: (_, d) => <span>{dayjs(d?.start_date).format('DD MMM YYYY')}</span>,
        },
        {
            text: i18n?.t('End Date'),
            dataField: 'end_date',
            formatter: (_, d) => <span>{dayjs(d?.end_date).format('DD MMM YYYY')}</span>,
        },
        {
            text: i18n?.t('Group'),
            dataField: 'group',
            formatter: (_, d) => <span>{d?.group?.name ? columnFormatter(d?.group?.name) : <span className='text-red-500'> {i18n?.t("-")}</span>}</span>,
        }

    ];
    const generateTableData = () => {
        const { selected_days, nutrition } = nutritionDetails;
        const rows = [];

        selected_days?.forEach((day) => {
            nutrition.forEach((item) => {
                rows.push({
                    key: `${day}-${item._id}`,
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    type: item.type,
                    description: item.description,
                });
            });
        });

        return rows;
    };
    const columns2 = [
        {
            title: (
                <span className="nutriTIonTableTitle">
                    {i18n?.t('Day')}
                </span>
            ),
            dataIndex: 'day',
            key: 'day',
            render: (text, row, index) => {
                const sameDayAsPrevious =
                    index > 0 && row.day === generateTableData()[index - 1].day;
                return (
                    <span className={`${sameDayAsPrevious ? '' : 'font-medium'} nutriTIonTableData`}>
                        {sameDayAsPrevious ? '' : text}
                    </span>
                );
            },
        },
        {
            title: (
                <span className="nutriTIonTableTitle">
                    {i18n?.t('Nutrition Type')}
                </span>
            ),
            dataIndex: 'type',
            key: 'type',
            render: (text) => (
                <span className="nutriTIonTableData">
                    {text || <span className="text-red-500"> {i18n?.t("N/A")}</span>}
                </span>
            ),
        },
        {
            title: (
                <span className="nutriTIonTableTitle">
                    {i18n?.t('Description')}
                </span>
            ),
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <span className="nutriTIonTableData">
                    {text || <span className="text-red-500"> {i18n?.t("N/A")}</span>}
                </span>
            ),
        },
    ];

    return (
        <div>
            <h1 className='profileHeading'>
                {i18n?.t('Nutrition Schedule')}
            </h1>
            <hr className='mb-4' />

            <TrainerTable
                data={data}
                columns={columns}
                onReload={getData}
                onView={(data) => {
                    setEdit(true);
                    setNutritionDetails(data);
                }}
                noHeader
                pagination
            />
            <Modal
                width={800}
                title={i18n?.t('Nutrition List')}
                open={edit}
                onCancel={() => setEdit(false)}
                footer={null}
            >
                <div className='overflow-hidden rounded-lg border border-gray-300 shadow-sm'>
                    <Table
                        columns={columns2}
                        dataSource={generateTableData()}
                        pagination={false}
                        bordered
                        rowClassName={() => "hover:bg-gray-100"}
                    />
                </div>
            </Modal>

        </div>
    );
};

export default Page;
