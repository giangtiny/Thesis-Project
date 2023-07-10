import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Radio, Checkbox, Space, Group } from '@mantine/core';
import dayjs from 'dayjs';

import { useOrderFormContext } from '@/context/hotel';
import { useAppDispatch } from '@/redux/store';
import { roomSelectActions } from '@/redux/slices';
import { selectIsGroup } from '@/redux/selectors';
import { ORDER_TYPE, ORDER_TYPE_VALUE } from '@/constants/forms';

export default function OrderTypeRadio({ disabled }: { disabled?: boolean }) {
  const orderForm = useOrderFormContext();
  const dispatch = useAppDispatch();
  const isGroup = useSelector(selectIsGroup);
  const { setGroupState, setOrderType } = roomSelectActions;

  useEffect(() => {
    const isHourly = orderForm.values.orderType === 0;
    dispatch(setGroupState(!isHourly && isGroup));
    dispatch(setOrderType(orderForm.values.orderType));
  }, [orderForm.values.orderType]);

  return (
    <>
      <Radio.Group
        value={ORDER_TYPE[orderForm.values.orderType]}
        onChange={(value) =>
          orderForm.setFieldValue(
            'orderType',
            //@ts-ignore
            ORDER_TYPE_VALUE[value as keyof typeof ORDER_TYPE_VALUE]
          )
        }
        name="orderType"
        label="Chọn loại hóa đơn"
        size="md"
      >
        <Group position="apart" style={{ 'width': '100%' }}>
          <Radio value="day" label="Theo ngày" disabled={disabled} />
          <Radio value="hour" label="Theo giờ" disabled={disabled} />
        </Group>
      </Radio.Group>
      <Space h="md" />
      <Checkbox
        checked={isGroup}
        onChange={(event) => {
          dispatch(setGroupState(event.currentTarget.checked));
          orderForm.setFieldValue('isGroupOrder', event.currentTarget.checked);
        }}
        label="Khách theo đoàn"
        size="md"
        disabled={orderForm.values.orderType === 0 || disabled}
      />
    </>
  );
}
