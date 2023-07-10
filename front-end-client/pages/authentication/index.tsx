import React from 'react';
import { Center, Container } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import AuthenticationForm from '@/components/AuthenticationForm';

export default function SignIn() {
  return (
    <AppShell>
      <Center style={{ width: '100%', height: '100%' }}>
        <Container size="xs">
          <AuthenticationForm />
        </Container>
      </Center>
    </AppShell>
  );
}
