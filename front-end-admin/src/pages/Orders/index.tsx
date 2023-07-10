import Layout from '@/components/Layout';
import OrdersTable from '@/components/OrderTable';
import { DETAIL, TOWNHOUSE } from '@/constants/routes';
import { Button, Container, Space } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage({ assetType }: { assetType: 'hotel' | 'villa' | 'town-house' }) {
  return (
    <Container fluid style={{ paddingTop: 12 }}>
      <OrdersTable assetType={assetType} />
    </Container>
  );
}
