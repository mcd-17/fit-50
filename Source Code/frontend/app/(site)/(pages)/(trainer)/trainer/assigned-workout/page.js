'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { useFetch } from '../../../../../helpers/hooks';
import { delTrainerWorkout, fetchTrainerWorkout } from '../../../../../helpers/backend';
import TrainerTable from '../../../../../../components/form/trainerTable';
import { useI18n } from '../../../../../providers/i18n';
import { columnFormatter } from '../../../../../helpers/utils';
import dayjs from 'dayjs';
import { Avatar } from 'antd';
import Button from '../../../../../../components/common/button';

const AssignedWorkout = () => {
  const [data, getData, { loading }] = useFetch(fetchTrainerWorkout);
  const i18n = useI18n();
  const router = useRouter();

  const columns = [
    {
      text: i18n?.t("Start Date"),
      dataField: "start_date",
      formatter: (_, d) => <span>{dayjs(d?.start_date).format('DD/MM/YYYY')}</span>,
    },
    {
      text: i18n?.t("End Date"),
      dataField: "end_date",
      formatter: (_, d) => <span>{dayjs(d?.end_date).format('DD/MM/YYYY')}</span>,
    },
    {
      text: i18n?.t("Group"),
      dataField: "groups",
      formatter: (_, d) => <span>{d?.group?.name[i18n?.langCode] || "-"}</span>,
    },
    {
      text: i18n?.t("Members"),
      dataField: "members",
      formatter: (_, d) => <span>{
        d?.members &&
        (
          <Avatar.Group max={3}>
            {
              d?.members?.slice(0, 3)?.map((item, index) => (
                <div key={index} className="flex space-x-1">
                  <Avatar src={item?.image ? item?.image : "/defaultimg.jpg"} />
                </div>
              ))
            }
          </Avatar.Group>
        )

      }</span>,
    },

  ];

  return (

    <div className="">
      <div className='flex justify-between'>
        <h3 className='profileHeading' >{i18n?.t("Assigned workout")}</h3>
        <Button
          onClick={() => router.push('/trainer/assigned-workout/add')}
          className="!h-fit !py-2"
        >
          {i18n?.t("Add workout")}
        </Button>
      </div>
      <hr className='mb-4'/>
      <div className="w-full overflow-x-auto">
        <TrainerTable
          data={data}
          columns={columns}
          onReload={getData}
          pagination
          onEdit={(data) => router.push(`/trainer/assigned-workout/edit/${data?._id}`)}
          onView={(data) => router.push(`/trainer/assigned-workout/view/${data?._id}`)}
          onDelete={delTrainerWorkout}
          noHeader
        />
      </div>
    </div>

  )
}

export default AssignedWorkout
