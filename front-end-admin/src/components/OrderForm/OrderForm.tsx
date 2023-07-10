import React, { useEffect, useState } from 'react';
import {
  Stack,
  Button,
  Divider,
  Group,
  Paper,
  Space,
  Text,
  Box,
  NumberInput,
  SegmentedControl,
  Badge,
  Transition,
  Affix,
} from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

import { OrderFormProvider, useOrderForm } from '@/context/hotel';
import SurchargeTable from '@/components/SurchargeTable';
import RoomCard from '@/components/RoomCard';
import HotelSelect from '@/components/HotelSelect';
import { openConfirmModal, openModal } from '@mantine/modals';
import { IInvoiceDetail, IOrderDetail } from '@/utils/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ORDER_TYPE, percentInputProps } from '@/constants/forms';
import AvailableRoomModal from '../AvailableRoomModal';
import {
  completeOrder,
  createOrder,
  deleteOrder,
  getInvoice,
  getInvoiceByTimeStamp,
  updateOrder,
  getOrderDetail,
} from '@/api/order';
import { createOrderVilla, updateOrderVilla, deleteOrderVilla, completeOrderVilla, getInvoiceVilla } from '@/api/orderVilla';
import { useAppDispatch } from '@/redux/store';
import { roomSelectActions } from '@/redux/slices';
import { useSelector } from 'react-redux';
import { selectMaxRoomOrder, selectRoomSelect } from '@/redux/selectors/roomSelectSelector';
import OrderGuestInfor from './utils/OrderGuestInfor';
import OrderTypeRadio from './utils/OrderTypeRadio';
import OrderDailyInfor from './utils/OrderDailyInfor';
import OrderDiscount from './utils/OrderDiscount';
import { ORDERS, HOTEL, VILLA, TOWNHOUSE } from '@/constants/routes';
import FormatMoney from '@/utils/formats';
import OrderDetail from '@/components/OrderDetail';
import { useForceUpdate } from '@mantine/hooks';
import { ASSET_NAME, ASSET_NUMBER, ASSET_TEXT } from '@/constants/asset';
import { completeOrderTownhouse, createOrderTownhouse, getInvoiceTownhouse, updateOrderTownhouse } from '@/api/orderTownhouse';

const FIELD_NAME = {
  numHourPassed: 'Số giờ đã ở',
  mustPayDeposit: 'Tiền cọc cần trả',
  paidDeposit: 'Tiền cọc đã trả',
  totalSurCharge: 'Tiền phụ phí',
  vat: 'Thuế GTGT',
  discount: 'Giảm giá',
  totalPrice: 'Tổng cộng',
  remain: 'Tiền thu sau',
};

