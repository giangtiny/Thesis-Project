import React, { Ref, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RangeCalendar } from '@mantine/dates';
import { Center, Container, Paper, Space, Badge, Button, Group, Text } from '@mantine/core';
import 'dayjs/locale/vi';

import { useCalendarStyle } from './Calendar.style';
import { gradientBadgeProps } from '@/constants/props';
import { selectBookedDate } from '@redux/selectors';
import { dateActions } from '@redux/slices';
import { DETAILS_TEXT } from '@/constants/details';
import { useMediaQuery } from '@mantine/hooks';

export default function Calendar() {
  const { classes, cx, theme } = useCalendarStyle();
  const dates = useSelector(selectBookedDate);
  const [checkinDate, checkoutDate] = dates;
  const dispatch = useDispatch();
  const { setBookedDate } = dateActions;
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  const onChange = (value: [Date | null, Date | null]) => dispatch(setBookedDate(value));

  const handleResetDate = () => dispatch(setBookedDate([null, null]));

  const renderDate = () => {
    return (
      <Text>
        {!checkinDate ? 'Chọn ngày checkin' : `${checkinDate.toLocaleDateString()} - `}
        <Text span>
          {checkinDate
            ? checkoutDate
              ? checkoutDate.toLocaleDateString()
              : 'Chọn ngày checkout'
            : ''}
        </Text>
      </Text>
    );
  };

  return (
    <Container p={0}>
      {/* <Text>{renderDate()}</Text> */}
      <Space h="md" />
      <Center>
        <RangeCalendar
          value={dates}
          onChange={onChange}
          allowLevelChange={false}
          allowSingleDateInRange
          locale="vi"
          amountOfMonths={isMobile ? 1 : 2}
          size={isMobile ? 'sm' : 'md'}
          minDate={checkinDate || new Date()}
          classNames={{ day: classes.day }}
        />
      </Center>
      <Group position="right">
        {checkinDate && checkoutDate && (
          <Button
            radius="xl"
            onClick={handleResetDate}
            variant="subtle"
            color="green"
            className={classes.button}>
            {DETAILS_TEXT.RESET_DATE}
          </Button>
        )}
      </Group>
    </Container>
  );
}
