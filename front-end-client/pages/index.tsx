import { ReactElement } from 'react';
import { Button, useMantineTheme, SimpleGrid, Group, Space, Stack, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useDocumentTitle, useMediaQuery } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { wrapper } from '@redux/store';
import { useRouter } from 'next/router';

import VillaCard from '@/components/VillaCard';
import { selectHotels } from '@redux/selectors';
import { VillaCardProps } from '@/utils/types';
import HomeLayout from '@/components/Layout/HomeLayout';
import { IconArrowRight } from '@tabler/icons';
import HomeFeature from '@/components/HomeFeature';
import HomeSectionTitle from '@/components/HomeSectionTitle';
import { NextPageWithLayout } from './_app';

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  return {
    props: {},
    revalidate: 30
  };
});

const Home: NextPageWithLayout = () => {
  const hotels = useSelector(selectHotels);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const router = useRouter();

  useDocumentTitle('Trang chủ - Tre Bay Booking');

  const slides = hotels.slice(0, 2).map((item: VillaCardProps) => (
    <Carousel.Slide key={item.id}>
      <VillaCard {...item} />
    </Carousel.Slide>
  ));

  return (
    <>
      <HomeSectionTitle badge="Đa dạng điểm đến" label="Trải nghiệm cùng chúng tôi" />
      <HomeFeature />
      <Space h="xl" />
      <HomeSectionTitle badge="Đa dạng điểm đến" label="Điểm đến nổi bật" />
      <SimpleGrid cols={3} spacing="xl" mt={30} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
        {hotels.map((hotel: VillaCardProps, index: number) => (
          <VillaCard {...hotel} key={index} size="md" />
        ))}
      </SimpleGrid>

      <Space h="md" />
      <Group position="right">
        <Button
          variant="subtle"
          color="teal"
          rightIcon={<IconArrowRight />}
          size="lg"
          onClick={() => router.push('/products')}>
          Xem tất cả
        </Button>
      </Group>
      <Space h="md" />
      {/* <HomeSectionTitle badge="Nhiều ưu đãi hấp dẫn" label="Bài viết mới" /> */}
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
