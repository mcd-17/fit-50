'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from 'antd';
import { fetchPermissions, postPermissions, singleRole } from '../../../../../helpers/backend';
import {  useAction, useFetch } from '../../../../../helpers/hooks';
import { useUser } from '../../../../../contexts/user';
import Table from '../../../../components/form/table';
import Button from '../../../../../../components/common/button';
// import Table from '../../../../../components/common/table';
// import Button from '../../../../../components/common/button';

const RolePermission = ({params}) => {
    // const searchParams = useSearchParams();
    // const query = searchParams.get('_id');
    const [elements] = useFetch(fetchPermissions);
    const [role, getRoles] = useFetch(singleRole, {}, false);
    const user = useUser();
    const { push } = useRouter();
    const [update, setUpdate] = useState(false);
    const reload = () => setUpdate(!update);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (params?._id) {
            getRoles({ _id: params?._id });
        }
    }, [params?._id]);

    useEffect(() => {
        if (role?._id) {
            setPermissions(role?.permissions);
        }
    }, [role?._id]);

    const isChecked = (data) => {
        if (data?.child) {
            for (let c of data.child) {
                if (permissions?.includes(c?.permission)) {
                    return true;
                }
            }
        }
        if (permissions.includes(data?.permission)) {
            return true;
        }
        return false;
    };

    const handleChange = (e, data) => {
        if (e.target.checked === true) {
            if (data.child) {
                setPermissions([...permissions, ...data?.child?.map((d) => d.permission)]);
            } else {
                permissions.push(data.permission);
            }
        } else {
            let p = data?.child ? data?.child?.map((d) => d.permission) : [data.permission];
            setPermissions(permissions?.filter((d) => !p.includes(d)));
        }
        reload();
    };

    const admin = user?.role === 'admin';
    const Check = ({ d }) => (
        <Checkbox onChange={(e) => handleChange(e, d)} checked={isChecked(d)} />
    );

    const columns = [
        { text: '#', dataField: '', formatter: (_, d) => <Check d={d} /> },
        { text: 'Name', dataField: 'name' },
        {
            text: 'Create',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_create`, user?.permission)) && (
                    <Check
                        d={data?.child?.find((d) => d.permission === `${data?.permission}_create`)}
                    />
                ),
        },
        {
            text: 'Edit',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_edit`, user?.permission)) && (
                    <Check
                        d={data?.child?.find((d) => d.permission === `${data?.permission}_edit`)}
                    />
                ),
        },
        {
            text: 'Delete',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_delete`, user?.permission)) && (
                    <Check
                        d={data?.child?.find((d) => d.permission === `${data?.permission}_delete`)}
                    />
                ),
        },
        {
            text: 'View',
            dataField: '',
            formatter: (_, data) =>
                data.child &&
                (admin || havePermission(`${data?.permission}_view`, user?.permission)) && (
                    <Check
                        d={data?.child?.find((d) => d.permission === `${data?.permission}_view`)}
                    />
                ),
        },
    ];

    return (
        <div>
            <Table
                title={`Roles Permission: ${role?.name}`}
                pagination={false}
                noActions={true}
                columns={columns}
                data={elements
                    ?.filter((d) => {
                        if (admin) {
                            return true;
                        }
                        if (havePermission(d.permission, user?.permission)) {
                            return true;
                        }
                        if (d?.child) {
                            for (let c of d.child) {
                                if (havePermission(c.permission, user?.permission)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })
                    ?.map((d) => {
                        return {
                            ...d,
                            child: d?.child
                                ? admin
                                    ? d.child
                                    : d.child?.filter((d) =>
                                          havePermission(d.permission, user?.permission)
                                      )
                                : undefined,
                        };
                    })}
            />

            <Button mode="live"
                onClick={async () => {
                    return useAction(postPermissions, { role: params?._id, permissions }, () => {
                        push('/admin/hrm/roles');
                    });
                }}
            >
                Save
            </Button>
        </div>
    );
};

export default RolePermission;
