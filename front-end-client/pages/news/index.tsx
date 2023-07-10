import React from 'react';
import { Container, Text } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import { HEADER_HEIGHT } from '@/constants/theme';

import { useDocumentTitle } from '@mantine/hooks';
import AllNews from '@/components/AllNews';
import newsApi from '@/api/news';
import { NewsDetailDto } from '@/utils/types';
import config from '@/config/config';
import moment from 'moment';
export const getStaticProps = async () => {
  let news;
  try {
    news = await newsApi.getNewsByPage({ offset: 3, maxPerPage: 35 });
  } catch (err) {
    console.error(err);
  }
  if (news) {
    news = news.map((item: any) => {
      return {
        ...item,
        thumbnail: config.IMAGE_URL + item.thumbnail,
        time: moment(item.time).utc().format('DD-MM-YYYY')
      };
    });
    return {
      props: { news },
      revalidate: 30
    };
  } else {
    return {
      props: {},
      revalidate: 30
    };
  }
};
export default function NewsPage(props: { news: NewsDetailDto[] }) {
  useDocumentTitle(`Thuê ngay - Tre Bay Booking`);

  return (
    <AppShell
      headerSize="xl"
      styles={{ main: { padding: `${HEADER_HEIGHT}px 0px 0px 0px !important` } }}>
      <Text fz="2rem" weight={600} align="center">
        {'TIN TỨC'}
      </Text>
      <Container size="xl">
        <AllNews newData={props.news}></AllNews>
      </Container>
    </AppShell>
  );
}
