import React, { useState } from 'react';
import {
  Button,
  Grid,
  Group,
  Paper,
  MantineNumberSize,
  GroupPosition,
  Stack,
  Text,
  Badge,
  Divider,
  Popover,
  Space
} from '@mantine/core';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import DateSelect from '@/components/DateSelect';
import GuestSelectBoxComponent from '@/components/GuestSelectBox';
import { PRICE_CURRENCY, PRICE_TEXT, PRICE_UNIT } from '@/constants/prices';
import { usePaymentBoxStyles } from './PaymentBox.style';
import { gradientBadgeProps } from '@/constants/props';
import { DETAILS_TEXT } from '@/constants/details';
import { formatMoney } from '@/utils/formatter';
import { selectBookedDate, selectCountGuest } from '@redux/selectors';

const PAYMENT_BOX_RADIUS = 'lg';
const PAYMENT_BOX_SHADOW = 'md';
interface Props {
  price?: number;
  isForContact: boolean;
  phone: string;
}
export default function PaymentBox(props: Props) {
  const { price, isForContact, phone } = props;
  const { classes } = usePaymentBoxStyles();
  const router = useRouter();
  const dates = useSelector(selectBookedDate);
  const guestCount = useSelector(selectCountGuest);
  const [checkinDate, checkoutDate] = dates;
  const unitTextProps = { color: 'dimmed', span: true };

  const PaymentPrice = () => {
    return (
      <Paper
        className={classes.priceBox}
        p="xl"
        shadow={PAYMENT_BOX_SHADOW}
        radius={PAYMENT_BOX_RADIUS}>
        <Group position="apart">
          <Text color="white">
            <Text span size="md">
              Giá từ{' '}
            </Text>
            <Text span size={25}>
              {price && formatMoney(price)}{' '}
            </Text>
            <Text {...unitTextProps} color="white" size="sm" span>
              {PRICE_UNIT}
            </Text>
          </Text>
        </Group>
      </Paper>
    );
  };

  const renderCalcPrice = (price: string, unit: string) => {
    return (
      <Text className={classes.price}>
        {price}{' '}
        <Text {...unitTextProps} className={classes.priceUnit}>
          {unit}
        </Text>
      </Text>
    );
  };

  const PaymentTotal = () => {
    const totalGridProps = {
      position: 'apart' as GroupPosition,
      pl: 'xs' as MantineNumberSize,
      pr: 'xs' as MantineNumberSize
    };
    return (
      <Stack>
        <Group {...totalGridProps}>
          {renderCalcPrice('200,000', `${PRICE_CURRENCY} x 5 ${PRICE_UNIT}`)}
          {renderCalcPrice('1,000,000', PRICE_CURRENCY)}
        </Group>
        <Group {...totalGridProps}>
          <Text>Phụ phí</Text>
          {renderCalcPrice('50,000', PRICE_CURRENCY)}
        </Group>
        <Divider my="auto" />
        <Group {...totalGridProps}>
          <Text className={classes.label}>{DETAILS_TEXT.SUM_BEFORE_TAX_TEXT.toUpperCase()}</Text>
          {renderCalcPrice('1,050,000', PRICE_CURRENCY)}
        </Group>
      </Stack>
    );
  };

  return (
    <React.Fragment>
      <PaymentPrice />

      <Paper shadow={PAYMENT_BOX_SHADOW} radius={PAYMENT_BOX_RADIUS} p="xl" className={classes.box}>
        <Stack spacing={25}>
          <Stack spacing={15}>
            <DateSelect />
            <Group>
              <Badge color="teal" size="md" variant="filled">
                Số lượng khách
              </Badge>
            </Group>
            <GuestSelectBoxComponent />
          </Stack>

          <PaymentTotal />
          {isForContact ? (
            <Paper className={classes.contactBox} p="md" radius={PAYMENT_BOX_RADIUS}>
              <Text color="white" ta="center" fz="xl">
                Liên Hệ: {phone}
              </Text>
            </Paper>
          ) : (
            <Button
              fullWidth
              className={classes.paymentButton}
              disabled={!checkinDate || !checkoutDate || guestCount < 1}
              onClick={() => router.push('/payment')}>
              {DETAILS_TEXT.BOOK_NOW_TEXT.toUpperCase()}
            </Button>
          )}
        </Stack>
      </Paper>
    </React.Fragment>
  );
}
