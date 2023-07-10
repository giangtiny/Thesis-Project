import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container, Group, Tabs, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

import { ASSET_NUMBER, ASSET_TEXT } from '@/constants/asset';
import OrderForm from '@/components/OrderForm';
import { getInvoice, getOrderDetail, updateOrderByHourDetail } from '@/api/order';
import { getOrderVillaDetail } from '@/api/orderVilla';
import LoadingComponent from '@/components/LoadingComponent';
import { IOrderDetail } from '@/utils/types';
import { getOrderTownhouseDetail } from '@/api/orderTownhouse';

export default function OrderDetailPage({ assetType }: { assetType: 'hotel' | 'villa' | 'town-house' }) {
  const params = useParams();
  const { id } = params;
  const [searchParams] = useSearchParams();
  const orderType = searchParams.get('orderType');
  const [loading, setLoading] = useState(true);

  const form = useForm<IOrderDetail>({
    initialValues: {
      userName: '',
      gmail: '',
      phoneNumber: '',
      numberOfCustomer: 0,
      deposit: 0,
      vat: 0,
      roomSurcharges: [],
      surcharges: [],
      roomInvoiceDetails: [],
      hotelID: '',
      villaID: '',
      townhouseID: '',
      roomIDs: [],
      orderType: 0,
      checkIn: new Date().toUTCString(),
      checkOut: '',
      typeOfDiscount: 0,
      discountInCash: 0,
      discountInPercentage: 0,
      numHourPassed: '',
    },
  });

  useEffect(() => {
    if (id && id !== 'new') {
      if (assetType === ASSET_TEXT.HOTEL) {
        getOrderDetail(id)
          .then((order) => {
            if (orderType === '0') {
              updateOrderByHourDetail(order)
                .then((order) => {
                  form.setValues({
                    ...order,
                    vat: order.vat * 100,
                    discountInPercentage: order.discountInPercentage * 100,
                  });
                  console.log(order);
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                });
            }
            else {
              form.setValues({
                ...order,
                vat: order.vat * 100,
                discountInPercentage: order.discountInPercentage * 100,
              });
              console.log(order);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
      if (assetType === ASSET_TEXT.VILLA) {
        getOrderVillaDetail(id)
          .then((order) => {
            form.setValues({
              ...order,
              orderType: ASSET_NUMBER[assetType],
              vat: order.vat * 100,
              discountInPercentage: order.discountInPercentage * 100,
              roomSurcharges: order.surcharges,
            });
            console.log(order);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
      if (assetType === ASSET_TEXT.TOWN_HOUSE) {
        getOrderTownhouseDetail(id)
          .then((order) => {
            form.setValues({
              ...order,
              vat: order.vat * 100,
              orderType: ASSET_NUMBER[assetType],
              discountInPercentage: order.discountInPercentage * 100,
              roomSurcharges: order.surcharges,
            });
            console.log(order);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      }
    } else setLoading(false);
  }, []);

  return (
    <Container fluid style={{ paddingTop: 12 }}>
      {loading ? <LoadingComponent /> : <OrderForm assetType={assetType} orderFormValues={form.values} />}
    </Container>
  );
}
