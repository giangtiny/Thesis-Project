import { useState, useEffect } from 'react';
import { getAllVilla } from '@/api/villa';
import Layout from '@/components/Layout';
import TableCustom from '@/components/TableCustom';
import { DETAIL, VILLA } from '@/constants/routes';
import { Button, Container, Space, Stack, Center, Loader, Text } from '@mantine/core';
import { VillaProps } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

const data = [];

export default function VillaPage() {
  const navigate = useNavigate();
  const [villas, setVillas] = useState<VillaProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log('updated');

    (async () => {
      const villas = await getAllVilla();
      setVillas(villas ? villas : []);
      setLoading(false);
    })();
  }, []);

  return (
    <Container fluid style={{ paddingTop: 12 }}>
      <Button color="teal" onClick={() => navigate(`${VILLA}/new`, { state: { action: 'new' } })}>
        Thêm mới Villa
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
        <TableCustom assetType="villa" data={villas} />
      )}
    </Container>
  );
}
