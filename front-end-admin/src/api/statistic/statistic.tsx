import { FileWithPath } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import { api } from '../axios';
import { IconCheck, IconX } from '@tabler/icons';
import { styles } from '@/utils/toasts';

const statistic = 'statics/'
const order = 'order/';
const hotel = 'hotel/';
const villa = 'villa/';
const townhouse = 'townhouse/';

export const getStatisticHotel = async (hotelId: string, date: number, month: number, year: number) => {
  return api
    .get(order + hotel + statistic, {
      params: { day: date, month: month, year: year, hotelID: hotelId }
    }
    )
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getStatisticVilla = async (villaId: string, date: number, month: number, year: number) => {
  return api
    .get(order + villa + statistic, {
      params: { day: date, month: month, year: year, villaID: villaId }
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getStatisticTownhouse = async (townhouseId: string, date: number, month: number, year: number) => {
  return api
    .get(order + townhouse + statistic, {
      params: { day: date, month: month, year: year, townhouseID: townhouseId }
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};
