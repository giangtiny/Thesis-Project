import { AppShell } from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Container } from '@mantine/core';
import React from 'react';

export default function Profile() {
  return (
    <AppShell>
      <Container p={'xl'}>
        <UserProfile />
      </Container>
    </AppShell>
  );
}
