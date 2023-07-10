import React from 'react';
import { Stack, TextInput, NumberInput, Button, Transition, Group } from '@mantine/core';
import { useOrderFormContext } from '@/context/hotel';
import { IconEdit } from '@tabler/icons';

export default function OrderGuestInfor({ isUpdating }: { isUpdating?: boolean }) {
  const form = useOrderFormContext();

  return (
    <Stack>
      <TextInput
        label="Họ và tên"
        {...form.getInputProps('userName')}
        placeholder={`Nhập họ và tên khách`}
        error={form.errors.userName}
        description={form.errors.userName}
      />
      <TextInput
        label="Số điện thoại"
        {...form.getInputProps('phoneNumber')}
        placeholder={`Nhập số điện thoại`}
      />
      <TextInput label="Email" {...form.getInputProps('gmail')} placeholder={`Nhập email khách`} />
      <NumberInput {...form.getInputProps('numberOfCustomer')} label="Số lượng khách" />
    </Stack>
  );
}
