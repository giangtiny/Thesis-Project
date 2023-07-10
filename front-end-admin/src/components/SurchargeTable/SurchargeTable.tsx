import React, { useState, useEffect } from 'react';
import { Text, NumberInput, Button, Group, TextInput, Tooltip, ActionIcon } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import FormatMoney from '@/utils/formats';
import { IconEdit, IconPlus, IconTrash, IconX } from '@tabler/icons';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IOrderDataTable, IOrderDetail } from '@/utils/types';
import { updateOrder, updateSurcharge } from '@/api/order';
import { ASSET_TEXT } from '@/constants/asset';
import { updateOrderVilla } from '@/api/orderVilla';
import { updateOrderTownhouse } from '@/api/orderTownhouse';

export default function SurchargeTable({
  assetType,
  isUpdating,
  isCreating,
  orderForm,
  getCurrentInvoice,
}: {
  assetType: 'hotel' | 'villa' | 'town-house';
  isUpdating?: boolean;
  isCreating?: boolean;
  orderForm: UseFormReturnType<IOrderDetail>;
  getCurrentInvoice?: () => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const surchargeForm = useForm<IOrderDataTable>({
    initialValues: {
      name: '',
      quantity: 0,
      price: 0,
    },

    validate: {
      name: (value: string) => (value.length < 1 ? 'Cần nhập tên phụ phí' : null),
      quantity: (value: number) => (value < 1 ? 'Số lượng cần lớn hơn 0' : null),
      price: (value: number) => (value < 1 ? 'Giá tiền cần lớn hơn 0' : null),
    },
  });

  const handleUpdateSurcharge = async (roomSurcharges: IOrderDataTable[]) => {
    try {
      if (assetType === ASSET_TEXT.HOTEL) {
        await updateOrder({ ...orderForm.values, roomSurcharges: roomSurcharges });
      }
      if (assetType === ASSET_TEXT.VILLA) {
        await updateOrderVilla({ ...orderForm.values, surcharges: roomSurcharges });
      }
      if (assetType === ASSET_TEXT.TOWN_HOUSE) {
        await updateOrderTownhouse({ ...orderForm.values, surcharges: roomSurcharges });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddField = () => {
    setAdding(true);
    if (orderForm.values.roomSurcharges) {
      orderForm.setFieldValue('roomSurcharges', [
        ...orderForm.values.roomSurcharges,
        surchargeForm.values,
      ]);
    }
    else {
      orderForm.setFieldValue('roomSurcharges', [
        surchargeForm.values,
      ]);
    }
  };

  const handleCancelField = () => {
    adding &&
      orderForm.setFieldValue(
        'roomSurcharges',
        orderForm.values.roomSurcharges.slice(0, orderForm.values.roomSurcharges.length - 1)
      );
    setAdding(false);
    setUpdating(false);
    surchargeForm.reset();
  };

  const handleConfirmField = async () => {
    const index = adding
      ? orderForm.values.roomSurcharges.length - 1
      : orderForm.values.roomSurcharges
        .map((surcharge) => surcharge.name)
        .indexOf(surchargeForm.values.name);

    orderForm.values.roomSurcharges[index] = surchargeForm.values;
    setAdding(false);
    setUpdating(false);
    surchargeForm.reset();
    if (isUpdating) {
      handleUpdateSurcharge(orderForm.values.roomSurcharges)
        .then(() => {
          getCurrentInvoice && getCurrentInvoice();
        })
        .catch(() => { });
    }
  };

  const handleDeleteField = async (e: React.MouseEvent<HTMLElement>, record: IOrderDataTable) => {
    e.stopPropagation();
    let tempRoomSurcharges = orderForm.values.roomSurcharges.filter(
      (surcharge) => surcharge.name !== record.name
    );
    orderForm.setFieldValue('roomSurcharges', tempRoomSurcharges);
    if (isUpdating) {
      handleUpdateSurcharge(tempRoomSurcharges)
        .then(() => {
          getCurrentInvoice && getCurrentInvoice();
        })
        .catch(() => { });
    }
  };

  const handleUpdateField = (e: React.MouseEvent<HTMLElement>, record: IOrderDataTable): void => {
    e.stopPropagation();
    surchargeForm.setValues({ ...record });
    setUpdating(true);
  };

  return (
    <form onSubmit={surchargeForm.onSubmit(handleConfirmField)}>
      <DataTable
        style={{ flexGrow: 1, overflow: 'auto', display: 'block' }}
        verticalSpacing="xs"
        idAccessor="name"
        withColumnBorders
        minHeight={150}
        noRecordsIcon={<IconX />}
        noRecordsText="Không có phụ phí"
        columns={[
          {
            accessor: 'id',
            title: 'STT',
            textAlignment: 'center',
            width: '8%',
            render: (_, index) => index + 1,
          },
          {
            accessor: 'name',
            textAlignment: 'center',
            title: 'Tên dịch vụ',
            width: '40%',
            render: (record, index) =>
              (adding && index + 1 === orderForm.values.roomSurcharges.length) ||
                (updating &&
                  index ===
                  orderForm.values.roomSurcharges
                    .map((surcharge) => surcharge.name)
                    .indexOf(surchargeForm.values.name)) ? (
                <TextInput {...surchargeForm.getInputProps('name')} />
              ) : (
                record.name
              ),
          },
          {
            accessor: 'quantity',
            title: 'Số lượng',
            textAlignment: 'center',
            width: '12%',
            render: (record, index) =>
              (adding && index + 1 === orderForm.values.roomSurcharges.length) ||
                (updating &&
                  index ===
                  orderForm.values.roomSurcharges
                    .map((surcharge) => surcharge.name)
                    .indexOf(surchargeForm.values.name)) ? (
                <NumberInput {...surchargeForm.getInputProps('quantity')} min={0} />
              ) : (
                record.quantity
              ),
          },
          {
            accessor: 'price',
            title: 'Đơn giá',
            textAlignment: 'center',
            width: '20%',
            render: (record, index) =>
              (adding && index + 1 === orderForm.values.roomSurcharges.length) ||
                (updating &&
                  index ===
                  orderForm.values.roomSurcharges
                    .map((surcharge) => surcharge.name)
                    .indexOf(surchargeForm.values.name)) ? (
                <NumberInput {...surchargeForm.getInputProps('price')} step={10000} min={0} />
              ) : (
                <Text color="red">{FormatMoney(record.price)}</Text>
              ),
          },
          {
            accessor: 'totalSubCharge',
            title: 'Thành tiền',
            textAlignment: 'center',
            width: '20%',
            render: (record, index) =>
              (adding && index + 1 === orderForm.values.roomSurcharges.length) ||
                (updating &&
                  index ===
                  orderForm.values.roomSurcharges
                    .map((surcharge) => surcharge.name)
                    .indexOf(surchargeForm.values.name)) ? null : (
                <Text color="red">{FormatMoney(record.price * record.quantity)}</Text>
              ),
          },
          {
            accessor: 'actions',
            title: <Text mr="xs">Thao tác</Text>,
            textAlignment: 'center',
            hidden: adding || (!isUpdating && !isCreating),
            render: (record, _) => (
              <Group spacing={4} position="center" noWrap>
                <Tooltip label="Chỉnh sửa thông tin">
                  <ActionIcon
                    color="blue"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      handleUpdateField(e, record);
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Xóa">
                  <ActionIcon
                    color="red"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      handleDeleteField(e, record);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
        records={orderForm.values.roomSurcharges}
      // records={assetType === ASSET_TEXT.HOTEL ?
      //   orderForm.values.roomSurcharges : orderForm.values.surcharges}
      />
      {isUpdating || isCreating ? (
        <Group position="right">
          {adding || updating ? (
            <Group>
              <Button color="red" onClick={handleCancelField}>
                Hủy
              </Button>
              <Button color="teal" type="submit">
                Xác nhận
              </Button>
            </Group>
          ) : (
            <Button color="teal" variant="subtle" leftIcon={<IconPlus />} onClick={handleAddField}>
              Thêm phụ phí
            </Button>
          )}
        </Group>
      ) : null}
    </form>
  );
}
