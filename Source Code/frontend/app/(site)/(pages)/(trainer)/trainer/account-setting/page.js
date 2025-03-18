'use client';
import { Form } from 'antd';
import React, { useEffect } from 'react';
import { useUser } from '../../../../../contexts/user';
import FormInput, { HiddenInput } from '../../../../../../components/form/input';
import FormSelect from '../../../../../../components/form/select';
import { useAction } from '../../../../../helpers/hooks';
import { userProfileUpdate } from '../../../../../helpers/backend';
import FormDatePicker from '../../../../../../components/form/date_picker';
import dayjs from 'dayjs';
import { useI18n } from '../../../../../providers/i18n';
import { FaPlusCircle } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from '../../../../../../components/common/button';
import MultipleImageInput from '../../../../../../components/form/multiImage';

const AccountSettings = () => {
  const [form] = Form.useForm();
  const { user, getUser } = useUser();
  const i18n = useI18n();

  useEffect(() => {
    form.setFieldsValue({
      ...user,
      dob: user?.dob ? dayjs(user?.dob) : null,
      skills: user?.skills || [],
      image: user?.image
        ? [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: user?.image,
          },
        ]
        : '',
    });
  }, [user?._id]);

  return (
    <>
      <h1 className='profileHeading'>{i18n?.t('Profile')}</h1>
      <hr />
      <Form
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          let payload = {
            ...values,
            image: values?.image?.[0]?.originFileObj,
            skills: JSON.stringify(values?.skills?.map((skill) => ({ name: skill?.name, level: skill?.level }))),
            dob: values?.dob ? dayjs(values?.dob).format('YYYY-MM-DD') : null,
          };

          return await useAction(userProfileUpdate, payload, () => {
            getUser();
          });
        }}
      >
        <div className='flex flex-col user-phone'>
          <h2 className='text-[18px] font-medium mt-4 uppercase font-poppins mb-[25px] text-[#2b2b2b]'>
            {i18n?.t('personal info')}
          </h2>
          <HiddenInput name="_id" />
          <MultipleImageInput name="image" label={i18n?.t('Image')} />
          <div className='mt-2 flex flex-col gap-3'>
            <FormInput name="name" label="Name" />
            <FormInput name="email" label="Email" isEmail readOnly />
            <FormInput name="address" label="Address" />
            <FormInput name="phone" label="Phone Number" />
            <FormInput textArea={true} name="short_bio" label={i18n?.t('Short Bio')} rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {

                  if (value?.length > 200) {
                    return Promise.reject(i18n?.t('Short Bio should be less than 200 characters'));

                  }
                  return Promise.resolve();
                }
              })
            ]} />
            <FormInput textArea={true} name="about" label="About" />
            <FormDatePicker name="dob" label={i18n?.t('Date of Birth')} />
            <FormSelect
              name="gender"
              label={i18n?.t('Gender')}
              initialValue="Male"
              options={[
                { label: i18n?.t('Male'), value: 'Male' },
                { label: i18n?.t('Female'), value: 'Female' },
              ]}
            />
            <FormInput name="experience" label={i18n?.t('Experience')} />
            <FormInput name="occupation" label={i18n?.t('Occupation')} />
            <Form.List name="skills" initialValue={[{ name: '', level: 0 }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ name }, index) => (
                    <div key={index} className="flex  gap-3 ">
                      <div className='grid sm:grid-cols-2 grid-cols-1 gap-4  w-full'>
                        <FormInput className="" name={[name, 'name']} label={i18n?.t('Name')} />
                        <FormInput className="" type="number" name={[name, 'level']} label={i18n?.t('Level')} />
                      </div>
                      {fields.length > 1 && (
                        <div onClick={() => {
                          remove(index)
                        }} className=' group w-[30px] flex items-center relative top-[14px] '>
                          <Button className='border rounded-full w-[40px] h-[35px] '>
                            <RiDeleteBin6Line className="text-primary group-hover:text-white duration-500 text-xl relative -top-[1px] right-[8px] " />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {
                    fields.length < 4 && <div
                      className="bg-slate-500 text-white flex items-center justify-start gap-2 px-3 py-2 ml-auto rounded-full w-fit cursor-pointer"
                      onClick={() => add()}
                    >
                      <FaPlusCircle /> {i18n?.t("Add field")}
                    </div>
                  }
                </>
              )}
            </Form.List>
          </div>
          <div>
            <h2 className='text-[18px] font-medium capitalize lg:my-4 sm:mt-[40px]'>
              {i18n?.t('Social Media')}
            </h2>
            <div className='mt-2 flex flex-col gap-3'>
              <FormInput name="facebook" label="Facebook" />
              <FormInput name="twitter" label="Twitter" />
              <FormInput name="linkedin" label="Linkedin" />
              <FormInput name="instagram" label="Instagram" />
            </div>
          </div>
          <Button
            type="submit"
            className="rounded mt-5 bg-primary text-[16px] capitalize duration-300 font-medium text-white px-[30px] py-3"
          >
            {i18n?.t('Save Change')}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AccountSettings;
