import { styles } from '@/utils/toasts';
import { HolidayProps, WeekendProps, MonthlyProps } from '@/utils/types';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { api } from '../axios';

const holiday = 'holiday/';
const weekend = 'weekend/';
const monthly = 'monthly-fee/'
const hotel = 'hotel/';
const villa = 'villa/';
const townhouse = 'townhouse/';

export const getAllHolidaysOfHotel = async (hotelId: string) => {
  return await api
    .get(holiday + hotel, { params: { hotelID: hotelId } })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllHolidaysOfVilla = async (hotelId: string) => {
  return await api
    .get(holiday + villa, { params: { villaID: hotelId } })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllHolidaysOfTownhouse = async (hotelId: string) => {
  return await api
    .get(holiday + townhouse, { params: { townhouseID: hotelId } })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addHolidayForHotel = async (holidayData: HolidayProps) => {
  return await api
    .post(holiday + hotel, {
      ...holidayData,
      hotelID: holidayData.hotelID,
      name: holidayData.name,
      date: holidayData.date,
      fee: holidayData.fee,
      promotion: holidayData.promotion,
    })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Tạo sự kiện thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addHolidayForVilla = async (holidayData: HolidayProps) => {
  return await api
    .post(holiday + villa, {
      ...holidayData,
      villaID: holidayData.villaID,
      name: holidayData.name,
      date: holidayData.date,
      fee: holidayData.fee,
      promotion: holidayData.promotion,
    })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Tạo sự kiện thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
export const addHolidayForTownhouse = async (holidayData: HolidayProps) => {
  return await api
    .post(holiday + townhouse, {
      ...holidayData,
      townHouseID: holidayData.hotelID,
      name: holidayData.name,
      date: holidayData.date,
      fee: holidayData.fee,
      promotion: holidayData.promotion,
    })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Tạo sự kiện thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateHoliday = async (holidayData: HolidayProps) => {
  return await api
    .put(holiday + holidayData.id, {
      ...holidayData,
      hotelID: holidayData.hotelID,
      villaID: holidayData.villaID,
      townHouseID: holidayData.townHouseID,
      name: holidayData.name,
      date: holidayData.date,
      fee: holidayData.fee,
      promotion: holidayData.promotion,
    })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Cập nhật sự kiện thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteHoliday = async (holidayId: string) => {
  return await api
    .delete(holiday, { data: [holidayId] })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Xóa sự kiện thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response.data;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const getAllWeekends = async (id: string, type: number) => {
  return await api
    .get(monthly, { params: { id: id, type: type } })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateWeekend = async (monthData: MonthlyProps) => {
  return await api
    .put(monthly, {
      ...monthData
    })
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Cập nhật sự kiện thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};
