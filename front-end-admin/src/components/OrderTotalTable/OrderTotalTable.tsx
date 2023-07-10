import React from 'react';
import { Group, Table, Text } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IOrderDataTable, IOrderDetail } from '@/utils/types';

import FormatMoney from '@/utils/formats';



export default function OrderTotalTable({ assetType, invoice }: { assetType: 'hotel' | 'villa' | 'town-house', invoice: any }) {
  console.log('object invoice:', invoice);
  const elements = [
    {
      name: 'Tiền phòng',
      value: invoice?.price || 1000000,
    },
    {
      name: 'Tiền phụ phí',
      value: invoice?.totalSurCharge || 100000,
    },
    {
      name: `Thuế GTGT (${invoice.vat * 100}%)`,
      value: invoice?.vatInPrice || 110000,
    },
    {
      name: 'Giảm giá',
      value: invoice?.discount || 100000,
    },
    {
      name: 'Tổng cộng',
      value: invoice?.totalPrice || 1110000,
    },
  ];

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td width="80%">
        <Group position="right">
          <Text style={{ width: '40%' }} weight="bold">
            {element.name}
          </Text>
        </Group>
      </td>
      <td>
        <Text color="red" align="center">
          {FormatMoney(element.value)}
        </Text>
      </td>
    </tr>
  ));

  return (
    <Table withColumnBorders verticalSpacing="sm">
      <tbody>{rows}</tbody>
    </Table>
  );
}
