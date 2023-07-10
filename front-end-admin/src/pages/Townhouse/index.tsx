import { useState, useEffect } from 'react';
import { getAllTownhouse } from '@/api/townhouse';
import Layout from '@/components/Layout';
import TableCustom from '@/components/TableCustom';
import { DETAIL, TOWNHOUSE } from '@/constants/routes';
import { Button, Container, Space, Stack, Center, Loader, Text } from '@mantine/core';
import { TownhouseProps } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

const data = [];

export default function TownhousePage() {
  const navigate = useNavigate();
  const [townhouses, setTownhouses] = useState<TownhouseProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log('updated');

    (async () => {
      const townhouses = await getAllTownhouse();
      setTownhouses(townhouses ? townhouses : []);
      setLoading(false);
    })();
  }, []);

  return (
    <Container fluid style={{ paddingTop: 12 }}>
      <Button color="teal" onClick={() => navigate(`${TOWNHOUSE}/new`, { state: { action: 'new' } })}>
        Thêm mới nhà phố
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
        <TableCustom assetType="town-house" data={townhouses} />
      )}
    </Container>
  );
}
