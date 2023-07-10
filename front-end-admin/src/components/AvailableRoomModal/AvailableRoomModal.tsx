import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Stack } from '@mantine/core';

import RoomCard from '@/components/RoomCard';
import { getAvailableRooms } from '@/api/room';
import { RecordRoom } from '@/utils/types';
import LoadingComponent from '../LoadingComponent';

export default function AvailableRoomModal({ isHourOrder, hotelId }: { isHourOrder: boolean, hotelId: string | null }) {
  const [availableRooms, setAvailableRooms] = useState<RecordRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelId) {
      (async () => {
        try {
          const availableRooms = await getAvailableRooms(hotelId);
          setAvailableRooms(availableRooms);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Stack>
      {loading ? (
        <LoadingComponent />
      ) : (
        availableRooms.map((room) => <RoomCard isHourOrder={isHourOrder} room={room} canSelect key={room.id} canDelete />)
      )}
    </Stack>
  );
}
