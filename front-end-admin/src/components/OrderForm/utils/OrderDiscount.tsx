import React, { useEffect } from 'react';
import { Box, SegmentedControl, Group, Space, Button, NumberInput } from '@mantine/core';

import { DISCOUNT_TYPE, DISCOUNT_TYPE_VALUE } from '@/constants/asset';
import { useOrderFormContext } from '@/context/hotel';
import { percentInputProps } from '@/constants/forms';

export default function OrderDiscount() {
  const orderForm = useOrderFormContext();
  const canUpdate = !orderForm.values.isFullyPaid;
  const isPercentage = orderForm.values.typeOfDiscount === DISCOUNT_TYPE_VALUE['percentage'];

  return (
    <Box>
      <SegmentedControl
        value={DISCOUNT_TYPE[orderForm.values.typeOfDiscount]}
        onChange={(value) =>
          //@ts-ignore
          orderForm.setFieldValue('typeOfDiscount', DISCOUNT_TYPE_VALUE[value])
        }
        data={[
          { label: 'Giảm giá theo phần trăm', value: DISCOUNT_TYPE[0] },
          { label: 'Giảm giá theo tiền', value: DISCOUNT_TYPE[1] },
        ]}
        color="teal"
        size="md"
      />
      <Space h="md" />
      {isPercentage ? (
        <NumberInput
          {...percentInputProps}
          {...orderForm.getInputProps('discountInPercentage')}
          placeholder="Nhập % giảm giá"
        />
      ) : (
        <NumberInput
          min={0}
          {...orderForm.getInputProps('discountInCash')}
          placeholder="Nhập tiền giảm giá"
          step={10000}
        />
      )}
    </Box>
  );
}
