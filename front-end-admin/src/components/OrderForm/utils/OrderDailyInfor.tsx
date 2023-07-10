import React from 'react';
import dayjs from 'dayjs';
import { Stack, Checkbox } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { DatePicker } from '@mantine/dates';

import { useOrderFormContext } from '@/context/hotel';
import { selectIsGroup } from '@/redux/selectors';
import { IconCalendar } from '@tabler/icons';
import { ASSET_TEXT } from '@/constants/asset';

const datePickProps = {
  locale: 'vi',
  inputFormat: 'DD/MM/YYYY',
  placeholder: 'Chọn ngày',
  clearable: false,
  icon: <IconCalendar size={16} />,
};

export default function OrderDailyInfor({ assetType, isUpdating }: { assetType: 'hotel' | 'villa' | 'town-house', isUpdating?: boolean }) {
  const orderForm = useOrderFormContext();
  const isGroup = useSelector(selectIsGroup);
  console.log(orderForm.values.checkOut);
  const location = useLocation();
  const { action }: { action: string } = location.state ? location.state : '';
  const isCreating: boolean = action === 'new';
  const timeNow = new Date();
  timeNow.setHours(0);
  timeNow.setMinutes(0);
  timeNow.setSeconds(0);
  timeNow.setMilliseconds(0);
  const nextDate = new Date(timeNow.getTime());
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateCheckIn = new Date(orderForm.values.checkIn as string);
  nextDateCheckIn.setDate(nextDateCheckIn.getDate() + 1);

  return (
    <Stack>
      {(true || isGroup || assetType === ASSET_TEXT.VILLA || assetType === ASSET_TEXT.TOWN_HOUSE) ? (
        <DatePicker
          {...datePickProps}
          value={new Date(orderForm.values.checkIn as string)}
          disabled={orderForm.values.isFullyPaid}
          onChange={(value) => {
            if (value) {
              value.setSeconds(1);
              return orderForm.setFieldValue(
                'checkIn',
                value.toISOString()
              )
            }
            return orderForm.setFieldValue(
              'checkIn', new Date().toISOString()
            )
          }
          }
          label="Ngày nhận phòng dự kiến"
        />
      ) : null}
      <DatePicker
        {...datePickProps}
        minDate={nextDateCheckIn}
        defaultValue={isCreating ? nextDate : new Date(orderForm.values.checkOut as string)}
        disabled={orderForm.values.isFullyPaid}
        onChange={(value) => {
          return orderForm.setFieldValue('checkOut', value?.toISOString())
        }
        }
        label="Ngày trả phòng dự kiến"
      />
    </Stack>
  );
}
