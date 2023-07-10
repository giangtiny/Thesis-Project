import React, { useEffect, useState } from 'react';
import { Tooltip, Card, Divider, Group, Text, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';
import { useSelector } from 'react-redux';

import { RecordRoom } from '@/utils/types';
import FormatMoney from '@/utils/formats';
import { getRoomDetail } from '@/api/room';
import { selectInitialRooms, selectMaxRoomOrder, selectRoomSelect } from '@/redux/selectors';
import { useAppDispatch } from '@/redux/store';
import { roomSelectActions } from '@/redux/slices';
import { styles } from '@/utils/toasts';
import { openConfirmModal } from '@mantine/modals';

export default function RoomCard({
  isHourOrder,
  room,
  roomId,
  canSelect,
  canDelete,
}: {
  isHourOrder: boolean;
  room?: RecordRoom;
  roomId?: string;
  canSelect?: boolean;
  canDelete?: boolean;
}) {
  const dispatch = useAppDispatch();
  const { setRoomSelect } = roomSelectActions;
  const [currentRoom, setCurrentRoom] = useState<RecordRoom>();
  const roomsSelected = useSelector(selectRoomSelect);
  const initialRooms = useSelector(selectInitialRooms);
  const isSelected = roomsSelected.includes(currentRoom?.id as string);
  const isInitialRoom = initialRooms.includes(currentRoom?.id as string);
  const maxRoomOrder = useSelector(selectMaxRoomOrder);

  useEffect(() => {
    if (room) {
      setCurrentRoom(room);
    } else if (roomId) {
      (async () => {
        try {
          const room = await getRoomDetail(roomId);
          setCurrentRoom(room);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, []);

  const handleCardClick = () => {
    if (!isSelected && roomsSelected.length >= maxRoomOrder) {
      return showNotification({
        title: 'Có lỗi xảy ra!',
        message: 'Số phòng đạt tối đa cho phép, vui lòng xóa phòng khác và chọn lại',
        icon: <IconX />,
        styles: (theme) => styles('red', theme),
      });
    }
    if (canSelect && currentRoom) {
      dispatch(setRoomSelect(currentRoom.id as string));
    }
  };

  const handleDeleteInitialRoom = () => {
    return openConfirmModal({
      title: 'Xóa phòng',
      centered: true,
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa phòng này khỏi hóa đơn, điều này sẽ gây ảnh hưởng đến hóa đơn.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: () => dispatch(setRoomSelect(currentRoom?.id as string)),
    });
  };
  const isShowRoomNotHaveFeePolicy = ()=>{
    if(isHourOrder)
    return currentRoom?.hourFeePolicies.length
    else return true
  }
 
 
  return (
    isShowRoomNotHaveFeePolicy() ?
    <Tooltip label={isSelected ? 'Xóa' : 'Chọn'}>
      <Card
        withBorder
        p="md"
        radius="md"
        shadow="sm"
        onClick={canSelect ? handleCardClick : undefined}
        style={{
          cursor: canSelect ? 'pointer' : 'auto',
          border: canSelect && isSelected ? '3px solid green' : 'none',
        }}
      >
        <Group position="apart">
          <Group>
            <Text>
              Phòng:{' '}
              <Text span color="red">
                {currentRoom?.roomNo}
              </Text>
            </Text>
            <Divider orientation="vertical" size="sm" />
            <Text>
              Số giường:{' '}
              <Text span color="red">
                {currentRoom?.numberOfBed}
              </Text>
            </Text>
            <Divider orientation="vertical" size="sm" />
            {!isHourOrder &&
              <Text>
                Giá theo ngày:{' '}
                <Text span color="red">
                  {FormatMoney(parseInt(currentRoom?.dayPrice as string))}
                </Text>
              </Text>
            }

          </Group>
          {isInitialRoom && canDelete ? (
            <Button color="red" onClick={handleDeleteInitialRoom}>
              Xóa
            </Button>
          ) : null}
        </Group>
        {isHourOrder &&
          <div>
            <Text>
              Giá theo giờ:{' '}
              {currentRoom?.hourFeePolicies.map((hour, index) => {
                return <Text key={index} span color="red">
                  {hour.hour} giờ - {FormatMoney(hour.fee)}{index < currentRoom?.hourFeePolicies.length - 1 ? '/giờ, ' : '/giờ'}
                </Text>
              })}
            </Text>
          </div>
        }
      </Card>
    </Tooltip>:<></>
  );
}
