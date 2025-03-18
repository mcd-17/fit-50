'use client';
import React, { useState } from 'react';
import { Form, DatePicker, Checkbox, Input, Typography, Radio, notification } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useAction, useFetch } from '../../../../../../helpers/hooks';
import { addNutrition, fetchMembers, fetchTrainerGroupList } from '../../../../../../helpers/backend';
import { useI18n } from '../../../../../../providers/i18n';
import FormSelect from '../../../../../../../components/form/select';
import Button from '../../../../../../../components/common/button';


const { Title } = Typography;

const CustomCheckbox = ({ label, ...props }) => (
  <Checkbox {...props}>
    <span className="text-sm font-medium">{label}</span>
  </Checkbox>
);

export default function NutritionSchedule() {
  const router = useRouter()
  const [selectedMeals, setSelectedMeals] = useState([{ type: 'Breakfast', description: '' }]);
  const [selectedTypes, setSelectedTypes] = useState(['Breakfast']);
  const [selectedDays, setSelectedDays] = useState([]);
  const [groupList, getGroupList] = useFetch(fetchTrainerGroupList);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [members, getMembers] = useFetch(fetchMembers, {}, false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [form] = Form.useForm();
  const i18n = useI18n();
  const [selectedRadio, setSelectedRadio] = useState(1);

  const handleTypeSelection = (checkedValues) => {
    setSelectedTypes(checkedValues);
    const updatedMeals = checkedValues.map((type) => {
      const existingMeal = selectedMeals.find(meal => meal.type === type);
      return existingMeal || { type, description: '' };
    });
    setSelectedMeals(updatedMeals);
  };

  const handleDescriptionChange = (type, value) => {
    setSelectedMeals((meals) =>
      meals.map((meal) =>
        meal.type === type ? { ...meal, description: value } : meal
      )
    );
  };

  const onFinish = (values) => {
    if (selectedDays.length === 0) {
      notification.error({ message: 'Please select days' });
      return;
    }
    if (selectedMeals.length === 0) {
      notification.error({ message: 'Please select meals' });
      return;
    }
    const payload = {
      start_date: dayjs(values.start_date).format('YYYY-MM-DD'),
      end_date: dayjs(values.end_date).format('YYYY-MM-DD'),
      group: selectedGroup,
      selected_days: selectedDays.map((day) => day.toLowerCase()),
      nutrition: selectedMeals.map((meal) => ({
        type: meal.type,
        description: meal.description,
      })),
    };
    const payload2 = {
      start_date: dayjs(values.start_date).format('YYYY-MM-DD'),
      end_date: dayjs(values.end_date).format('YYYY-MM-DD'),
      members: values.members,
      selected_days: selectedDays.map((day) => day.toLowerCase()),
      nutrition: selectedMeals.map((meal) => ({
        type: meal.type,
        description: meal.description,
      })),
    };
    useAction(addNutrition, selectedRadio === 2 ? payload2 : payload, () => {
      getGroupList();
      router.push("/trainer/nutrition-schedule");
    });
  };

  const handleGroupChange = (value) => {
    if (selectedRadio == 2) {
      getMembers({ _id: value })
    }
    const selected = groupList?.docs?.find(group => group._id === value);
    setSelectedGroup(selected ? selected._id : null);

  };

  const handleRadioChange = (e) => {
    form.resetFields();
    setSelectedRadio(e.target.value);
    if (e.target.value === 1) {
      setSelectedMembers([]);
    } else {
      setSelectedGroup(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }} className='text-titlex'>{i18n?.t('Add Nutrition Schedule')}</Title>
      </div>
      <Form form={form} layout="vertical" className="w-full space-y-6 selector-width mt-4" onFinish={onFinish}>
        <div className="w-full sm:flex gap-6">
          <Radio.Group onChange={handleRadioChange} value={selectedRadio}>
            <Radio value={1}>{i18n?.t('Group')}</Radio>
            <Radio value={2}>{i18n?.t('Member')}</Radio>
          </Radio.Group>
        </div>
        <div className={`grid ${selectedRadio === 1 ? 'grid-cols-1' : 'md:grid-cols-2'} grid-cols-1 lg:gap-4 gap-2`}>
          <FormSelect
            name="group"
            label="Group"
            options={groupList?.docs?.map(group => ({
              label: group?.name[i18n?.langCode],
              value: group?._id,
            }))}
            placeholder="Select group"
            onChange={handleGroupChange}
          />
          {selectedRadio === 2 && (
            <div className='multiselect'>

              <FormSelect
                name="members"
                label="Members"
                multi={true}
                options={members?.docs[0]?.members?.map(m => ({
                  label: m?.name,
                  value: m?._id,
                }))}
                placeholder="Please select group first to add members"
                className='!overflow-auto'
              />
            </div>
          )}
        </div>

        <div className='grid md:grid-cols-2 grid-cols-1 lg:gap-4 gap-2'>
          <Form.Item name="start_date" label={i18n?.t('Start Date')} rules={[{ required: true, message: i18n?.t('Please select start date') }]}>
            <DatePicker
              className="border pt-2 pb-[11px] rounded w-full"
              suffixIcon={<CalendarOutlined />}
              placeholder={i18n?.t("Select date")}
            />
          </Form.Item>
          <Form.Item name="end_date" label={i18n?.t('End Date')} rules={[{ required: true, message: i18n?.t('Please select end date') }]}>
            <DatePicker
              className="border pt-2 pb-[11px] rounded w-full"
              suffixIcon={<CalendarOutlined />}
              placeholder={i18n?.t("Select date")}
            />
          </Form.Item>
        </div>

        <div className="w-full border">
          <div className="bg-primary text-white p-3 rounded-t mb-4">
            <h3 className="text-lg font-semibold">{i18n?.t('Select Day')}</h3>
          </div>
          <div className="md:flex gap-8 p-6">
            <div className="w-1/2">
              <Checkbox.Group
                name="selected_days"
                value={selectedDays}
                onChange={(checkedValues) => setSelectedDays(checkedValues || [])}
              >
                {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                  <div key={day} className="flex items-center mb-2">
                    <Checkbox value={day} />
                    <span className="ml-2 text-titlex">{i18n?.t(day)}</span>
                  </div>
                ))}
              </Checkbox.Group>
            </div>
            <div className="w-1/2">
              <Checkbox.Group name="nutrition" value={selectedTypes} onChange={handleTypeSelection}>
                {['Breakfast', 'Mid Morning Snacks', 'Lunch', 'Afternoon Snacks', 'Dinner'].map((meal, index) => (
                  <div key={index} className="flex flex-col mb-2">
                    <CustomCheckbox value={meal} label={i18n?.t(meal)} />
                    {selectedTypes.includes(meal) && (
                      <Input
                        className="mt-2"
                        placeholder={`${i18n?.t('Description for')} ${i18n?.t(meal)}`}
                        onChange={(e) => handleDescriptionChange(meal, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </Checkbox.Group>
            </div>
          </div>
        </div>

        <div className="flex justify-start my-[25px]">
          <Button type="submit" className="rounded bg-white hover:bg-primary text-black duration-300 hover:text-white text-[16px] capitalize">
            {i18n?.t('Save Changes')}
          </Button>
        </div>
      </Form>
    </div>
  );
}
