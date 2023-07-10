import React from 'react';
import { AppShell } from '@/components/Layout';
import { Text } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { GetStaticPropsContext } from 'next';

import FullDetail from '@/components/FullDetail';
import ContactButton from '@/components/ContactButton';
import { CommentDto, HotelProps } from '@/utils/types';
import hotelApi from '@/api/hotel';

export const getStaticPaths = async () => {
  try {
    const hotels = await hotelApi.getAllHotels();
    const hotelIds = hotels?.map((hotel: HotelProps) => ({ params: { id: hotel.id } }));
    return {
      paths: hotelIds,
      fallback: true
    };
  } catch (err) {
    console.error(err);
  }
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params?.id;
  try {
    const hotel = await hotelApi.getHotelById(id as string);
    console.log(hotel);
    const comments = await hotelApi.getAllCommentOfHotel(id as string);

    if (hotel) {
      return {
        props: { hotel, comments },
        revalidate: 30
      };
    } else {
      return {};
    }
  } catch (err) {
    console.error(err);
  }
};
interface Props {
  hotel: HotelProps;
  comments: CommentDto[];
}
export default function Detail(props: Props) {
  console.log(props);
  return (
    <AppShell headerSize="xl">
      {!props.hotel ? (
        <Text>Loading...</Text>
      ) : (
        <FullDetail currentHotel={props.hotel} comments={props.comments} />
      )}
      <ContactButton />
    </AppShell>
  );
}
