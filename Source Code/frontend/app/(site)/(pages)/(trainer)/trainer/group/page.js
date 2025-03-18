"use client"
import React from 'react';
import Image from 'next/image';
import { useI18n } from '../../../../../providers/i18n';
import { fetchTrainerGroupList } from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useRouter } from 'next/navigation';


const FitnessGroupsTable = () => {
  const { push } = useRouter()
  const [data, getData] = useFetch(fetchTrainerGroupList)
  const i18n = useI18n();
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
    <div className="w-full overflow-x-auto">
      <h1 className="profileHeading ">{i18n?.t("Group List")}</h1>
      <hr className='mb-4' />
      <TrainerTable
        data={data}
        columns={columns}
        onReload={getData}
        onView={(data) => push(`/trainer/group/list/${data?._id}`)}
        noHeader
        pagination
      />
    </div>
  );
}

export default FitnessGroupsTable;