import { Modal } from 'antd';
import React from 'react';
import { useI18n } from '../../../../../providers/i18n';
import { AiOutlineMan, AiOutlineWoman } from "react-icons/ai";
import { FiRuler, FiMonitor, FiUser, FiActivity, FiTrendingUp } from "react-icons/fi";
const ResultCard = ({ title, value, unit, bgColor, i18n }) => (
    <div className={`p-4 rounded-lg shadow-sm ${bgColor} text-center`}>
        <h3 className="font-semibold text-gray-700 text-sm uppercase">{i18n?.t(title)}</h3>
        <p className="text-lg font-bold text-gray-900">{value} {unit && <span className="text-sm text-gray-600">{i18n?.t(unit)}</span>}</p>
    </div>
);

const FitnessModal = ({ open = false, setOpen, data, setDetails }) => {
    const i18n = useI18n();

    return (
        <Modal
            open={open}
            onCancel={() => { setOpen(false); setDetails(null); }}
            destroyOnClose={true}
            footer={null}
            width={650}
            title={<h2 className="text-xl font-semibold text-gray-800">{i18n?.t("Fitness Assessment Report ")}<span className={data?.bmi?.bmi < 18.5 || data?.bmi?.bmi > 30 ? "text-red-500" : data?.bmi?.bmi > 25 ? "text-red-400": "text-green-500"}>({data?.bmi?.bmi_type})</span></h2>}
            className="rounded-lg"
        >
            <div className="space-y-6 p-4">
                <div className="p-5 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">{i18n?.t("Personal Information")}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <ResultCard title="Height" value={`${(data?.height)}`} unit="cm" bgColor="bg-white" i18n={i18n} />
                        <ResultCard title="Weight" value={data?.weight} unit="kg" bgColor="bg-white" i18n={i18n} />
                        <ResultCard title="Age" value={data?.age} unit="years" bgColor="bg-white" i18n={i18n} />
                        <ResultCard title="Gender" value={data?.gender} bgColor="bg-white" i18n={i18n} />
                        <ResultCard title="Exercise Level" value={data?.exercises} bgColor="bg-white" i18n={i18n} />
                    </div>
                </div>

                <div className="p-5 bg-white rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">{i18n?.t("Fitness Metrics")} </h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <ResultCard title="BMI" value={`${data?.bmi?.bmi}`} bgColor="bg-blue-100" i18n={i18n} />
                        <ResultCard title="BMR" value={data?.bmi?.bmr} unit="cal/day" bgColor="bg-green-100" i18n={i18n} />
                        <ResultCard title="Daily Calories" value={data?.bmi?.daily_calories} unit="calories" bgColor="bg-yellow-100" i18n={i18n} />
                        <ResultCard title="Water Intake" value={data?.bmi?.waterIntake} unit="liters/day" bgColor="bg-purple-100" i18n={i18n} />
                    </div>
                </div>

                <div className="p-5 bg-gray-100 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">{i18n?.t("Recommended Macronutrients")}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <ResultCard title="Protein" value={data?.bmi?.recommended_calories?.protein} unit="g" bgColor="bg-white" i18n={i18n} />
                        <ResultCard title="Carbs" value={data?.bmi?.recommended_calories?.carbs} unit="g" bgColor="bg-white" i18n={i18n} />
                        <ResultCard title="Fats" value={data?.bmi?.recommended_calories?.fats} unit="g" bgColor="bg-white" i18n={i18n} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FitnessModal;
