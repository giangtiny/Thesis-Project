import { styles } from '@/utils/toasts';
import { RecordRoom } from '@/utils/types';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { api } from '../axios';

const room = 'room/';

export const getAllRooms = async (hotelId: string) => {
  return api
    .get(room + 'all/special', { params: { hotelID: hotelId } })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllRoomsHotel = async (hotelId: string) => {
  return api
    .get(room + 'all', { params: { hotelID: hotelId } })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addRoom = async (roomData: RecordRoom) => {
  return api
    .post(room, {
      ...roomData,
      numberOfBed: parseInt(roomData.numberOfBed),
      dayPrice: parseInt(roomData.dayPrice),
      hourFeePolicies: roomData.hourFeePolicies,
    })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Tạo phòng thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateRoom = async (roomData: RecordRoom) => {
  const { id, ...roomUpdateData } = roomData;
  return api
    .put(room + roomData.id, {
      ...roomUpdateData,
      numberOfBed: parseInt(roomUpdateData.numberOfBed),
      dayPrice: parseInt(roomUpdateData.dayPrice),
      hourFeePolicies: roomUpdateData.hourFeePolicies,
    })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Cập nhật thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteMultipleRooms = async (roomIds: string[]) => {
  return api
    .delete(room, { data: roomIds })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Xóa phòng thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const getAvailableRooms = async (hotelId: string) => {
  return api
    .get(room + 'available', { params: { hotelID: hotelId } })
    .then((response) => {
      console.log(response);

      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRoomDetail = async (roomId: string) => {
  return api
    .get(room + roomId)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};