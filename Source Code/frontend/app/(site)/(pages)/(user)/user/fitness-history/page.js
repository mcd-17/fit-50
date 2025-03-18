"use client"
import React, { useState } from 'react';
import { useI18n } from '../../../../../providers/i18n';
import dayjs from 'dayjs';
import { useFetch } from '../../../../../helpers/hooks';
import { deleteFitness, fitnessHistory } from '../../../../../helpers/backend';
import TrainerTable from '../../../../../../components/form/trainerTable';
import Link from 'next/link';
import FitnessModal from './fitnessModal';

const page = () => {
    const i18n = useI18n();
    const [data, getData, { loading }] = useFetch(fitnessHistory)
    const [details, setDetails] = useState(null)
    const [open, setOpen] = useState(false)

    const columns = [
        {
            text: ("Date") || "Date",
            dataField: "name",
            formatter: (_, d) => <p>{dayjs(d?.createdAt).format("DD MMM YYYY")}</p>,
        },
        {
            text: ("Height") || "Height",
            dataField: "height",
            formatter: (_, d) => <p>{d?.height} CM</p>,
        },
        {
            text: ("Weight") || "Weight",
            dataField: "weight",
            formatter: (_, d) => <p>{d?.weight} KG</p>,
        },
        {
            text: ("Age") || "Age",
            dataField: "age",
            formatter: (_, d) => <p>{d?.age} Years</p>,
        },
        {
            text: ("Gender") || "Gender",
            dataField: "gender",
            formatter: (_, d) => <p>{d?.gender}</p>,
        },
        {
            text: ("BMI") || "BMI",
            dataField: "bmi.bmi",
            formatter: (_, d) => <p className='w-fit'>{d?.bmi?.bmi}</p>,
        },
        {
            text: ("BMI Category") || "BMI Category",
            dataField: "bmi.bmi_type",
            formatter: (_, d) => <p className='w-fit'>{d?.bmi?.bmi_type}</p>,
        },

    ];
    const handleView = (values) => {
        setDetails(values)
        setOpen(true)
    }
    return (
        <div className="px-4 py-8 overflow-x-auto">
            <div>
                <div className='flex gap-2 justify-between items-center mb-4'>
                    <h1 className='profileHeading'>{i18n?.t("Fitness History")}</h1>
                    <Link href={"/bmi-calculator"} className='bg-primary text-white p-2 rounded'>{i18n?.t("Check Fitness")}</Link>
                </div>
            </div>
            <hr className='mb-4 ' />
            <div className='hide-scrollbar'>
                <TrainerTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    onReload={getData}
                    onView={handleView}
                    indexed
                    pagination
                    langCode={i18n?.langCode}
                    onDelete={deleteFitness}
                    noHeader
                />
            </div>
            <FitnessModal open={open} setOpen={setOpen} data={details} setDetails={setDetails} />
        </div>
    );
};

export default page;