'use client';

import { useEffect, useState } from "react";
import BasicBar from "../../../../components/common/basic-bar";
import { fetchFaq } from "../../../helpers/backend";
import { useFetch } from "../../../helpers/hooks";
import { useI18n } from "../../../providers/i18n";
import { Collapse } from 'antd';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Image from "next/image";

const Page = () => {
  const i18n = useI18n();
  const [data, getData, { loading }] = useFetch(fetchFaq);
  const [activePanel, setActivePanel] = useState(null); 

  const handlePanelChange = (key) => {
    setActivePanel(key); 
  };

  return (
    <div>
      <BasicBar heading={i18n?.t('FAQ')} subHeading={i18n?.t('FAQ')} />
      <div className="container lg:py-[140px] sm:py-[100px] py-[50px] mx-auto">
      <h1 className='shop-heading'>{i18n?.t('Frequently Asked Questions')}</h1>
      <p className="para1 lg:w-[648px]">
        Find answers to common questions about our gym facilities, membership options, personal training, and more. Learn how we help you achieve your fitness goals with ease and flexibility.
      </p>
        <div className="mt-16">
          
          <div className="">
            <Collapse
              accordion
              onChange={handlePanelChange}
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <RiArrowDropDownLine
                  style={{
                    fontSize: '30px',
                    color: isActive ? '#E67529' : 'black',
                    transform: `rotate(${isActive ? 180 : 0}deg)`,
                    transition: 'transform 0.5s ease',
                  }}
                />
              )}
            >
              {data?.docs?.map((item) => (
                <Collapse.Panel
                  key={item?._id}
                  header={
                    <span className={`sm:text-xl !text-base font-semibold ${activePanel == item?._id ? '!text-primary' : '!text-textMain'}`}>
                      {item?.question[i18n.langCode]}
                    </span>
                  }
                  className="mb-6 py-2 px-1 lg:px-4 !border rounded"
                >
                  <p className="text-textMain/80">{item?.answer[i18n.langCode]}</p>
                </Collapse.Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
