import React, { useEffect } from 'react';
import { Container } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import { HEADER_HEIGHT } from '@/constants/theme';
import { Hotels } from '@/utils/types';

import { useDocumentTitle } from '@mantine/hooks';
import VillaCardLanding from '@/components/VillaCardLanding';
import hotelApi from '@/api/hotel';
import { useAppDispatch } from '@redux/store';
import { hotelActions } from '@redux/slices';

export const getStaticProps = async () => {
  let hotels;
  try {
    hotels = await hotelApi.getAllHotels();
  } catch (err) {
    console.error(err);
  }
  if (hotels) {
    return {
      props: { hotels },
      revalidate: 30
    };
  } else {
    return {
      props: {},
      revalidate: 30
    };
  }
};

export default function ProductsPage(props: { hotels: Hotels }) {
  const dispatch = useAppDispatch();
  const { hotels } = props;

  useEffect(() => {
    if (hotels) {
      console.log(hotels);

      dispatch(hotelActions.setHotels(hotels));
    }
  }, [hotels]);

  useDocumentTitle(`Thuê ngay - Tre Bay Booking`);

  const renderHotels = () => {
    return hotels?.map((hotel: any, index: number) => {
      return <VillaCardLanding key={index} index={index} {...hotel} />;
    });
  };

  return (
    <AppShell
      headerSize="xl"
      styles={{ main: { padding: `${HEADER_HEIGHT}px 0px 0px 0px !important` } }}>
      <Container size="xl">
        {/* <Center>
          <HomeTabSelectComponent />
        </Center> */}
        {renderHotels()}
      </Container>
    </AppShell>
  );
}
