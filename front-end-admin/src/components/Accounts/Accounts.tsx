import React, { useState, useEffect } from 'react';
import { Text, UnstyledButton, Button, Container, Badge, Group, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { openModal, closeAllModals } from '@mantine/modals';
import { useForm } from '@mantine/form';
import { api } from '@/api/axios';
import { UserProps } from '@/utils/types';
import { accountInfoModal } from '@/utils/modals';
import { useAccountsStyles } from './Accounts.style';
import { accountFormInputProps } from '@/constants/forms';
import { deleteUser } from '@/api/user';

export default function Accounts() {
  const [updated, setUpdated] = useState(false);
  const [data, setData] = useState<UserProps[]>([]);
  const { classes, cx } = useAccountsStyles();
  const deleteAccount = async (accountId: string) => {
    const response = deleteUser(accountId);
    response.then(() => {
      fetchAccounts();
      closeAllModals();
    })
    .catch((error) => {
      console.log(error);
    });
  }
  const fetchAccounts = async () => {
    const dataUsers: UserProps[] = []
    const response = await api.get('admin/user/all');
    const dataResponses = await response.data;
    //@ts-ignore
    dataResponses.forEach((user) => {
      const dataUser = {
        ID: user.ID,
        name: user.name || '',
        address: user.address || '',
        email: user.email,
        phoneNumber: user.phoneNumber,
        username: user.username,
        password: user.password,
        avatar: user.avatar,
        role: user.role
      }
      //@ts-ignore
      dataUsers.push(dataUser);
    })
    setData(dataUsers);
  };
  useEffect(() => {
    // simulate expensive async loading operation
    fetchAccounts();
  }, [updated]);

  return (
    <Container
      fluid
      ml={0}
      mr={0}
      pt={12}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ backgroundColor: 'white' }} >
        <div className={classes.divButtonAdd} >
          <Button color='teal' onClick={() => accountInfoModal('add', updated, setUpdated)} >Thêm tài khoản</Button>
        </div>

        <DataTable
          style={{ flexGrow: 1, overflow: 'auto', display: 'block', minHeight: (data.length > 0 ? 80 : 150) }}
          highlightOnHover
          withBorder
          withColumnBorders
          onCellClick={({ record, recordIndex, column, columnIndex }) => {
            if (column.accessor !== 'Delete') {
              accountInfoModal('update', updated, setUpdated, record);
            }
          }}
          columns={[
            {
              accessor: 'ID',
              title: 'STT',
              textAlignment: 'center',
              render: (record: UserProps, index) => index + 1,
            },
            { accessor: 'username', textAlignment: 'center', title: 'Tên đăng nhập' },
            {
              accessor: 'email',
              title: 'Email',
              textAlignment: 'center',
              render: (record: UserProps, _) => (
                <Text color="red">{record.email}</Text>
              ),
            },
            {
              accessor: 'name', textAlignment: 'center', title: 'Tên',
            },
            {
              accessor: 'phoneNumber', textAlignment: 'center', title: 'Số điện thoại',
            },
            {
              accessor: 'role',
              title: 'Quyền',
              textAlignment: 'center',
              render: (record: UserProps, _) => {
                //@ts-ignore
                return <Text>{accountFormInputProps[record.role]}</Text>
              },
            },
            {
              accessor: 'Delete',
              title: 'Xóa',
              textAlignment: 'center',
              render: (record: UserProps, _) => (
                <Group spacing={4} position="center" noWrap>
                  <ActionIcon color="red" onClick={() => {
                    openModal({
                      title: 'Xóa tài khoản',
                      children: <>
                        <Text>Bạn có xác nhận muốn xóa tài khoản này?</Text>
                        <Group position="right">
                          {/*@ts-ignore*/}
                          <Button variant="outline" onClick={closeAllModals}>Hủy</Button>
                          <Button color='red' type='submit'
                            onClick={() => {
                              deleteAccount(record.ID || '');
                            }}
                          >Xóa</Button>
                        </Group>
                      </>,
                    })
                  }}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            }
          ]}
          records={data}
          noRecordsText="Chưa có tài khoản nào"
          idAccessor="ID"
        />
      </div>
    </Container>
  );
}