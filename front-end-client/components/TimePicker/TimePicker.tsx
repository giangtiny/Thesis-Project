import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Group, Badge, Paper } from '@mantine/core';
import { TimeInput } from '@mantine/dates';

import { gradientBadgeProps } from '@/constants/props';
import { selectBookedDate } from '@redux/selectors';
import { dateActions } from '@redux/slices';
import { IconClock } from '@tabler/icons';

export default function TimePicker() {
  const [checkinTime, checkoutTime] = useSelector(selectBookedDate);
  const { setCheckinTime, setCheckoutTime } = dateActions;
  const dispatch = useDispatch();

  const handleCheckinTime = (time: Date) => dispatch(setCheckinTime(time));

  const handleCheckoutTime = (time: Date) => dispatch(setCheckoutTime(time));

  return (
    <Paper shadow="xs" p="sm">
      <Group position="apart">
        <Group>
          <Badge {...gradientBadgeProps}>Chọn giờ checkin</Badge>
          <TimeInput
            value={checkinTime}
            onChange={handleCheckinTime}
            icon={<IconClock size={16} />}
          />
        </Group>
        <Group>
          <Badge {...gradientBadgeProps}>Chọn giờ checkout</Badge>
          <TimeInput
            value={checkoutTime}
            onChange={handleCheckoutTime}
            icon={<IconClock size={16} />}
          />
        </Group>
      </Group>
    </Paper>
  );
}
