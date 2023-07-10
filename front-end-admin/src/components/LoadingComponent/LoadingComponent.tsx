import React from 'react';
import { Center, Loader, Stack, Text } from '@mantine/core';

export default function LoadingComponent() {
  return (
    <Center style={{ height: '100%', width: '100%' }}>
      <Stack>
        <Center>
          <Loader />
        </Center>
        <Text align="center">Vui lòng đợi trong giây lát...</Text>
      </Stack>
    </Center>
  );
}
