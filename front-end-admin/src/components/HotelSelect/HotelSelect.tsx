import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Select } from '@mantine/core';
import { useSelector } from 'react-redux';

import { getAllHotel } from '@/api/hotel';
import { getAllVilla } from '@/api/villa';
import { getAllTownhouse } from '@/api/townhouse';
import { HotelProps } from '@/utils/types';
import { useAppDispatch } from '@/redux/store';
import { roomSelectActions } from '@/redux/slices';
import { selectOrderType } from '@/redux/selectors';
import { ORDER_TYPE_VALUE } from '@/constants/forms';
import { ASSET_NAME, ASSET_TEXT } from '@/constants/asset';

export default function HotelSelect({
  assetType,
  currentHotel,
  setCurrentHotel,
  disabled,
}: {
  assetType: 'hotel' | 'villa' | 'town-house';
  currentHotel: string | null;
  setCurrentHotel: Dispatch<SetStateAction<string | null>>;
  disabled?: boolean;
}) {
  const dispatch = useAppDispatch();
  const { setMaxRoomOrder } = roomSelectActions;
  const orderType = useSelector(selectOrderType);
  const [hotels, setHotels] = useState<{ value: string; label: string; maxroomorder: number }[]>(
    []
  );

  const handleChangeHotel = (hotelId: string) => {
    setCurrentHotel(hotelId);
    if (assetType === ASSET_TEXT.HOTEL) {
      const maxRoom = hotels.filter((hotel) => hotel.value === hotelId)[0].maxroomorder;
      dispatch(setMaxRoomOrder(maxRoom));
    }
  };

  useEffect(() => {
    if (assetType === ASSET_TEXT.HOTEL) {
      (async () => {
        try {
          const tempHotels = await getAllHotel();
          let data = tempHotels.map((hotel: HotelProps) => ({
            value: hotel.id,
            label: hotel.name,
            maxroomorder: hotel.dayOrderMaxRoom,
          }));
          setHotels(data);
          setCurrentHotel((currentHotel && data.find((item: any) => item.value === currentHotel)) ? currentHotel : data[0].value);
          dispatch(setMaxRoomOrder(data[0].maxroomorder));
        } catch (e) {
          console.log(e);
        }
      })();
    }
    if (assetType === ASSET_TEXT.VILLA) {
      (async () => {
        try {
          const tempVillas = await getAllVilla();
          let dataVillas = tempVillas.map((villa: HotelProps) => ({
            value: villa.id,
            label: villa.name,
          }));
          let data = [...dataVillas];
          setHotels(data);
          setCurrentHotel((currentHotel && data.find((item: any) => item.value === currentHotel)) ? currentHotel : data[0].value);
        } catch (e) {
          console.log(e);
        }
      })();
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      (async () => {
        try {
          const tempTownhouses = await getAllTownhouse();
          let dataTownhouses = tempTownhouses.map((townhouse: HotelProps) => ({
            value: townhouse.id,
            label: townhouse.name,
          }));
          let data = [...dataTownhouses];
          setHotels(data);
          setCurrentHotel((currentHotel && data.find((item: any) => item.value === currentHotel)) ? currentHotel : data[0].value);
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [assetType]);

  useEffect(() => {
    if (assetType === ASSET_TEXT.HOTEL) {
      if (hotels && currentHotel) {
        const matchHotel = hotels.find((hotel) => hotel.value === currentHotel);
        if (matchHotel) {
          const currenMaxRoomOrder = matchHotel.maxroomorder;
          dispatch(setMaxRoomOrder(currenMaxRoomOrder));
        }
      }
    }
  }, [orderType]);

  return (
    <Select
      data={hotels}
      value={currentHotel}
      onChange={handleChangeHotel}
      label={`Chọn ${ASSET_NAME[assetType]}`}
      disabled={disabled}
    />
  );
}
