import React, { RefObject } from 'react';
import { Group, Paper, Stack, Text, Space, Container, Divider, Box, Button } from '@mantine/core';
//@ts-ignore
import { ReactComponent as Logo } from '../../assets/logo.svg';
import SurchargeTable from '@/components/SurchargeTable';
import { useOrderDetailStyles } from './OrderDetail.style';
import OrderTotalTable from '../OrderTotalTable';
import { useForm, UseFormReturnType } from '@mantine/form';
import { IOrderDataTable, IOrderDetail } from '@/utils/types';
import { IInvoiceDetail } from '@/utils/types';
import { useReactToPrint } from 'react-to-print';

export default function OrderDetail({ assetType, id, invoice, form }: { assetType: 'hotel' | 'villa' | 'town-house', id: string, invoice?: IInvoiceDetail, form: UseFormReturnType<IOrderDetail> }) {
  const { classes } = useOrderDetailStyles();
  const componentRef = React.createRef<HTMLInputElement>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Button color="teal" onClick={handlePrint}>
        In hóa đơn
      </Button>
      <Paper p={30} mb={15} style={{ position: 'relative' }} ref={componentRef}>
        <Box
          style={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '100%',
            zIndex: 99,
          }}
        >
          <Logo style={{ width: 500, opacity: '0.2' }} />
        </Box>
        <Container>
          <Group position="apart" mb={30}>
            <Stack spacing={10}>
              <Text className={classes.title}>HÓA ĐƠN</Text>
              <Group>
                <Text style={{ fontWeight: 600 }}>Số:</Text>
                <Text>{id}</Text>
              </Group>
              <Group>
                <Text style={{ fontWeight: 600 }}>Ngày:</Text>
                <Text>{new Date().toLocaleDateString()}</Text>
              </Group>
            </Stack>
            <Logo style={{ width: 150 }} />
          </Group>
          <Stack spacing={7}>
            <Text style={{ fontWeight: 600 }}>CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ DU LỊCH TRE BAY</Text>
            <Group>
              <Text style={{ fontWeight: 600 }}>Số điện thoại liên hệ:</Text>
              <Text>0123456789</Text>
            </Group>
            <Group>
              <Text style={{ fontWeight: 600 }}>Địa chỉ:</Text>
              <Text>
                Số 25/1 Thủy Vân, Phường 2, Thành phố Vũng Tàu, Tỉnh Bà Rịa - Vũng Tàu, Việt Nam
              </Text>
            </Group>
          </Stack>
          <Divider my="lg" />
          <Text className={classes.subTitle}>Khách hàng</Text>
          <Space h="md" />
          <Group>
            <Text style={{ fontWeight: 600 }}>Họ tên người đặt:</Text>
            <Text>{invoice?.userName}</Text>
          </Group>
          <Group>
            <Text style={{ fontWeight: 600 }}>Số điện thoại:</Text>
            <Text>{invoice?.phoneNumber}</Text>
          </Group>
          <Group>
            <Text style={{ fontWeight: 600 }}>Email:</Text>
            <Text>{invoice?.gmail}</Text>
          </Group>
          <Divider my="lg" />
          {/* <Text className={classes.subTitle}>Phòng</Text> */}
          {/* <Box>
            <SurchargeTable
              
            />
          </Box> */}
          <Divider my="lg" />
          <Text className={classes.subTitle}>Phụ phí</Text>
          <Box>
            <SurchargeTable
              assetType={assetType}
              isUpdating={false}
              isCreating={false}
              orderForm={form}
              getCurrentInvoice={async () => { }}
            />
          </Box>
          <Divider my="lg" />
          <OrderTotalTable assetType={assetType} invoice={invoice} />
        </Container>
      </Paper>
    </>
  );
}
