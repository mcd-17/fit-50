'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Drawer, Select, Button, Spin, notification } from 'antd';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useFetch } from '../../../../helpers/hooks';
import {
    checkInStatus,
    fetchAttendances,
    fetchAttendanceSettings,
    postCheckIn,
    postCheckOut,
} from '../../../../helpers/backend';
import { useUser } from '../../../../contexts/user';
import Image from 'next/image';
import LiveCounter from './timeCounter';
import { InfinitySpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';

const { Option } = Select;

dayjs.extend(duration);

const NoticeCalendar = ({ _id = null }) => {
    const [setting] = useFetch(fetchAttendanceSettings)
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
    const [attendance, getAttendance, { loading }] = useFetch(fetchAttendances, {}, false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [loadingClockIn, setLoadingClockIn] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(dayjs());
    const [checkInOutStatus, getStatus] = useFetch(checkInStatus);
    const { user } = useUser();
    const router = useRouter();

    // useEffect(() => {
    //     const weekend = setting?.weekend
    //     setWeekends(weekend)
    // }, []);

    useEffect(() => {
        getAttendance({
            year: selectedYear,
            month: selectedMonth,
        });
    }, [selectedYear, selectedMonth]);

    useEffect(() => {
        getAttendance({
            year: selectedYear,
            month: selectedMonth,
            _id: _id,
        });
    }, [_id]);

    useEffect(() => {
        setAttendanceData(attendance?.docs);
    }, [attendance?.docs]);

    const isWeekend = (date) => {
        return setting?.weekend.includes(date.day());
    };

    const getAttendanceStatus = (date) => {
        const dateString = dayjs(date).format('YYYY-MM-DD');
        const attendance = attendanceData?.find(
            (att) => dayjs(att?.date).format('YYYY-MM-DD') === dateString
        );
        return attendance ? attendance?.status : null;
    };

    const getHistoryTime = (date) => {
        const dateString = dayjs(date).format('YYYY-MM-DD');
        const attendance = attendanceData?.find(
            (att) => dayjs(att?.date).format('YYYY-MM-DD') === dateString
        );
        const totalMinutes = Math.round(attendance?.totalHours * 60) || 0;
        const formattedDuration = dayjs.duration(totalMinutes, 'minutes');
        const formattedTime = `${formattedDuration.hours()}. ${formattedDuration.minutes()}`;
        return formattedTime || 0;
    };
    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
    };

    const handleClockIn = async () => {
        setLoadingClockIn(true);
        try {
            if (!checkInOutStatus?.clockOut && checkInOutStatus?.clockIn) {
                const res = await postCheckOut();
                if (!!res?.error) {
                    notification.error({
                        message: 'Error',
                        description: res?.msg || 'Something went wrong while clocking out.',
                    });
                } else {
                    notification.success({
                        message: 'Success',
                        description: 'You have clocked out successfully.',
                    });
                }
            } else {
                const res = await postCheckIn();
                if (!!res?.error) {
                    notification.error({
                        message: 'Error',
                        description: res?.msg || 'Something went wrong while clocking in.',
                    });
                } else {
                    notification.success({
                        message: 'Success',
                        description: 'You have clocked in successfully.',
                    });
                }
            }
        } catch (error) {
            getStatus();
            getAttendance({
                year: selectedYear,
                month: selectedMonth,
            });
            notification.error({
                message: 'Error',
                description: 'Something went wrong while clocking in.',
            });
        } finally {
            getStatus();
            getAttendance({
                year: selectedYear,
                month: selectedMonth,
            });
            setLoadingClockIn(false);
        }
    };

    const dateCellRender = (value) => {
        const status = getAttendanceStatus(value);
        const isWeekendDay = isWeekend(value);
        let history = getHistoryTime(value);

        return (
            <div className='flex flex-col items-center justify-center rounded-lg p-2'>
                {isWeekendDay && (
                    <div className='w-full p-1 text-center font-medium text-[#E47629]'>Weekend</div>
                )}
                {status && (
                    <div
                        className={`flex flex-col gap-1 text-center !text-sm font-medium text-${status === 'present' ? 'green' : status == 'absent' ? 'yellow' : 'red'}-500`}
                    >
                        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        <span>{history}</span>
                    </div>
                )}
            </div>
        );
    };

    const years = Array.from({ length: 2100 - 2024 + 1 }, (_, index) => 2024 + index);
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    if (!!loading || !attendanceData) {
        return (
            <div className='flex h-screen w-full items-center justify-center'>
                <InfinitySpin width='200' color='#4B5563' />
            </div>
        );
    }
    return (
        <div className='overflow-x-auto rounded-xl bg-white p-4 shadow-lg'>
            <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                    <Select
                        defaultValue={selectedYear}
                        onChange={handleYearChange}
                        style={{ width: 120 }}
                    >
                        {years.map((year) => (
                            <Option key={year} value={year}>
                                {year}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        defaultValue={selectedMonth}
                        onChange={handleMonthChange}
                        style={{ width: 120 }}
                    >
                        {months.map((month, index) => (
                            <Option key={index + 1} value={index + 1}>
                                {month}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div>
                    {checkInOutStatus?.clockIn && !checkInOutStatus?.clockOut && (
                        <LiveCounter clockIn={checkInOutStatus?.clockIn} />
                    )}
                    {
                        !_id ? (
                            <button
                                className='rounded bg-primary px-4 py-2 text-sm font-semibold text-white'
                                onClick={() => setOpenDrawer(true)}
                            >
                                {!checkInOutStatus?.clockOut && checkInOutStatus?.clockIn
                                    ? 'Clock Out'
                                    : 'Clock In'}
                            </button>
                        ) : <button
                            className='rounded bg-primary px-4 py-2 text-sm font-semibold text-white'
                            onClick={() => router.back()}
                        >
                            Back
                        </button>

                    }
                </div>
            </div>
            <div className='overflow-x-auto'>
                <Calendar
                    value={dayjs(`${selectedYear}-${selectedMonth}`)}
                    dateCellRender={dateCellRender}
                    headerRender={({ value }) => {
                        return (
                            <div className='flex items-center justify-between rounded-t-xl px-4 py-2'>
                                <span className='text-lg font-bold '>
                                    {dayjs(value).format('MMMM YYYY')}
                                </span>
                                <div>
                                    <button className='text-sm font-semibold'>Today</button>
                                </div>
                            </div>
                        );
                    }}
                    className='mt-4 rounded-xl'
                    mode='month'
                />
            </div>

            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                title={
                    !checkInOutStatus?.clockOut && checkInOutStatus?.clockIn
                        ? 'Clock Out'
                        : 'Clock In'
                }
                width={300}
                placement='right'
            >
                <div className='flex flex-col items-center space-y-4'>
                    <div className='flex items-center gap-2'>
                        <Image
                            src={user?.image ? user?.image : '/defaultimg.jpg'}
                            width={100}
                            height={100}
                            alt={user?.name || 'image'}
                            className='h-[40px] w-[40px] rounded-full object-cover sm:h-[56px] sm:w-[56px]'
                        />
                        <div>
                            <h3 className='text-base font-medium'>{user?.name}</h3>
                            <h3 className='text-base font-medium'>{user?.email}</h3>
                        </div>
                    </div>
                    <div className='flex w-full items-center justify-center border-t-[1px]'>
                        <div className='flex items-center gap-2 py-4'>
                            <p className='border border-primary px-3 py-1 text-base font-medium'>
                                Today
                            </p>
                            <p className='border border-primary px-3 py-1 text-base font-medium'>
                                {currentDateTime.format('h:mm A')}
                            </p>
                        </div>
                    </div>

                    {loadingClockIn ? (
                        <InfinitySpin width='140' color='#E67529' />
                    ) : (
                        <button
                            className='rounded bg-primary px-4 py-2 text-sm font-semibold text-white'
                            onClick={handleClockIn}
                        >
                            {!checkInOutStatus?.clockOut && checkInOutStatus?.clockIn
                                ? 'Clock Out'
                                : 'Clock In'}
                        </button>
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default NoticeCalendar;
