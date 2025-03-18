'use client';
import { Modal } from 'antd';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useFetch } from '../../../../../helpers/hooks';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter } from '../../../../../helpers/utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import { fetchUserWorkout } from '../../../../../helpers/backend';

const Page = () => {
    const [data, getData] = useFetch(fetchUserWorkout, {});
    const [edit, setEdit] = useState(false);
    const i18n = useI18n();
    const [workoutDetails, setworkoutDetails] = useState({});
    const truncateToFiveWords = (text) => {
        if (!text) return '';
        const words = text.split(' ');
        const limitedWords = words.slice(0, 5);
        return limitedWords.join(' ') + (words.length > 5 ? '...' : '');
    };
    const columns = [
        {
            text: i18n?.t('Group') || 'Group',
            dataField: 'group',
            formatter: (_, d) => <span className="font-poppins">{d?.group?.name ? columnFormatter(d?.group?.name) : <span className='text-red-500'> {i18n?.t("-")}</span>}</span>,
        },
        {
            text: i18n?.t('Start Date') || 'Start Date',
            dataField: 'start_date',
            formatter: (_, d) => <span className="font-poppins">{dayjs(d?.start_date).format('DD MMM YYYY')}</span>,
        },
        {
            text: i18n?.t('End Date') || 'End Date',
            dataField: 'end_date',
            formatter: (_, d) => <span className="font-poppins">{dayjs(d?.end_date).format('DD MMM YYYY')}</span>,
        },
        {
            text: i18n?.t('Description') || 'Description',
            dataField: 'description',
            formatter: (_, d) => {
                return (
                    <span className="font-poppins">{truncateToFiveWords(columnFormatter(d?.description))}</span>

                );
            },
        },
    ];
    return (
        <div>
            <h1 className='profileHeading'>
                {i18n?.t('Workout')}
            </h1>
            <hr className='mb-4' />

            <TrainerTable
                data={data}
                columns={columns}
                onReload={getData}
                onView={(data) => {
                    setEdit(true);
                    setworkoutDetails(data);
                }}
                noHeader
                pagination
            />
            <Modal
                width={800}    
                title={<h1 className='profileHeading'>
                    {i18n?.t('Workout List')}
                </h1>}
                open={edit}
                onCancel={() => setEdit(false)}
                footer={null}
                maskClosable={false}
            >
                <hr className='mb-4' />
                <div className='grid grid-cols-2 border rounded'>
                    <div className='border-r '>
                        <div className='w-full bg-primary text-white py-3 text-[xl] px-[20px] rounded-s font-medium font-montserrat'>{i18n?.t('Day')}</div>
                        <div className='flex gap-2 py-5 capitalize px-5'>
                        {
                            workoutDetails?.selected_days?.map((day, index) => (
                                <div key={index} className="inline-block">
                                    {day}{index !== workoutDetails.selected_days.length - 1 && ','}
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <div>
                        <div className='w-full bg-primary text-white py-3 text-[xl] px-[20px] rounded-r font-poppins'>{i18n?.t('Workouts')}</div>
                        <div className='flex flex-col gap-5 py-5 capitalize px-5'>
                            {
                                workoutDetails?.workouts?.map((work, index) => (
                                    <div key={index}>
                                        {work?.name[i18n?.langCode]}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Page;
