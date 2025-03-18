'use client';
import { useI18n } from '../../providers/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRightLong } from 'react-icons/fa6';
import { fetchAdminDashboardData, fetchUser } from '../../helpers/backend';
import { useFetch } from '../../helpers/hooks';
import { FiUsers } from 'react-icons/fi';
import { Card } from 'antd';
import DonutChart from '../components/form/pieChartComponent';
import { TbBellRingingFilled } from "react-icons/tb";
import { BsCartPlusFill } from "react-icons/bs";
import Table from '../components/form/table';
import { columnFormatter, getStatusClass } from '../../helpers/utils';
import { useRouter } from 'next/navigation';
import MonthlyEarningsChart from '../components/common/adminChart';
import { FaUsers } from "react-icons/fa";
import { TbUsersGroup } from "react-icons/tb";
import { LiaUsersSolid } from "react-icons/lia";
import dayjs from 'dayjs';

const StatCard = ({ title, value, icon: Icon, className = '' }) => (
    <Card className=' bg-white p-4 !rounded-sm'>
        <div className='flex items-center justify-between'>
            <div>
                <p className='text-sm text-gray-500'>{title}</p>
                <p className='mt-2 text-2xl font-bold'>{value}</p>
            </div>
            <div className={`rounded-full p-3 ${className || 'bg-blue-500'}`}>
                <Icon className='h-6 w-6 text-white' />
            </div>
        </div>
    </Card>
);
const page = () => {
    const [user] = useFetch(fetchUser)
    const router = useRouter()
    const [data] = useFetch(fetchAdminDashboardData);
    const i18n = useI18n();

    const columns = [
        {
            text: "Order Id",
            dataField: "uid",
            formatter: (_, d) => <span>{d?.uid}</span>,
        },
        {
            text: "Date",
            dataField: "date",
            formatter: (_, d) => <span>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</span>,
        },
        {
            text: "Total",
            dataField: "total",
            formatter: (_, d) => <span>{d?.subTotal}</span>,
        },
        {
            text: "Payment Status",
            dataField: "status",
            formatter: (_, d) => <span className={`${getStatusClass(d?.payment?.status)}`}>{d?.payment?.status}</span>,
        },
        {
            text: "Payment Method",
            dataField: "event",
            formatter: (_, d) => (d?.payment?.method),
        },
    ];
    return (
        <div>
            <div className='flex 2xl:flex-row flex-col gap-3'>
                <div className='w-full rounded-sm bg-white 2xl:w-2/5'>
                    <div>
                        <div className='relative flex h-[200px] justify-between rounded bg-primary bg-opacity-10 p-4'>
                            <div className='flex flex-col gap-3'>
                                <h5 className='text-base font-bold text-primary'>Welcome Back !</h5>
                                <p className='text-opacity-1 text-sm text-primary'>
                                    Gymstick Dashboard
                                </p>
                            </div>
                            <Image
                                alt='admin'
                                src='/admin_profile.png'
                                className='absolute bottom-0 right-0 h-[180px] w-[400px] object-cover'
                                width={400}
                                height={200}
                            />
                        </div>
                        <div className='flex gap-[50px] p-4'>
                            <div className='w-1/3'>
                                <Image
                                    src={user?.image}
                                    alt='user'
                                    width={50}
                                    height={50}
                                    className='mt-[-50px] h-[50px] w-[50px] rounded-full object-cover'
                                />
                                <div className='mt-2 flex flex-col gap-1'>
                                    <p className='text-sm font-bold text-textMain'>{user?.name}</p>
                                    <p className='text-xs text-textBody capitalize'>{user?.role}</p>
                                </div>
                            </div>
                            <div className='flex w-2/3 flex-col justify-end gap-2'>
                                <Link
                                    href='/admin/profile'
                                    className='flex w-fit cursor-pointer items-center gap-2 rounded bg-primary px-[8px] py-[4px] text-xs text-white'
                                >
                                    View Profile <FaArrowRightLong />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid w-full xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 2xl:w-3/5'>
                    <StatCard
                        title={i18n?.t('Total Users')}
                        value={data?.totalUsers}
                        icon={FiUsers}
                        className='bg-blue-500 text-white'
                    />
                    <StatCard
                        title={i18n?.t('Total Trainers')}
                        value={data?.totalTrainers}
                        icon={FaUsers}
                        className='bg-green-500 text-white'
                    />
                    <StatCard
                        title={i18n?.t('Total Employees')}
                        value={data?.totalEmployee}
                        icon={LiaUsersSolid}
                        className='bg-amber-500 text-white'
                    />
                    <StatCard
                        title={i18n?.t('Total Groups')}
                        value={data?.totalGroups}
                        icon={TbUsersGroup}
                        className='bg-purple-500 text-white'
                    />

                    <StatCard
                        title={i18n?.t('Total Orders')}
                        value={data?.totalOrders}
                        icon={BsCartPlusFill}
                        className='bg-primary text-white'
                    />
                    <StatCard
                        title={i18n?.t('Total Active Subscriptions')}
                        value={data?.totalPaidSubscription}
                        icon={TbBellRingingFilled}
                        className='bg-lime-500 text-white'
                    />
                </div>
            </div>
            <div className='flex xl:flex-row flex-col gap-3'>
                <div className='mt-3 2xl:w-3/5 xl:w-1/2 bg-white p-4'>
                    <MonthlyEarningsChart data={data?.monthlyEarnings} />
                </div>

                <div className='mt-3 2xl:w-2/5 xl:w-1/2 bg-white p-4'>
                    <h3 className='mb-8 text-base font-bold text-textMain'>Sales Analytics</h3>
                    <DonutChart data={data?.salesData} />
                </div>
            </div>
            <div className='my-3 grid 2xl:grid-cols-3 xl:grid-cols-2 grid-cols-1 gap-3'>
                <div className='w-full bg-white p-4 '>
                    <h3 className='mb-8 text-base font-bold text-textMain'>Top Selling Products</h3>
                    <div className='flex flex-col gap-3  overflow-auto custom-scroll'>
                        {
                            data?.topProducts?.map((product, index) => (
                                <div key={product._id} className='flex items-center justify-between  rounded border p-3'>
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            alt='Image'
                                            src={product?.thumbnail_image}
                                            className='h-[50px] w-[50px] rounded'
                                            height={50}
                                            width={50}
                                        />
                                        <div className='flex flex-col gap-3'>
                                            <Link href={`/admin/product/view/${product?._id}`} className='text-sm font-bold text-textMain hover:underline line-clamp-1'>{columnFormatter(product?.name)}</Link>
                                            <div className='flex items-center gap-3'>
                                                <p className='text-opacity-1 text-xs text-textBody'>${product?.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-opacity-1 text-xs text-textBody'>Sales</p>
                                            <p className=' text-sm font-bold text-textBody'>{product?.totalSold}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }


                    </div>
                </div>
                <div className='w-full bg-white p-4 '>
                    <h3 className='mb-8 text-base font-bold text-textMain'>Top Trainers</h3>
                    <div className='flex flex-col gap-3  overflow-auto custom-scroll'>
                        {
                            data?.topTrainers?.map((trainer, index) => (
                                <div key={trainer._id} className='flex items-center justify-between rounded border p-3'>
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            src={trainer?.image}
                                            alt='Image'
                                            className='h-[50px] w-[50px] rounded-full'
                                            height={50}
                                            width={50}
                                        />
                                        <div className='flex flex-col gap-1'>
                                            <p className='text-sm font-bold text-textMain'>{trainer?.name}</p>
                                            <p className='text-opacity-1 text-xs text-textBody capitalize'>{trainer?.role}</p>
                                        </div>
                                    </div>
                                    <Link href={`/admin/trainers`} className='flex w-fit cursor-pointer items-center gap-2 rounded bg-primary px-[8px] py-[4px] text-xs text-white'>
                                        View
                                    </Link>
                                </div>
                            ))
                        }


                    </div>
                </div>
                <div className='w-full bg-white p-4 '>
                    <h3 className='mb-8 text-base font-bold text-textMain'>Active Members</h3>
                    <div className='flex flex-col gap-3  overflow-auto custom-scroll'>
                        {
                            data?.activeMembers?.map((member, index) => (
                                <div className='flex items-center justify-between rounded border p-3'>
                                    <div className='flex items-center gap-2'>
                                        <Image
                                            src={member?.image}
                                            alt='Image'
                                            className='h-[50px] w-[50px] rounded-full'
                                            height={50}
                                            width={50}
                                        />
                                        <div className='flex flex-col gap-1'>
                                            <p className='text-sm font-bold text-textMain'>{member?.name}</p>
                                            <p className='text-opacity-1 text-xs text-textBody'>Member</p>
                                        </div>
                                    </div>
                                    <Link href={`/admin/users/view/${member?._id}`} className='flex w-fit cursor-pointer items-center gap-2 rounded bg-primary px-[8px] py-[4px] text-xs text-white'>
                                        View
                                    </Link>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>
            <div className="p-3 bg-white">
                <Table
                    columns={columns}
                    data={data?.latestOrders}
                    title={i18n.t("Latest Transactions")}
                    indexed
                    onView={(value) => { router.push(`/admin/order/view/${value?._id}`) }}
                />
            </div>
        </div>
    );
};

export default page;