import React from 'react';
import { UnstyledButton, Text, Group } from '@mantine/core';
import { IconBed } from '@tabler/icons';

import { useHotelRoomStyle } from './HotelRoom.style';
import { RoomProps } from '@/utils/types';
import { useAppDispatch } from '@redux/store';
import { roomActions } from '@redux/slices';
import { useSelector } from 'react-redux';
import { getSelectedRooms } from '@redux/selectors';

export default function HotelRoom(props: RoomProps) {
  const { classes, theme, cx } = useHotelRoomStyle();
  const dispatch = useAppDispatch();
  const { setRoom, unSetRoom } = roomActions;
  const { id, number, beds, available } = props;
  const selectedRooms = useSelector(getSelectedRooms);
  const isSelected = !!selectedRooms.find((room) => room.id === id);

  const getColor = () => {
    switch (beds) {
      case 1:
        return theme.colors.green[6];
      case 2:
        return theme.colors.yellow[6];
      case 3:
        return theme.colors.orange[6];
      default:
        return theme.colors.gray[6];
    }
  };

  const onClick = () => {
    !isSelected ? dispatch(setRoom(props)) : dispatch(unSetRoom(props));
  };

  return (
    <UnstyledButton
      className={cx(classes.item, {
        [classes.roomDisabled]: !available,
        [classes.roomSelected]: isSelected
      })}
      onClick={onClick}>
      <Group spacing={5}>
        {Array(beds)
          .fill(0)
          .map((item: number, index) => {
            return <IconBed key={index} color={getColor()} size={32} />;
          })}
      </Group>

      <Text size="sm" mt={7}>
        P.{number}
      </Text>
    </UnstyledButton>
  );
}
