"use client";
import React from 'react';
import { FaUsers, FaBell } from 'react-icons/fa';
import Image from 'next/image';
import { FaPeopleGroup } from 'react-icons/fa6';
import { fetchGroupList, fetchTrainerGroupList, fetchTrainerNotice } from '../../../../helpers/backend';
import { useFetch } from '../../../../helpers/hooks';
import TrainerTable from '../../../../../components/form/trainerTable';
import { useI18n } from '../../../../providers/i18n';
import { useRouter } from 'next/navigation';

const TrainerDashboard = () => {
  const [data, getData] = useFetch(fetchTrainerGroupList)
  const [notice] = useFetch(fetchTrainerNotice);
  const i18n = useI18n();
  const { push } = useRouter();
  const columns = [
    {
      text: i18n?.t("Photo"),
      dataField: "image",
      formatter: (_, d) => <Image src={d?.image ? d?.image : "/defaultimg.jpg"} width={50} height={50} alt={d?.name || "image"} className='rounded-full sm:w-[56px] sm:h-[56px] w-[40px] h-[40px]' />,
    },
    {
      text: i18n?.t("Group Name"),
      dataField: "name",
      formatter: (_, d) => <span>{d?.name[i18n?.langCode]}</span>,
    },
    {
      text: i18n?.t("Group Members"),
      dataField: "members",
      formatter: (_, d) => <span>{d?.members?.length}</span>,
    },

  ];
  return (
    <>
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 mb-8">
          <div className=" bg-white group p-6 rounded-lg  shadow-lg">
            <div className="flex gap-6 items-center">
              <div className="p-2 rounded-full bg-primary "><FaPeopleGroup className="text-4xl text-white " /></div>
              <h2 className="text-[18px]  text-textMain font-semibold">{i18n?.t("Groups")}</h2>
            </div>
            <div className="flex justify-end md:mt-[18px]">
              <p className="text-[28px] font-semibold leading-[42px]  text-textMain">{data?.docs?.length || 0}</p>
            </div>
          </div>
          <div className=" bg-white group p-6 rounded-lg  shadow-lg">
            <div className="flex gap-6 items-center">
              <div className="p-2 rounded-full bg-primary "><FaBell className="text-4xl text-white " /></div>
              <h2 className="text-[18px] e text-textMain font-semibold">{i18n?.t("Notice")}</h2>
            </div>
            <div className="flex justify-end md:mt-[18px]">
              <p className="text-[28px] font-semibold leading-[42px]  text-textMain">{notice?.docs?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white  rounded-lg shadow-lg w-full">
          <h2 className="text-lg font-semibold bg-primary text-white p-4 rounded-t-lg">{i18n?.t("Group List")}</h2>
          <TrainerTable
            data={data}
            columns={columns}
            onReload={getData}
            onView={(data) => push(`/trainer/group/list/${data?._id}`)}
            noHeader
            pagination
          />
        </div>
      </div>
    </>
  );
};

export default TrainerDashboard;
