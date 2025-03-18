"use client"
import { Modal, Tooltip } from 'antd'
import BannerTitle from '../../../../../components/common/banner-title';
import { useFetch } from '../../../../helpers/hooks';
import { fetchShedule } from '../../../../helpers/backend';
import { useI18n } from '../../../../providers/i18n';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ClassRoutine = () => {
  const [schedule] = useFetch(fetchShedule)
  const [trainer, setTrainer] = useState(null)
  const [open, setOpen] = useState(false)
  const i18n = useI18n()
  const { langCode } = useI18n()
  const { push } = useRouter();

  const staticTimes = [
    '9:00 am', '10:00 am', '11:00 am', '12:00 pm', '1:00 pm',
    '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm',
    '7:00 pm', '8:00 pm'
  ]

  const findScheduleByTime = (time, day) => {
    const found = schedule?.find(sch => sch.time === time)
    const title = found?.[day]?.event[langCode] || '-'
    const trainer = found?.[day]?.trainer?.name || ''
    const data = found?.[day]?.trainer || ''
    return { title, trainer, data }
  }

  return (
    <div className="container w-full overflow-x-hidden">
      <BannerTitle className={"items-center"} title={i18n?.t("Our Schedule")} subtitle={i18n?.t("Class Schedule")} />
      <div className="overflow-x-auto mt-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f0f0f0] text-[#827F7F] text-lg">
              <th className="font-medium p-4">Time</th>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <th key={day} className="font-medium p-4">{i18n?.t(day)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staticTimes.map((time, index) => (
              <tr key={index}>
                <td className="border lg:py-6 py-4 px-3 sm:px-4 bg-primary text-white font-medium text-sm whitespace-pre">{time}</td>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const { title, trainer, data } = findScheduleByTime(time, day)
                  return (
                    <td className="group text-center border overflow-hidden relative" key={day} onClick={() => { setTrainer(data); setOpen(true) }}>
                      <div className='transition-transform cursor-pointer duration-500 ease-in-out transform group-hover:translate-y-0 translate-y-[200px] bg-primary text-white w-full h-full absolute top-0 left-0 py-4'>
                        {title.length > 20 ? (
                          <Tooltip className='cursor-pointer' title={i18n?.t(title)}>
                            <h4 className="scheduleTableTitle text-center">{i18n?.t(title.substring(0, 20) + '...')}</h4>
                          </Tooltip>
                        ) : (
                          <h4 className="scheduleTableTitle text-center">{i18n?.t(title)}</h4>
                        )}
                        {trainer && <p className="text-sm font-poppins capitalize leading-[22px]">{i18n?.t(trainer)}</p>}
                      </div>
                      <div className='py-4 cursor-pointer' >
                        {title.length > 20 ? (
                          <Tooltip className='cursor-pointer' title={i18n?.t(title)}>
                            <h4 className="scheduleTableTitle text-center">{i18n?.t(title.substring(0, 20) + '...')}</h4>
                          </Tooltip>
                        ) : (
                          <h4 className="scheduleTableTitle text-center">{i18n?.t(title)}</h4>
                        )}
                        {trainer && <p className="text-sm font-poppins capitalize leading-[22px]">{i18n?.t(trainer)}</p>}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closable={false}
        width={300}
        className='trainerModal'
      >
        <div className='relative bg-white rounded-t-[40px] rounded-[20px] overflow-hidden'>
          <div className='w-full h-[100px] bg-primary  flex items-center justify-center'>
            <div className='z-20 rounded-full w-[100px] h-[100px] overflow-hidden relative top-[50%] bg-white'>
              <Image src={trainer?.image ? trainer?.image : "/defaultimg.jpg"} alt={trainer?.name} width={600} height={400} className='object-cover rounded-full w-full h-full' />
            </div>
          </div>
          <div className='mt-16 px-5'>
            <div className='flex flex-col gap-1'>
              <h1 className='capitalize text-textMain font-medium text-base'>{i18n?.t("Name")}: {trainer?.name ? trainer?.name : 'N/A'}</h1>
              <h1 className='capitalize text-textMain font-medium text-base'>{i18n?.t("Email")}: {trainer?.email ? trainer?.email : 'N/A'}</h1>
              <h1 className='capitalize text-textMain font-medium text-base'>{i18n?.t("experience")}: {trainer?.experience ? trainer?.experience : 'N/A'}</h1>
            </div>
            <p className='text-textMain font-normal text-sm line-clamp-4 mt-6'>{trainer?.about}</p>
          </div>
          <button className='w-full mt-6 cursor-pointer text-lg font-semibold py-3 bg-primary/90 text-white hover:bg-primary '  onClick={() => push(`/trainers/view/${trainer?._id}`)}>{i18n?.t('View Details')} </button>
        </div>
      </Modal>
    </div>
  );
}

export default ClassRoutine;