export default function OrderForm({ assetType, orderFormValues }: { assetType: 'hotel' | 'villa' | 'town-house', orderFormValues?: IOrderDetail }) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  // const assetType: 'hotel' | 'villa' | 'town-house' = pathname.includes('hotel') ? 'hotel' : pathname.includes('villa') ? 'villa' : 'town-house';
  const navigate = useNavigate();
  const forceUpdate = useForceUpdate();

  const { action }: { action: string } = location.state ? location.state : '';
  const isCreating: boolean = action === 'new';
  const isUpdating: boolean = action === 'update';
  const maxRoomOrder = useSelector(selectMaxRoomOrder);
  const canUpdate = !(orderFormValues && orderFormValues.isFullyPaid);

  //Will need to be refactored when implement villa and townhouse
  const [hotel, setHotel] = useState<string | null>(
    orderFormValues ? orderFormValues.hotelID : null
  );
  const [invoice, setInvoice] = useState<IInvoiceDetail>();
  const roomsSelected = useSelector(selectRoomSelect);
  const { setInitialRoomSelect, clearRoomSelect, setGroupState } = roomSelectActions;

  const formatNumHourPassed = (numHourPassed: string) => {
    let numHour = numHourPassed.replace("h", ":");
    numHour = numHour.replace("m", ":");
    const hour = numHour.split(':');
    return hour.length < 3 ? 1 : Number(hour[1]) < 15 ? Number(hour[0]) : Number(hour[0]) + 1;
  }

  var paymentData = invoice ?
    {
      mustPayDeposit: invoice?.mustPayDeposit,
      paidDeposit: invoice?.paidDeposit,
      totalSurCharge: invoice.totalSurCharge,
      vat: invoice?.vatInPrice,
      discount: invoice.discount,
      totalPrice: invoice.totalPrice,
      remain: invoice?.remain || 0,
    }
    : {};

  const getCurrentInvoice = async () => {
    console.log('form values: ', orderFormValues);
    if (orderFormValues) {
      if (assetType === ASSET_TEXT.HOTEL) {
        try {
          const invoice = await getInvoice(orderFormValues.orderType, orderFormValues.id as string);
          // console.log('invoice hotel', invoice);
          setInvoice(() => invoice);
        } catch (err) {
          console.log(err);
        }
      }
      if (assetType === ASSET_TEXT.VILLA) {
        try {
          let invoice = await getInvoiceVilla(orderFormValues.orderType, orderFormValues.id as string);
          // console.log('invoice villa', invoice);
          invoice = { ...invoice, price: invoice.villaTownhousePrice }
          setInvoice(() => invoice);
        } catch (err) {
          console.log(err);
        }
      }
      if (assetType === ASSET_TEXT.TOWN_HOUSE) {
        try {
          let invoice = await getInvoiceTownhouse(orderFormValues.orderType, orderFormValues.id as string);
          // console.log('invoice townhouse', invoice);
          invoice = { ...invoice, price: invoice.villaTownhousePrice }
          setInvoice(() => invoice);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  useEffect(() => {
    if (isUpdating && orderFormValues) {
      (async () => {
        await getCurrentInvoice();
      })();
      if (assetType === ASSET_TEXT.HOTEL) {
        dispatch(setInitialRoomSelect(orderFormValues.roomIDs));
        dispatch(setGroupState(orderFormValues.isGroupOrder as boolean));
      }
    }

    return () => {
      if (assetType === ASSET_TEXT.HOTEL) {
        dispatch(clearRoomSelect());
      }
    };
  }, []);

  const timeNowDate = new Date();
  timeNowDate.setHours(0);
  timeNowDate.setMinutes(0);
  timeNowDate.setSeconds(0);
  timeNowDate.setMilliseconds(0);
  const nextDate = new Date(timeNowDate.getTime());
  nextDate.setDate(nextDate.getDate() + 1);
  timeNowDate.setSeconds(1);
  const validationRules = {
    userName: (value: any) => (value.length < 1 ? 'Cần nhập tên khách hàng' : null),
    phoneNumber: (value: any) => (value.length < 1 ? 'Cần nhập số điện thoại khách hàng' : null),
  };
  const orderForm = useOrderForm({
    //@ts-ignore
    initialValues:
      isUpdating && orderFormValues
        ? { ...orderFormValues }
        : {
          userName: '',
          gmail: '',
          phoneNumber: '',
          numberOfCustomer: 1,
          vat: 10,
          roomSurcharges: [],
          surcharges: [],
          hotelID: '',
          villaID: '',
          userID: "000000000000000000000000",
          townhouseID: '',
          roomIDs: [],
          orderType: assetType === ASSET_TEXT.HOTEL ? 1 : ASSET_NUMBER[assetType],
          checkIn: timeNowDate.toISOString(),
          checkOut: nextDate.toISOString(),
          typeOfDiscount: 0,
          discountInCash: 0,
          discountInPercentage: 0,
          isGroupOrder: false,
          paidDeposit: 0,
          createdBy: 'admin',
        },
    validationRules
  });

  const isDirty =
    orderForm.isDirty('userName') ||
    orderForm.isDirty('phoneNumber') ||
    orderForm.isDirty('gmail') ||
    orderForm.isDirty('numberOfCustomer') ||
    orderForm.isDirty('checkOut') ||
    orderForm.isDirty('discountInCash') ||
    orderForm.isDirty('discountInPercentage') ||
    orderForm.isDirty('maxHour') ||
    orderForm.isDirty('vat') ||
    orderForm.isDirty('paidDeposit') ||
    orderForm.isDirty('roomIDs');

  useEffect(() => {
    orderForm.setFieldValue('roomIDs', roomsSelected);
  }, [roomsSelected]);

  useEffect(() => {
    hotel && orderForm.setFieldValue('hotelID', hotel);
  }, [hotel]);

  const handleGetInvoiceByTimeStamp = async () => {
    if (orderFormValues) {
      try {
        const invoice = await getInvoiceByTimeStamp(
          orderFormValues.orderType,
          orderFormValues.id as string
        );
        console.log(invoice);
        setInvoice(() => invoice);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCompleteOrder = async () => {
    if (assetType === ASSET_TEXT.HOTEL) {
      return completeOrder(orderForm.values)
        .then((response) => {
          if (response) {
            navigate(`${ORDERS}${HOTEL}`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (assetType === ASSET_TEXT.VILLA) {
      return completeOrderVilla(orderForm.values)
        .then((response) => {
          if (response) {
            navigate(`${ORDERS}${VILLA}`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      return completeOrderTownhouse(orderForm.values)
        .then((response) => {
          if (response) {
            navigate(`${ORDERS}${TOWNHOUSE}`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

  };

  const PaymentBox = () => (
    <Stack>
      {
        (assetType === ASSET_TEXT.HOTEL && orderFormValues?.orderType == 0) && <div>
          <Group position="apart">
            <Text>{FIELD_NAME['numHourPassed']}</Text>
            <Text style={{ fontWeight: 600 }}>
              {formatNumHourPassed(orderFormValues?.numHourPassed as string)} giờ
            </Text>
          </Group>
          <Divider h="my" />
        </div>
      }
      {
        Object.keys(paymentData).map((key) => (
          <div key={key}>
            <Group position="apart">
              <Text>{FIELD_NAME[key as keyof typeof FIELD_NAME]}</Text>
              <Text style={{ fontWeight: 600 }}>
                {FormatMoney(paymentData[key as keyof typeof paymentData] as number)}
              </Text>
            </Group>
            <Divider h="my" />
          </div>))
      }
      <Space h="md" />
      <Group position="right">
        {canUpdate ? (
          <>
            {/* <Button color="teal" onClick={handleGetInvoiceByTimeStamp}>
              Xem tiền hiện tại
            </Button> */}
            <Button color="teal" onClick={handleCompleteOrder}>
              Hoàn thành thanh toán
            </Button>
          </>
        ) : null}
        <Button
          color="orange"
          onClick={() =>
            openModal({
              children: <OrderDetail assetType={assetType} id={pathname.split('/').at(-1) || ''} invoice={invoice} form={orderForm} />,
              size: '80%',
            })
          }
        >
          In hóa đơn
        </Button>
      </Group>
    </Stack>
  );

  const handleCreateOrder = async () => {
    if (assetType === ASSET_TEXT.HOTEL) {
      if (ORDER_TYPE[orderForm.values.orderType] === 'hour') {
        orderForm.values.checkIn = new Date().toISOString();
        orderForm.values.checkOut = null;
      }
      return createOrder(orderForm.values)
        .then((response) => {
          if (response) {
            navigate(`${ORDERS}${HOTEL}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (assetType === ASSET_TEXT.VILLA) {
      return createOrderVilla(orderForm.values)
        .then((response) => {
          if (response) {
            navigate(`${ORDERS}${VILLA}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      return createOrderTownhouse(orderForm.values)
        .then((response) => {
          if (response) {
            navigate(`${ORDERS}${TOWNHOUSE}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderForm.values.id as string);
      navigate(`${ORDERS}${HOTEL}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateOrder = async () => {

    if (assetType === ASSET_TEXT.HOTEL) {
      if (isUpdating && orderForm.values.roomIDs.length < 1) {
        return openConfirmModal({
          title: 'Xóa đơn',
          centered: true,
          children: (
            <Text size="sm">
              Đơn hiện tại không có phòng, nếu xác nhận cập nhật thì đơn sẽ bị xóa. Bạn có chắc chắn
              muốn xóa đơn này?
            </Text>
          ),
          labels: { confirm: 'Xóa', cancel: 'Hủy' },
          confirmProps: { color: 'red' },
          onConfirm: async () => await handleDeleteOrder(),
        });
      }
      return updateOrder(orderForm.values)
        .then((response) => {
          if (response) {
            orderForm.resetDirty();
            getCurrentInvoice();
          }
        })
        .catch((err) => console.log(err));
    }
    if (assetType === ASSET_TEXT.VILLA) {
      return updateOrderVilla(orderForm.values)
        .then((response) => {
          if (response) {
            orderForm.resetDirty();
            getCurrentInvoice();
          }
        })
        .catch((err) => console.log(err));
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      return updateOrderTownhouse(orderForm.values)
        .then((response) => {
          if (response) {
            orderForm.resetDirty();
            getCurrentInvoice();
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <OrderFormProvider form={orderForm}>
      <Paper p={30} mb={15}>
        <Text weight={600} underline>
          Thông tin khách hàng
        </Text>
        <Space h="md" />
        <OrderGuestInfor isUpdating={isUpdating} />
        <Space h="md" />

        {assetType === 'hotel' && <>
          <OrderTypeRadio disabled={isUpdating} />
          <Space h="md" />
        </>}

        {(ORDER_TYPE[orderForm.values.orderType] === 'hour' && assetType === ASSET_TEXT.HOTEL) ? (
          <NumberInput
            {...orderForm.getInputProps('maxHour')}
            label="Số giờ tối đa"
            placeholder="Nhập số giờ tối đa"
          />
        ) : (
          <OrderDailyInfor isUpdating={isUpdating} assetType={assetType} />
        )}

        <Divider my="lg" />
        <Text weight={600} underline>
          {ASSET_NAME[assetType]}
        </Text>
        <Space h="md" />
        <HotelSelect assetType={assetType} currentHotel={hotel} setCurrentHotel={setHotel} disabled={isUpdating} />
        {assetType === 'hotel' &&
          <>
            <Space h="md" />
            <Group>
              <Text weight={600} underline>
                Phòng thuê
              </Text>
              <Badge color="teal">Có thể chọn {maxRoomOrder} phòng tối đa</Badge>
            </Group>
            <Space h="md" />
            {hotel ? (
              <Box>
                {canUpdate ? (
                  <Button
                    color="teal"
                    onClick={() =>
                      openModal({
                        title: 'Chọn phòng đang trống',
                        children: <AvailableRoomModal isHourOrder={ORDER_TYPE[orderForm.values.orderType] === 'hour'} hotelId={hotel} />,
                        size: '60%',
                      })
                    }
                  >
                    {orderForm.values.roomIDs.length < 1 ? 'Chọn phòng ngay' : 'Cập nhật phòng'}
                  </Button>
                ) : null}
                <Space h="md" />
                <Stack>
                  {orderForm.values.roomIDs.map((roomId) => (
                    <RoomCard isHourOrder={ORDER_TYPE[orderForm.values.orderType] === 'hour'} roomId={roomId} key={roomId} canDelete={canUpdate} />
                  ))}
                </Stack>
              </Box>
            ) : null}
          </>
        }

        <Divider my="lg" />

        <Text weight={600} underline>
          Giảm giá
        </Text>
        <Space h="md" />
        <OrderDiscount />
        <Divider my="lg" />

        <Text weight={600} underline>
          Phụ phí
        </Text>
        <SurchargeTable
          assetType={assetType}
          isUpdating={isUpdating && canUpdate}
          isCreating={isCreating}
          orderForm={orderForm}
          getCurrentInvoice={getCurrentInvoice}
        />
        <Divider my="lg" />

        <Text weight={600} underline>
          Thuế
        </Text>
        <Space h="md" />
        <NumberInput
          {...percentInputProps}
          {...orderForm.getInputProps('vat')}
          placeholder="Nhập % thuế GTGT"
        />
        <Divider my="lg" />

        {isUpdating ? (
          <>
            <Text weight={600} underline>
              Tiền cọc đã trả
            </Text>
            <Space h="md" />
            <NumberInput
              min={0}
              max={orderForm.values.mustPayDeposit}
              {...orderForm.getInputProps('paidDeposit')}
              placeholder="Nhập số tiền cọc khách đã trả"
            />
            <Divider my="lg" />
          </>
        ) : null}

        {isUpdating ? (
          <PaymentBox />
        ) : (
          <Button fullWidth color="teal" type="submit" onClick={handleCreateOrder}>
            Tạo đơn
          </Button>
        )}
      </Paper>
      <Affix position={{ top: 60, right: 30 }}>
        <Transition transition="slide-up" mounted={isUpdating && isDirty && canUpdate}>
          {(transitionStyles) => (
            <Group>
              <Button
                style={transitionStyles}
                color="teal"
                variant="outline"
                onClick={() => orderForm.reset()}
              >
                Hoàn tác
              </Button>
              <Button style={transitionStyles} color="teal" onClick={handleUpdateOrder}>
                Cập nhật hóa đơn
              </Button>
            </Group>
          )}
        </Transition>
      </Affix>
    </OrderFormProvider>
  );
}
