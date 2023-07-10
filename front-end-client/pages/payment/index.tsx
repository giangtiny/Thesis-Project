import React from 'react';
import { Center, Container, Grid, Title, Divider } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import BookingInfoComponent from '@/components/BookingInfo';
import PaymentInfoComponent from '@/components/PaymentInfo';

export default function SignIn() {
  return (
    <AppShell headerSize="lg">
      <Container size="lg">
        <Title order={2}>Xác nhận và thanh toán</Title>
        <Divider my="lg" />
        <Center style={{ width: '100%', height: '100%' }}>
          <Grid gutter={50}>
            <Grid.Col xs={12} sm={12} md={6} lg={7} xl={7}>
              <BookingInfoComponent />
            </Grid.Col>
            <Grid.Col xs={12} sm={12} md={6} lg={5} xl={5}>
              <PaymentInfoComponent />
            </Grid.Col>
          </Grid>
        </Center>
      </Container>
    </AppShell>
  );
}
