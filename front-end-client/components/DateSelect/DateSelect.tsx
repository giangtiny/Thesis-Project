import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Group, Badge, InputVariant } from '@mantine/core';
import { DatePicker, DayModifiers } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons';
import 'dayjs/locale/vi';

import { useDateSelectStyles } from './DateSelect.style';
import { gradientBadgeProps } from '@/constants/props';
import { DETAILS_TEXT } from '@/constants/details';
import { selectBookedDate } from '@redux/selectors';
import { dateActions } from '@redux/slices';

export default function DateSelect() {
  const { classes, cx } = useDateSelectStyles();
  const [checkinDate, checkoutDate] = useSelector(selectBookedDate);
  const { setBookedDate } = dateActions;
  const dispatch = useDispatch();

  const dayClassNames = (date: Date, modifiers: DayModifiers) => {
    return cx({
      [classes.selected]: modifiers.selected
    });
  };

  const datePickerProps = {
    placeholder: 'Chọn ngày',
    variant: 'unstyled' as InputVariant,
    locale: 'vi',
    inputFormat: 'DD/MM/YYYY',
    icon: <IconCalendar size={16} />,
    clearable: false,
    allowLevelChange: false,
    minDate: checkinDate || new Date(),
    className: classes.datePicker,
    dayClassName: dayClassNames
  };

  const onChangeCheckin = (date: Date) => dispatch(setBookedDate([date, checkoutDate]));

  const onChangeCheckout = (date: Date) => dispatch(setBookedDate([checkinDate, date]));

  return (
    <Group position="apart" className={classes.group}>
      <DatePicker
        label={
          <Badge color="teal" size="md" variant="filled">
            {DETAILS_TEXT.RECEIVE_ROOM_TEXT}
          </Badge>
        }
        {...datePickerProps}
        value={checkinDate}
        onChange={onChangeCheckin}
      />
      <DatePicker
        label={
          <Badge color="teal" size="md" variant="filled">
            {DETAILS_TEXT.RETURN_ROOM_TEXT}
          </Badge>
        }
        {...datePickerProps}
        value={checkoutDate}
        onChange={onChangeCheckout}
        disabled={!checkinDate}
      />
    </Group>
  );
}
