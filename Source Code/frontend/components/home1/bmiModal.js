import { Modal } from 'antd';
import React from 'react';
import { useAction } from '../../app/helpers/hooks';
import { postFitness } from '../../app/helpers/backend';

const ResultCard = ({ title, value, unit, bgColor, i18n }) => (
    <div className={`p-4 rounded ${bgColor}`}>
        <h3 className="font-bold">{i18n?.t(title)}</h3>
        <p>{value} {unit && i18n?.t(unit)}</p>
    </div>
);

const BmiModal = ({ isModalVisible, handleClose, setResults, results, i18n, values, form }) => {
    const onSaveClick = async () => {
        let payload = {
            height: parseFloat(values.height),
            weight: parseFloat(values.weight),
            gender: values.gender,
            age: parseInt(values.age),
            exercises: values.activity,
            bmi: {
                bmi_type: results.category,
                recommended_calories: {
                    protein: results.macros.protein,
                    carbs: results.macros.carbs,
                    fats: results.macros.fats
                },
                bmi: results.bmi,
                bmr: results.bmr,
                daily_calories: results.dailyCalories,
                waterIntake: parseFloat(results.waterIntake)
            }
        };
        useAction(postFitness, payload, () => {
            handleClose();
            form.resetFields();
            setResults(null);
        });
    };

    return (
        <>
            {results && (
                <Modal
                    open={isModalVisible}
                    onCancel={handleClose}
                    className="p-6 max-w-2xl mx-auto"
                    destroyOnClose={true}
                    footer={null}
                    maskClosable={false}
                >
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center">{i18n?.t("Your Fitness Results")}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <ResultCard title="BMI" value={`${results.bmi} (${results.category})`} bgColor="bg-blue-50" i18n={i18n} />
                            <ResultCard title="BMR" value={results.bmr} unit="calories/day" bgColor="bg-green-50" i18n={i18n} />
                            <ResultCard title="Daily Calories" value={results.dailyCalories} unit="calories" bgColor="bg-yellow-50" i18n={i18n} />
                            <ResultCard title="Water Intake" value={results.waterIntake} unit="liters/day" bgColor="bg-purple-50" i18n={i18n} />
                        </div>
                        <div className="p-4 bg-gray-50 rounded">
                            <h3 className="font-bold">{i18n?.t("Recommended Macros")}</h3>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                                <ResultCard title="Protein" value={results.macros.protein} unit="g" i18n={i18n} />
                                <ResultCard title="Carbs" value={results.macros.carbs} unit="g" i18n={i18n} />
                                <ResultCard title="Fats" value={results.macros.fats} unit="g" i18n={i18n} />
                            </div>
                        </div>
                        <button onClick={onSaveClick} className="bg-primary text-white font-bold py-2 px-4 rounded">{i18n?.t("Save")}</button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default BmiModal;