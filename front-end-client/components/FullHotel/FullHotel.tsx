import React from 'react';
import { Container, Text } from '@mantine/core';
import { useSelector } from 'react-redux';

import HotelRoom from '@/components/HotelRoom';
import { Carousel } from '@mantine/carousel';
import { getRooms } from '@redux/selectors';

export default function FullHotel() {
  const hotelRooms = useSelector(getRooms);

  return (
    <>
      {hotelRooms?.map((hotelLevel, index: number) => {
        return (
          <Container key={index}>
            <Text>Floor {index + 1}</Text>
            <Carousel slideSize="10.333333%" slidesToScroll={5} align="start" controlsOffset="xs">
              {hotelLevel.map((room) => {
                const getRoomItemWidth = () => {
                  switch (room.beds) {
                    case 1:
                      return 'auto';
                    case 2:
                      return '20%';
                    default:
                      return '30%';
                  }
                };
                return (
                  <Carousel.Slide w={getRoomItemWidth()} gap="xl" key={room.number}>
                    <HotelRoom {...room} />
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          </Container>
        );
      })}
    </>
  );
}
