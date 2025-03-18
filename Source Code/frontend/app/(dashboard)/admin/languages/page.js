"use client";
import React from 'react';
import { Switch } from 'antd';
import { useRouter } from 'next/navigation';
import { PiTranslate } from "react-icons/pi";
import Button from '../../../../components/common/button';
import Table from '../../components/form/table';
import { useActionConfirm, useFetch } from '../../../helpers/hooks';
import { delLanguage, fetchLanguages, postLanguage } from '../../../helpers/backend';
import { useI18n } from '../../../providers/i18n';
import PageTitle from '../../components/common/page-title';
import dayjs from 'dayjs';

const Languages = () => {
    const i18n = useI18n()
    const { push } = useRouter()
    const [languages, getLanguages, { loading }] = useFetch(fetchLanguages)
    let columns = [
        {
            text: 'Created At',
            dataField: 'createdAt',
            formatter: (_, d) => <div>{dayjs(d?.createdAt).format('MMM DD , YYYY')}</div>,
        },
        { text: 'Name', dataField: 'name' },
        { text: 'Flag', dataField: 'flag' },
        { text: 'Code', dataField: 'code' },
        {
            text: 'Default', dataField: 'default', formatter: (_, d) => <Switch
                checkedChildren={('Active')}
                unCheckedChildren={('Inactive')}
                checked={d?.default}
                onChange={async (e) => {
                    await useActionConfirm(postLanguage, { _id: d._id, default: e }, getLanguages, ('Are you sure you want to change default language?'), 'Yes, Change');
                }}
                className='bg-gray-500'
            />
        },
        {
            text: 'Status', dataField: 'active', formatter: (_, d) => <Switch
                checkedChildren={('Active')}
                unCheckedChildren={('Inactive')}
                checked={d?.active}
                onChange={async (e) => {
                    await useActionConfirm(postLanguage, { _id: d._id, active: e }, getLanguages, ('Are you sure you want to change status?'), 'Yes, Change');
                }}
                className='bg-gray-500'
            />
        },
        {
            text: 'RTL', dataField: 'rtl', formatter: (_, d) => <span>
                {d?.rtl ? 'Yes' : 'No'}
            </span>
        }
    ]

    let actions = ({ _id }) => (
        <button className="border border-primary text-primary p-2 rounded"
            title="Edit" onClick={() => {
                push('/admin/languages/translations/' + _id)
            }}>
            <PiTranslate size={12} />
        </button>
    )

    return (
        <div>
            <PageTitle title='Languages List' />
            <Table
                columns={columns}
                data={{
                    ...languages,
                    docs: languages?.docs?.map(doc => ({
                        ...doc,
                        disableDelete: doc.code === 'en' ? 1 : 0,
                    })),
                }}
                onReload={getLanguages}
                loading={loading}
                pagination
                indexed
                action={(
                    <Button onClick={() => push('/admin/languages/add')}>{i18n?.t("Add Language")}</Button>
                )}
                onEdit={({ _id }) => push('/admin/languages/edit/' + _id)}
                onDelete={delLanguage}
                actions={actions}
            />
        </div>
    );
};

export default Languages;