
import dayjs from 'dayjs';
import React from 'react';


const AttendanceTable = ({ data }) => {
   
    return (
        <div>
            {data?.docs?.map((d) => (
                <div
                    key={d?._id}
                    className='mb-2 rounded-md border-b p-2 hover:bg-gray-50'
                >
                    <div className='flex itmes-center gap-4'>
                        <div>
                            <span className='whitespace-pre text-[14px] font-medium capitalize text-gray-700'>
                                {d?.employee?.name}
                            </span>
                            <span className='block whitespace-pre capitalize text-gray-500'>
                                {d?.clockIn && d?.clockOut
                                    ? `Out - ${dayjs(d?.clockOut).format('hh:mm A')}`
                                    : `In - ${dayjs(d?.clockIn).format('hh:mm A')}`}
                            </span>
                        </div>
                        <div>
                            <span className='flex items-center justify-center'>
                                {/* {(d?.clockOut && d?.clockIn) ||
                                    <MdOutlinePlayCircleFilled
                                        // onClick={() => handlePunch(d)}
                                        size={23}
                                        className='cursor-pointer rounded-full text-green-600 shadow-md hover:shadow-lg'
                                        title='Punch In'
                                    />
                               } */}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AttendanceTable;