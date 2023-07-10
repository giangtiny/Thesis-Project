import React from 'react';
import { Container } from '@mantine/core';

import { AppShell } from '@/components/Layout';
import { HEADER_HEIGHT } from '@/constants/theme';
import { useDocumentTitle } from '@mantine/hooks';
import Policy from '@/components/Policy';

// export const getStaticPaths = async () => {
//   const data = [
//     { value: '0', label: 'Chính sách thanh toán' },
//     { value: '1', label: 'Chính sách xử lý khiếu nại' },
//     { value: '2', label: 'Chính đổi trả và hoàn tiền' },
//     { value: '3', label: 'Chính Sách Bảo Mật Thông Tin' }
//   ];
//   const hotelIds = data.map((hotel: any) => ({ params: { id: hotel.value } }));

//   return {
//     paths: hotelIds,
//     fallback: true
//   };
// };

// export const getStaticProps = async (context: GetStaticPropsContext) => {
//   const id = context.params?.id;
//   // const res = await api.get(`hotel/${id}`);
//   // const data = res.data;
//   console.log(id);
//   return {
//     props: { data },
//     revalidate: 30
//   };
// };

export default function Policies() {
  useDocumentTitle(`Chính sách và quy định - Tre Bay Booking`);

  return (
    <AppShell
      headerSize="xl"
      styles={{ main: { padding: `${HEADER_HEIGHT}px 0px 0px 0px !important` } }}>
      <Container size="xl">
        <Policy></Policy>
      </Container>
    </AppShell>
  );
}
