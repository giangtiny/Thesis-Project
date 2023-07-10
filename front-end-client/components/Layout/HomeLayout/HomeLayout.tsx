import React, { ReactNode } from 'react';
import { Container, Center, Space, Grid, Box, Header } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';

import AppShell from '@/components/Layout/Appshell';
import Carousel from '@/components/Carousel';
import HomeTabSelectComponent from '@/components/HomeTabSelect';
import ContactButton from '@/components/ContactButton';
import { HEADER_HEIGHT } from '@/constants/theme';

export default function HomeLayout({ children }: { children: ReactNode }) {
  const [scroll] = useWindowScroll();

  return (
    <AppShell headerSize="xl" isHomePage>
      {/* <Center>
          {scroll.y === 0 ? <HomeTabSelectComponent /> : <Box style={{ height: 100 }} />}
        </Center>
        <Space h="lg" /> */}
      <Carousel
        type="advertises"
        images={[
          'https://www.berjayahotel.com/sites/default/files/colombo_2.jpg',
          'https://bdr.pphotels.com/photo-gallery/high-resolution/index.cfm?&file=_BP_4235.JPG'
        ]}
        link="/"
      />
      <Space h="xl" />
      <Container size="xl">{children}</Container>
      <ContactButton />
    </AppShell>
  );
}
