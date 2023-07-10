import { getAllHotel } from '@/api/hotel';
import Layout from '@/components/Layout';
import TableCustom from '@/components/TableCustom';
import { HOTEL } from '@/constants/routes';
import { HotelProps } from '@/utils/types';
import { Button, Center, Container, Loader, Space, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    id: '1',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Khách sạn ngàn sao',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 20,
    description: 'abc',
    rooms: [],
  },
  {
    id: '2',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Villa đỉnh cao',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 300,
    description: 'abc',
    rooms: [],
  },
  {
    id: '3',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Nhà phố',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 200,
    description: 'abc',
    rooms: [],
  },
  {
    id: '4',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Nhà phố',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 200,
    description: 'abc',
    rooms: [],
  },
  {
    id: '5',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Nhà phố',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 200,
    description: 'abc',
    rooms: [],
  },
  {
    id: '6',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Nhà phố',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 200,
    description: 'abc',
    rooms: [],
  },
  {
    id: '7',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Nhà phố',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 200,
    description: 'abc',
    rooms: [],
  },
  {
    id: '8',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Nhà phố',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 200,
    description: 'abc',
    rooms: [],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<HotelProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log('updated');

    (async () => {
      const hotels = await getAllHotel();
      setHotels(hotels ? hotels : []);
      setLoading(false);
    })();
  }, []);

  return (
    <Container fluid style={{ paddingTop: 12 }}>
      <Button color="teal" onClick={() => navigate(`${HOTEL}/new`, { state: { action: 'new' } })}>
        Thêm mới Khách sạn
      </Button>
      <Space h="sm" />
      {loading ? (
        <Stack justify="center">
          <Center style={{ width: '100%', height: '100%' }}>
            <Loader size="lg" variant="bars" />
          </Center>

          <Text align="center">Đang tải...</Text>
        </Stack>
      ) : (
        <TableCustom assetType="hotel" data={hotels} />
      )}
    </Container>
  );
}
