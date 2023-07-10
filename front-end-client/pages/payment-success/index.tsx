import { Button, Container, Text, RingProgress, Center, Paper } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import { AppShell } from '@/components/Layout';
import Link from 'next/link';
export default function PaymentSuccess() {
  return (
    <AppShell headerSize={'lg'}>
      <Center>
        <Container size="xl" fluid={true} p={100}>
          <Center>
            <RingProgress
              size={200}
              roundCaps
              thickness={8}
              sections={[{ value: 100, color: 'teal' }]}
              label={
                <Center>
                  <IconCheck size="10rem" stroke={1.5} />
                </Center>
              }
            />
          </Center>
          <Text weight={700} size={50}>
            Bạn đã thanh toán thành công
          </Text>
          <Center>
            <Link href={'.'}>
              <Button color="teal" variant="outline" style={{ marginTop: '16px' }}>
                Quay về trang chủ
              </Button>
            </Link>
          </Center>
        </Container>
      </Center>
    </AppShell>
  );
}
