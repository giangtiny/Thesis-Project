import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Divider,
  Paper,
  Space,
  Stack,
  Text,
  Title,
  SimpleGrid,
  Avatar
} from '@mantine/core';

import { PRICE_CURRENCY } from '@/constants/prices';
import InfoTextGroupComponent from '@/components/InfoTextGroup';
import { usePaymentInfoStyle } from './PaymentInfo.style';
import { IconCreditCard, IconMacro } from '@tabler/icons';
import { IconMomo } from '@/icons/index';
import { IconVNPay1 } from '@/icons/index';
import PaymentOptionButton from '@/components/PaymentOptionButton';
import Link from 'next/link';
import moment from 'moment';
import queryString from 'query-string';
import { vnpay_config } from './config/vnpay';
import crypto from 'crypto';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
const data = [
  {
    title: 'Giá phòng',
    text: `200.000 ${PRICE_CURRENCY}`
  },
  {
    title: 'Thuế',
    text: `5 %`
  },
  {
    title: 'Số ngày thuê',
    text: `3 ngày`
  },
  {
    title: 'Tổng tiền',
    text: `3.000.000 ${PRICE_CURRENCY}`
  },
  {
    title: 'Cần chi',
    text: `1.500.000 ${PRICE_CURRENCY}`
  }
];

interface VNPayPaymentParams {
  vnp_Amount: number;
  vnp_Command: string;
  vnp_CreateDate: string;
  vnp_CurrCode: string;
  vnp_IpAddr: string;
  vnp_Locale: string;
  vnp_OrderInfo: string;
  vnp_OrderType: string;
  vnp_ReturnUrl: string;
  vnp_TmnCode: string;
  vnp_TxnRef: number;
  vnp_Version: string;
  vnp_SecureHash?: string;
}

const amountString = '600000';
const currency = 'USD';

export default function PaymentInfoComponent() {
  const { classes } = usePaymentInfoStyle();
  const date = new Date();
  const router = useRouter();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  function sortObject(o: any) {
    const sorted: any = {};
    const onlyKey: any = [];
    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        onlyKey.push(key);
      }
    }
    onlyKey.sort();
    Array.from({ length: onlyKey.length }, (elm, idx) => {
      sorted[onlyKey[idx]] = o[onlyKey[idx]];
      return null;
    });
    return sorted;
  }

  const getVNpayUrl = () => {
    const tmnCode = vnpay_config.vnp_TmnCode;
    const secretKey = vnpay_config.vnp_HashSecret;
    const returnUrl = vnpay_config.vnp_ReturnUrl;

    const orderId = createDate;
    const amount: number = 100;

    const orderInfo = 'ok';
    const orderType = 'topup';
    const locale = 'vn';
    const currCode = 'VND';
    const set_vnp_Params: any = {};

    set_vnp_Params['vnp_Version'] = '2.0.1';
    set_vnp_Params['vnp_Command'] = 'pay';
    set_vnp_Params['vnp_TmnCode'] = tmnCode;
    set_vnp_Params['vnp_Locale'] = locale;
    set_vnp_Params['vnp_CurrCode'] = currCode;
    set_vnp_Params['vnp_TxnRef'] = orderId;
    set_vnp_Params['vnp_OrderInfo'] = orderInfo;
    set_vnp_Params['vnp_OrderType'] = orderType;
    set_vnp_Params['vnp_Amount'] = amount * 100;
    set_vnp_Params['vnp_ReturnUrl'] = returnUrl;
    set_vnp_Params['vnp_IpAddr'] = '127.0.0.1';
    set_vnp_Params['vnp_CreateDate'] = createDate;

    const vnp_Params = sortObject(set_vnp_Params);
    console.log(vnp_Params);
    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHashType'] = 'SHA512';
    vnp_Params['vnp_SecureHash'] = secureHash;
    const vnpUrl = vnpay_config.vnp_Url + '?' + queryString.stringify(vnp_Params, { encode: true });
    return vnpUrl;
  };

  const convertToUSD = (amount: string): string => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      throw new Error(`Invalid amount: ${amount}`);
    }
    return (numericAmount / 23000).toFixed(2).toString();
  };

  return (
    <Box>
      <Paper shadow="xs" p="lg" radius="lg">
        <Stack>
          <Text size="lg">Thông tin thanh toán</Text>
          <InfoTextGroupComponent paymentInfo={data} />
          <Divider my="auto" />
          <Text size="lg">Phương thức thanh toán</Text>
          <Link href={getVNpayUrl()}>
            <Button className={classes.paymentButton}>
              <IconVNPay1 height={40} width={40} />
              Thanh toán ngay với VNPay
            </Button>
          </Link>

          <PayPalScriptProvider
            options={{
              'client-id':
                'AUgHUFmlq_WB5YKfW-VyWDziYMoydpF_-8oAJyazWXjeTm5DuXpLiG_6kZR68-_zY_Xpy2INKJMtbRIK'
            }}>
            <PayPalButtons
              style={{ layout: 'horizontal', label: 'pay', tagline: false }}
              disabled={false}
              forceReRender={[amountString, currency, { layout: 'horizontal' }]}
              fundingSource={undefined}
              createOrder={(data, actions) => {
                if (actions.order) {
                  return actions.order
                    .create({
                      purchase_units: [
                        {
                          amount: {
                            currency_code: currency,
                            value: convertToUSD(amountString)
                          }
                        }
                      ]
                    })
                    .then((orderId) => {
                      return orderId;
                    });
                }
                throw new Error('actions.order is undefined');
              }}
              onApprove={function (data, actions) {
                if (actions.order) {
                  return actions.order.capture().then(function () {
                    router.push('/payment-success');
                  });
                }
                throw new Error('actions.order is undefined');
              }}
            />
          </PayPalScriptProvider>
        </Stack>
      </Paper>
    </Box>
  );
}
