import React, { useEffect } from 'react';
import {
  Text,
  NumberInput,
  Button,
  Group,
  Container,
  ActionIcon,
  Tooltip,
  Center,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import { IconPlus, IconTrash, IconX } from '@tabler/icons';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IOrderDetail, IOrderHourPolicy, RecordRoom } from '@/utils/types';
import FormatMoney from '@/utils/formats';

export default function PoliciesTable({
  form,
  disabled,
}: {
  form: UseFormReturnType<RecordRoom>;
  disabled?: boolean;
}) {
  const handleAddField = () => {
    const tempHourFeePolicies = form.values.hourFeePolicies;
    tempHourFeePolicies.push({ hour: 0, fee: 0 });
    form.setFieldValue('hourFeePolicies', [...tempHourFeePolicies]);
  };

  const handleUpdateField = (index: number, record: IOrderHourPolicy) => {
    const tempHourFeePolicies = form.values.hourFeePolicies;
    tempHourFeePolicies[index] = record;
    form.setFieldValue('hourFeePolicies', [...tempHourFeePolicies]);
  };

  const handleDeleteField = (index: number) => {
    const tempHourFeePolicies = form.values.hourFeePolicies;
    tempHourFeePolicies.splice(index, 1);
    form.setFieldValue('hourFeePolicies', [...tempHourFeePolicies]);
  };

  return (
    <>
      <Text>Chính sách tiền theo giờ</Text>
      <DataTable
        style={{ flexGrow: 1, overflow: 'auto', display: 'block' }}
        verticalSpacing="xs"
        withColumnBorders
        minHeight={150}
        noRecordsIcon={<IconX />}
        noRecordsText="Không có chính sách"
        columns={[
          {
            accessor: 'id',
            title: 'STT',
            textAlignment: 'center',
            width: '8%',
            render: (_, index) => index + 1,
          },
          {
            accessor: 'hour',
            textAlignment: 'center',
            title: 'Số giờ',
            width: '20%',
            render: (record, index) => (
              <NumberInput
                value={record.hour}
                onChange={(value) =>
                  handleUpdateField(index, { hour: value as number, fee: record.fee })
                }
                disabled={disabled}
              />
            ),
          },
          {
            accessor: 'fee',
            title: 'Giá tiền',
            textAlignment: 'center',
            width: '20%',
            render: (record, index) => (
              <NumberInput
                value={record.fee}
                onChange={(value) =>
                  handleUpdateField(index, { hour: record.hour, fee: value as number })
                }
                disabled={disabled}
              />
            ),
          },
          {
            accessor: 'actions',
            title: <Text mr="xs">Thao tác</Text>,
            textAlignment: 'center',
            width: '5%',
            render: (record, index) => (
              <Center style={{ height: '100%', width: '100%' }}>
                <Tooltip label="Xóa">
                  <ActionIcon
                    color="red"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      handleDeleteField(index);
                    }}
                    disabled={disabled}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Center>
            ),
          },
        ]}
        records={form.values.hourFeePolicies}
      />
      <Group position="apart">
        <Button
          color="teal"
          variant="subtle"
          leftIcon={<IconPlus />}
          onClick={handleAddField}
          disabled={disabled}
        >
          Thêm chính sách theo giờ
        </Button>
      </Group>
    </>
  );
}
