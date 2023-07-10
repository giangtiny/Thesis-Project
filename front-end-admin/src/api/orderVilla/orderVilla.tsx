import { toPercentage } from '@/utils/formats';
import { styles } from '@/utils/toasts';
import { IOrderDataTable, IOrderDetail } from '@/utils/types';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons';
import { api } from '../axios';
import { VILLA } from '@/constants/routes';

const ORDER = 'order';
const INVOICE = 'invoice';

export const getAllOrdersOfVilla = async (villaId: string) => {
  return api
    .get(`${ORDER}${VILLA}/${villaId}`, {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getOrderVillaDetail = async (orderId: string) => {
  return api
    .get(`${ORDER}${VILLA}/${ORDER}`, { params: { orderID: orderId } })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

export const getInvoiceVilla = async (orderType: number, orderId: string) => {
  return api
    .get(`${ORDER}${VILLA}/${INVOICE}`, { params: { orderType: orderType, orderID: orderId } })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

export const createOrderVilla = async (order: IOrderDetail) => {
  console.log('check', order);
  const orderVillaDetail =
  {
    checkIn: order.checkIn ? order.checkIn : new Date().toISOString(),
    checkOut: order.checkOut,
    gmail: order.gmail,
    phoneNumber: order.phoneNumber,
    userName: order.userName,
    numberOfCustomer: order.numberOfCustomer,
    vat: toPercentage(order.vat),
    villaID: order.hotelID,
    orderType: order.orderType,
    userID: order.userID,
    discountInPercentage: toPercentage(order.discountInPercentage as number),
    discountInCash: order.discountInCash,
    paidDeposit: order.paidDeposit,
    typeOfDiscount: order.typeOfDiscount,
    surcharges: order.roomSurcharges,
    createdBy: order.createdBy,
  }
  console.log('post order villa', orderVillaDetail);
  return api
    .post(
      `${ORDER}${VILLA}`,
      { ...orderVillaDetail },
      { params: {} }
    )
    .then((response) => {
      if (typeof response.data === 'string') {
        showNotification({
          title: 'Có lỗi xảy ra!',
          message: response.data,
          icon: <IconX />,
          styles: (theme) => styles('red', theme),
        });
        return null;
      }
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

export const deleteOrderVilla = async (orderId: string) => {
  return api
    .delete(`${ORDER}${VILLA}`, { params: { orderID: orderId } })
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

export const updateOrderVilla = async (order: IOrderDetail) => {
  console.log(order);

  return api
    .put(
      `${ORDER}${VILLA}`,
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

export const getInvoiceVillaByTimeStamp = async (orderType: 0 | 1, orderId: string) => {
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

export const completeOrderVilla = async (order: IOrderDetail) => {
  return api
    .put(
      `${ORDER}${VILLA}`,
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
