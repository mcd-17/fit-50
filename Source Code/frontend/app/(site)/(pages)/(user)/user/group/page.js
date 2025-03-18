"use client"
import React from 'react';
import Image from 'next/image';
import { useI18n } from '../../../../../providers/i18n';
import { fetchUserGroup } from '../../../../../helpers/backend';
import { useFetch } from '../../../../../helpers/hooks';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useRouter } from 'next/navigation';
import { Empty } from 'antd'; 

const FitnessGroupsTable = () => {
  const { push } = useRouter();
  const [data, getData] = useFetch(fetchUserGroup);
  const i18n = useI18n();
  const columns = [
    {
      text: i18n?.t("Photo") || "Photo",
      dataField: "image",
      formatter: (_, d) => <Image src={d?.image ? d?.image : "/defaultimg.jpg"} width={50} height={50} alt={d?.name || "image"} className='rounded-full sm:w-[56px] sm:h-[56px] w-[40px] h-[40px]' />,
    },
    {
      text: i18n?.t("Group Name") || "Group Name",
      dataField: "name",
      formatter: (_, d) => <span>{d?.name[i18n?.langCode]}</span>,
    },
    {
      text: i18n?.t("Group Members") || "Group Members",
      dataField: "members",
      formatter: (_, d) => <span>{d?.members.length}</span>,
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <h1 className="profileHeading">{i18n?.t("My Groups")}</h1>
      <hr className='mb-4'/>
      {data?.docs?.length === 0 ? (
        <Empty description="No Data Found" className='mt-12' />
      ) : (
        <TrainerTable
          data={data}
          columns={columns}
          onReload={getData}
          onView={(data) => push(`/user/group/view/${data?._id}`)}
          noHeader
          pagination
        />
      )}
    </div>
  );
}

export default FitnessGroupsTable;