import { toPercentage } from '@/utils/formats';
import { styles } from '@/utils/toasts';
import { IOrderDataTable, IOrderDetail } from '@/utils/types';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { api } from '../axios';
import { TOWNHOUSE } from '@/constants/routes';

const ORDER = 'order';
const INVOICE = 'invoice';

export const getAllOrdersOfTownhouse = async (townhouseId: string) => {
  return api
    .get(`${ORDER}${TOWNHOUSE}/${townhouseId}`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOrderTownhouseDetail = async (orderId: string) => {
  return api
    .get(`${ORDER}${TOWNHOUSE}/${ORDER}`, { params: { orderID: orderId } })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

export const getInvoiceTownhouse = async (orderType: number, orderId: string) => {
  return api
    .get(`${ORDER}${TOWNHOUSE}/${INVOICE}`, { params: { orderType: orderType, orderID: orderId } })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

export const createOrderTownhouse = async (order: IOrderDetail) => {
  const orderTownhouseDetail =
  {
    checkIn: order.checkIn ? order.checkIn : new Date().toISOString(),
    checkOut: order.checkOut,
    gmail: order.gmail,
    phoneNumber: order.phoneNumber,
    userName: order.userName,
    numberOfCustomer: order.numberOfCustomer,
    vat: toPercentage(order.vat),
    townhouseID: order.hotelID,
    orderType: order.orderType,
    userID: order.userID,
    discountInPercentage: toPercentage(order.discountInPercentage as number),
    discountInCash: order.discountInCash,
    paidDeposit: order.paidDeposit,
    typeOfDiscount: order.typeOfDiscount,
    surcharges: order.roomSurcharges,
    createdBy: order.createdBy,
  }
  console.log('post order townhouse', orderTownhouseDetail);
  return api
    .post(
      `${ORDER}${TOWNHOUSE}`,
      { ...orderTownhouseDetail },
      { params: {} }
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

export const deleteOrderTownhouse = async (orderId: string) => {
  return api
    .delete(`${ORDER}${TOWNHOUSE}`, { params: { orderID: orderId } })
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

export const updateOrderTownhouse = async (order: IOrderDetail) => {
  console.log(order);

  return api
    .put(
      `${ORDER}${TOWNHOUSE}`,
      {
        ...order,
        vat: toPercentage(order.vat),
        discountInPercentage: toPercentage(order.discountInPercentage as number),
      },
      {
        params: { orderID: order.id },
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

export const getInvoiceTownhouseByTimeStamp = async (orderType: 0 | 1, orderId: string) => {
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

export const completeOrderTownhouse = async (order: IOrderDetail) => {
  return api
    .put(
      `${ORDER}${TOWNHOUSE}`,
      {
        ...order,
        vat: toPercentage(order.vat),
        discountInPercentage: toPercentage(order.discountInPercentage as number),
        isFullyPaid: true,
        // checkOut: new Date().toISOString(),
      },
      {
        params: { orderID: order.id },
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
