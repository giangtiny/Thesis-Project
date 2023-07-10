import Layout from '@/components/Layout';
import TableCustom from '@/components/TableCustom';
import { DETAIL, TOWNHOUSE } from '@/constants/routes';
import { Button, Container, Space } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const data = [
  {
    id: '1',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Khách sạn ngàn sao',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 20,
    description: 'abc',
    price: 200000,
    surchargeFee: 10,
    promotion: 0,
    depositPrice: 100000,
    numOfCustomers: 3,
    cancelFee: 10,
    available: false,
  },
  {
    id: '2',
    images: ['https://file4.batdongsan.com.vn/2020/06/03/JGcIp0rf/20200603142344-7089.jpg'],
    name: 'Khách sạn ngàn sao',
    address: ' 222/2B Hạ Long, Phường 19, Quận 20, Thành phó Vũng Tàu',
    totalRoom: 20,
    description: 'abc',
    price: 200000,
    surchargeFee: 10,
    promotion: 0,
    depositPrice: 100000,
    numOfCustomers: 3,
    cancelFee: 10,
    available: true,
  },
];

export default function TownHousePage() {
  const navigate = useNavigate();
  return (
    <Container fluid style={{ paddingTop: 12 }}>
      <Button
        color="teal"
        onClick={() => navigate(`${TOWNHOUSE}/new`, { state: { action: 'new' } })}
      >
        Thêm mới Nhà phố
      </Button>
      <Space h="sm" />
      {/* <TableCustom assetType="town-house" data={data} /> */}
    </Container>
  );
}
