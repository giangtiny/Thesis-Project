import React from 'react';
import { Group, Text, Stack } from '@mantine/core';
import { useInfoTextGroupStyle } from './InfoTextGroup.style';

interface PaymentInfoProps {
  title: string;
  text: string;
}

interface PaymentInfoListProps {
  paymentInfo: PaymentInfoProps[];
}

export default function InfoTextGroupComponent({ paymentInfo }: PaymentInfoListProps) {
  const { classes } = useInfoTextGroupStyle();
  return (
    <Stack spacing={7}>
      {paymentInfo.map((info: PaymentInfoProps, index: number) => (
        <Group position="apart" key={index}>
          <Text color="dimmed">{info.title}</Text>
          <Text size="lg">{info.text}</Text>
        </Group>
      ))}
    </Stack>
  );
}
