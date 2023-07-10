import React from 'react';
import { Container } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import { HEADER_HEIGHT } from '@/constants/theme';
import { useDocumentTitle } from '@mantine/hooks';
import Policy from '@/components/Policy';

export default function Policies() {
  useDocumentTitle(`Chính sách và quy định - Tre Bay Booking`);

  return (
    <AppShell
      headerSize="xl"
      styles={{ main: { padding: `${HEADER_HEIGHT}px 0px 0px 0px !important` } }}>
      <Container size="xl">
        <Policy></Policy>
      </Container>
    </AppShell>
  );
}
