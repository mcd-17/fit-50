'use client';
import React, { useState } from 'react';
import { Form } from 'antd';
import BannerTitle from '../common/banner-title';
import { useI18n } from '../../app/providers/i18n';
import { motion } from 'framer-motion';
import BmiModal from './bmiModal';
import BmiForm from './bmiForm';
import { useCurrency } from '../../app/contexts/site';
import { usePathname } from 'next/navigation';
const FitnessCalculator = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [results, setResults] = useState(null);
    const [form] = Form.useForm();
    const i18n = useI18n();
    const { findDefaultTheme } = useCurrency()
    const pathName = usePathname()
    const [values2,setValues2] = useState({})

    const calculateBMI = ({ weight, height }) =>
        parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));

    const calculateBMR = (weight, height, age, gender) => {
        if (gender === 'Male') {
            return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        }
        return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    };

    const calculateCalories = (bmr, activity) => {
        const activityFactors = {
            'Little to no exercise': 1.2,
            'Light exercise 1-3 days/week': 1.375,
            'Moderate exercise 3-5 days/week': 1.55,
            'Hard exercise 6-7 days/week': 1.725,
            'Intense exercise or physical job': 1.9,
        };
        return bmr * activityFactors[activity];
    };

    const calculateMacros = (calories) => ({
        protein: Math.round((calories * 0.3) / 4),
        carbs: Math.round((calories * 0.5) / 4),
        fats: Math.round((calories * 0.2) / 9),
    });

    const calculateWaterIntake = (weight) => (weight * 0.033).toFixed(2);

    const onFinish = (values) => {
        setValues2(values)
        const bmi = calculateBMI(values);
        const bmr = calculateBMR(values.weight, values.height, values.age, values.gender);
        const dailyCalories = calculateCalories(bmr, values.activity);
        const macros = calculateMacros(dailyCalories);
        const waterIntake = calculateWaterIntake(values.weight);
        setResults({
            bmi,
            bmr: Math.round(bmr),
            dailyCalories: Math.round(dailyCalories),
            macros,
            waterIntake,
            category: getBMICategory(bmi),
        });
        setIsModalVisible(true);
        // form.resetFields();
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi >= 18.5 && bmi <= 24.9) return 'Healthy';
        if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
        return 'Obese';
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const leftToRightVariant = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
    };

    const rightToLeftVariant = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        position: 'absolute',
    };

    return (
        <section className='container overflow-x-hidden '>
            <div className='lg:grid grid-cols-1 lg:gap-20 gap-10 lg:grid-cols-2 flex flex-col-reverse'>
                <motion.div
                    // initial='hidden'
                    // whileInView='visible'
                    // viewport={{ amount: 0.3 }}
                    // variants={leftToRightVariant}
                    // transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`mt-0 h-fit rounded-lg border px-5 lg:my-8 ${findDefaultTheme?.name === 'home3' && pathName === "/" ? '!bg-black' : '!bg-white'}`}
                >
                    <div>
                        <h1
                            className={`blogtittle my-5 md:my-10 ${findDefaultTheme?.name === 'home3' && pathName === "/" ? 'text-white' : 'text-textMain'}`}
                        >
                            {i18n?.t('BMI & Fitness Chart')}
                        </h1>
                    </div>
                    <div>
                        <table className='w-full border-collapse'>
                            <thead className=''>
                                <tr className='!rounded-lg border p-4 font-poppins'>
                                    <th
                                        className={`fetureHeading border-r px-4 py-[23.5px] text-left ${findDefaultTheme?.name === 'home3' && pathName === "/" ? 'text-white' : 'text-textMain'}`}
                                    >
                                        {i18n?.t('BMI')}
                                    </th>
                                    <th
                                        className={`fetureHeading px-4 py-[23.5px] text-left ${findDefaultTheme?.name === 'home3' && pathName === "/" ? 'text-white' : 'text-textMain'}`}
                                    >
                                        {i18n?.t('Category')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        range: i18n?.t('Below 18.5'),
                                        status: i18n?.t('Underweight'),
                                    },
                                    { range: i18n?.t('18.5 - 24.9'), status: i18n?.t('Healthy') },
                                    {
                                        range: i18n?.t('25.0 - 29.9'),
                                        status: i18n?.t('Overweight'),
                                    },
                                    { range: i18n?.t('30.0 - Above'), status: i18n?.t('Obese') },
                                ].map(({ range, status }, idx) => (
                                    <tr
                                        key={idx}
                                        className={`border font-poppins ${findDefaultTheme?.name === 'home3' && pathName === "/" ? 'text-white' : 'text-textMain'}`}
                                    >
                                        <td className='border-r px-4 py-[20.5px]'>{range}</td>
                                        <td className='px-4 py-[20.5px]'>{status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3
                        className={`my-10 font-poppins capitalize ${findDefaultTheme?.name === 'home3' && pathName === "/" ? 'text-white' : 'text-textMain'}`}
                    >
                        <span className='font-semibold !text-primary'>{i18n?.t('BMR')}</span>{' '}
                        {i18n?.t('metabolic rate')} /{' '}
                        <span className='font-semibold !text-primary'>{i18n?.t('BMI')} </span>
                        {i18n?.t('body mass index')}
                    </h3>
                </motion.div>
                <motion.div
                    // position='absolute'
                    // initial='hidden'
                    // whileInView='visible'
                    // viewport={{ amount: 0.3 }}
                    // variants={rightToLeftVariant}
                    // transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`rounded-lg ${findDefaultTheme?.name === 'home3' && pathName === "/" ? '!bg-black' : '!bg-white'}`}
                >
                    <BannerTitle
                        home3={findDefaultTheme?.name === "home3" && pathName === "/" ? true : false}
                        subtitle={i18n?.t('fitness')}
                        title={i18n?.t('Fitness Calculation')}
                        className={'items-start'}
                    />
                    <p
                        className={`description mb-4 mt-2 line-clamp-3 lg:my-10 ${findDefaultTheme?.name === 'home3' && pathName === "/" ? '!text-white' : '!text-[#534c4c]'}`}
                    >
                        {i18n?.t(
                            "Use our BMI calculator to quickly assess if you're at a healthy weight based on your height and weight. Track your progress and stay on the path to better health."
                        )}
                    </p>
                    <BmiForm
                        isHome3={pathName === "/" ? true : false}
                        i18n={i18n}
                        pathName={findDefaultTheme}
                        onFinish={onFinish}
                        form={form}
                    />
                </motion.div>
            </div>
            <BmiModal
                results={results}
                i18n={i18n}
                isModalVisible={isModalVisible}
                handleClose={handleClose}
                values={values2}
                form={form}
                setResults={setResults}
            />
        </section>
    );
};

export default FitnessCalculator;
