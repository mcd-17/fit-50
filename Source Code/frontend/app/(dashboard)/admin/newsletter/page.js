'use client';

import React from 'react';
import Table from '../../components/form/table'
import { useFetch } from '../../../helpers/hooks';
import { delAdminNewsletter, fetchAdminNewsletter } from '../../../helpers/backend';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';


const Page = () => {
  const [data, getData, { loading }] = useFetch(fetchAdminNewsletter);

  const columns = [
    {
      text: 'Created At',
      dataField: 'createdAt',
      formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
  },
    {
      text: 'Email',
      dataField: 'email',
      formatter: (_, d) => (
        <span className='line-clamp-2 w-[150px] text-wrap sm:w-[250px]'>{d?.email}</span>
      ),
    },
  ]
  return (
    <div>
      <PageTitle title={'News Letter List'} />
      <Table
        data={data}
        indexed
        pagination
        getData={getData}
        columns={columns}
        loading={loading}
        onReload={getData}
        onDelete={delAdminNewsletter}
      />
    </div>
  )
}

export default Page