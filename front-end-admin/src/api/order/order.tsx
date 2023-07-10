import { toPercentage } from '@/utils/formats';
import { styles } from '@/utils/toasts';
import { IOrderDataTable, IOrderDetail } from '@/utils/types';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { api } from '../axios';
import { ORDER_TYPE, ORDER_TYPE_VALUE } from '@/constants/forms';

const ORDER = 'order';
const ROOM = 'room';
const HOTEL = 'hotel';
const USER = 'user';
const INVOICE = 'invoice';

export const getAllRoomOrdersOfHotel = async (hotelId: string) => {
  return api
    .get(`${ORDER}/${ROOM}/${HOTEL}`, { params: { hotelID: hotelId } })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOrderDetail = async (orderId: string) => {
  return api
    .get(`${ORDER}/${ROOM}/${ORDER}`, { params: { orderID: orderId } })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

// export const getOrderByHourDetail = async (orderId: string) => {
//   return api
//     .put(`${ORDER}/${ROOM}`,
//       {
//         checkOut: new Date().toISOString(),
//       }, { params: { orderID: orderId, orderType: ORDER_TYPE_VALUE.hour } })
//     .then((response) => response.data)
//     .catch((error) => {
//       console.log(error);
//     });
// };

export const updateOrderByHourDetail = async (order: IOrderDetail) => {
  return api
    .put(
      `${ORDER}/${ROOM}`,
      {
        ...order,
        currentTime: new Date().toISOString(),
      },
      {
        params: { orderID: order.id, orderType: order.orderType },
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

export const getInvoice = async (orderType: number, orderId: string) => {
  return api
    .get(`${ORDER}/${INVOICE}`, { params: { orderType: orderType, orderID: orderId } })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

export const createOrder = async (order: IOrderDetail) => {
  return api
    .post(
      `${ORDER}/${ROOM}`,
      {
        ...order,
        checkIn: order.checkIn ? order.checkIn : new Date().toISOString(),
        vat: toPercentage(order.vat),
        discountInPercentage: toPercentage(order.discountInPercentage as number),
      },
      { params: { orderType: order.orderType } }
    )
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Tạo hóa đơn thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response;
    })
    .catch((error) => console.log(error));
};

export const deleteOrder = async (orderId: string) => {
  return api
    .delete(`${ORDER}/${ROOM}`, { params: { orderID: orderId } })
    .then((response) =>
      showNotification({
        title: 'Thành công!',
        message: 'Xóa hóa đơn thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      })
    )
    .catch((error) => console.log(error));
};

export const updateOrder = async (order: IOrderDetail) => {
  console.log(order);

  return api
    .put(
      `${ORDER}/${ROOM}`,
      {
        ...order,
        vat: toPercentage(order.vat),
        discountInPercentage: toPercentage(order.discountInPercentage as number),
      },
      {
        params: { orderID: order.id, orderType: order.orderType },
      }
    )
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Cập nhật hóa đơn thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response;
    })
    .catch((error) => console.log(error));
};

export const updateSurcharge = async (
  orderId: string,
  orderType: 0 | 1,
  roomSurcharges: IOrderDataTable[]
) => {
  return api
    .put(
      `${ORDER}/${ROOM}`,
      { roomSurcharges: roomSurcharges },
      {
        params: { orderID: orderId, orderType: orderType },
      }
    )
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Cập nhật phụ phí thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response;
    })
    .catch((error) => console.log(error));
};

export const getInvoiceByTimeStamp = async (orderType: 0 | 1, orderId: string) => {
  console.log(new Date().toISOString());

  return api
    .get(`${ORDER}/${INVOICE}/timestamp`, {
      params: { orderType: orderType, orderID: orderId, timeStamp: new Date().toISOString() },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

export const completeOrder = async (order: IOrderDetail) => {
  const checkOut = ORDER_TYPE[order.orderType] === 'hour' ?
    new Date().toISOString() : order.checkOut;
  return api
    .put(
      `${ORDER}/${ROOM}`,
      {
        ...order,
        vat: toPercentage(order.vat),
        discountInPercentage: toPercentage(order.discountInPercentage as number),
        isFullyPaid: true,
        checkOut,
      },
      {
        params: { orderID: order.id, orderType: order.orderType },
      }
    )
    .then((response) => {
      showNotification({
        title: 'Thành công!',
        message: 'Thanh toán hóa đơn thành công',
        icon: <IconCheck />,
        styles: (theme) => styles('green', theme),
      });
      return response;
    })
    .catch((error) => console.log(error));
};
