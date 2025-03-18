'use client'
import { useRouter } from "next/navigation";
import { RiAddCircleLine } from "react-icons/ri";
import { useFetch } from "../../../../../helpers/hooks";
import { delNutrition, fetchNutrition, } from "../../../../../helpers/backend";
import { useI18n } from "../../../../../providers/i18n";
import TrainerTable from "../../../../../../components/form/trainerTable";
import dayjs from "dayjs";
import { Avatar } from "antd";
import Button from "../../../../../../components/common/button";
const page = () => {
  const router = useRouter();
  const [data, getData] = useFetch(fetchNutrition)
  const i18n = useI18n();
  const { langCode } = useI18n();

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
      formatter: (_, d) => <span>{d?.group?.name[langCode] || "N/A"}</span>,
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
        <h3 className='profileHeading'>{i18n?.t("Nutrition Schedule")}</h3>
        <Button
          onClick={() => router.push('/trainer/nutrition-schedule/add-nutrition')}
          type="submit"
          className="!py-3 !h-fit  flex items-center gap-[10px]"
        >
          <RiAddCircleLine />
          {i18n?.t("Add Nutrition")}
        </Button>
      </div>
      <hr className='mb-4' />
      
      <div className="w-full overflow-x-auto">
        <TrainerTable
          data={data}
          columns={columns}
          onReload={getData}
          pagination
          onEdit={(data) => router.push(`/trainer/nutrition-schedule/edit/${data?._id}`)}
          onView={(data) => router.push(`/trainer/nutrition-schedule/view/${data?._id}`)}
          onDelete={delNutrition}
          noHeader
        />
      </div>
    </div>
  )
}

export default page
