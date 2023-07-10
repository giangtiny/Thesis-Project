import * as React from 'react';
import { Text, Container, Grid, Badge, Group, Stack, Title, Select, Button, Divider, } from '@mantine/core'
import { DatePicker } from '@mantine/dates';
import { IconClipboardText, IconCoin } from '@tabler/icons';
import FormatMoney from '@/utils/formats';
import { useState } from 'react';
import ExportExcelButton from '@/components/ExportButton'
import { LIST_MONTH } from '@/constants/select';
import { getFirstAndLastDayOfYear } from '@/utils/time';
import { getStatisticHotel, getStatisticTownhouse, getStatisticVilla } from '@/api/statistic';
import { ASSET_TEXT, TIME_TEXT } from '@/constants/asset';

export default function Stats({
  objectId, assetType
}: {
  objectId: string;
  assetType: 'hotel' | 'villa' | 'town-house'
}) {
  const [dateValue, setDateValue] = useState(new Date());
  const [monthValue, setMonthValue] = useState(null);
  const [typeStatistic, setTypeStatistic] = useState<string>(TIME_TEXT.date)
  const { firstDayOfYear, lastDayOfYear } = getFirstAndLastDayOfYear();
  const [dataStatisticOnline, setDataStatisticOnline] = useState({
    totalPaidDeposit: 0,
    totalRemain: 0,
    totalRevenue: 0,
    performance: 0,
    records: [],
  })
  const [dataStatisticOffline, setDataStatisticOffline] = useState({
    totalPaidDeposit: 0,
    totalRemain: 0,
    totalRevenue: 0,
    performance: 0,
    records: [],
  })
  const [dataExport, setDataExport] = useState<any>([
    { ...dataStatisticOnline },
    { ...dataStatisticOffline },
  ])
  const setDate = (value: any) => {
    setDateValue(value);
    setTypeStatistic(TIME_TEXT.date);
    fetchDataStatistic(value.getDate(), value.getMonth() + 1, value.getFullYear())
      .then(res => {
        const dataExportTemp: any = [];
        res?.data.forEach((data: any) => {
          if (data.createdBy === 'client') {
            setDataStatisticOnline(data);
            dataExportTemp.push({
              createdBy: data.createdBy,
              totalPaidDeposit: data.totalPaidDeposit,
              totalRemain: data.totalRemain,
              totalRevenue: data.totalRevenue,
              performance: data.performance,
              records: data.records,
            })
          }
          if (data.createdBy === 'admin') {
            setDataStatisticOffline(data);
            dataExportTemp.push({
              createdBy: data.createdBy,
              totalPaidDeposit: data.totalPaidDeposit,
              totalRemain: data.totalRemain,
              totalRevenue: data.totalRevenue,
              performance: data.performance,
              records: data.records,
            })
          }
        })
        setDataExport([...dataExportTemp])
      });
  }
  const setMonth = (value: any) => {
    setMonthValue(value);
    setTypeStatistic(TIME_TEXT.month);
    const now = new Date();
    fetchDataStatistic(0, value, now.getFullYear())
      .then(res => {
        const dataExportTemp: any = [];
        res?.data.forEach((data: any) => {
          if (data.createdBy === 'client') {
            setDataStatisticOnline(data);
            dataExportTemp.push({
              createdBy: data.createdBy,
              totalPaidDeposit: data.totalPaidDeposit,
              totalRemain: data.totalRemain,
              totalRevenue: data.totalRevenue,
              performance: data.performance,
              records: data.records,
            })
          }
          if (data.createdBy === 'admin') {
            setDataStatisticOffline(data);
            dataExportTemp.push({
              createdBy: data.createdBy,
              totalPaidDeposit: data.totalPaidDeposit,
              totalRemain: data.totalRemain,
              totalRevenue: data.totalRevenue,
              performance: data.performance,
              records: data.records,
            })
          }
        })
        setDataExport([...dataExportTemp])
      });
  }

  const fetchDataStatistic = async (day: number, month: number, year: number) => {
    if (assetType === ASSET_TEXT.HOTEL) {
      return await getStatisticHotel(objectId, day, month, year)
    }
    if (assetType === ASSET_TEXT.VILLA) {
      return await getStatisticVilla(objectId, day, month, year)
    }
    return await getStatisticTownhouse(objectId, day, month, year)
  }

  React.useEffect(() => {
    const now = new Date();
    fetchDataStatistic(now.getDate(), now.getMonth() + 1, now.getFullYear())
      .then(res => {
        const dataExportTemp: any = [];
        res?.data.forEach((data: any) => {
          if (data.createdBy === 'client') {
            setDataStatisticOnline(data);
            dataExportTemp.push({
              createdBy: data.createdBy,
              totalPaidDeposit: data.totalPaidDeposit,
              totalRemain: data.totalRemain,
              totalRevenue: data.totalRevenue,
              performance: data.performance,
              records: data.records,
            })
          }
          if (data.createdBy === 'admin') {
            setDataStatisticOffline(data);
            dataExportTemp.push({
              createdBy: data.createdBy,
              totalPaidDeposit: data.totalPaidDeposit,
              totalRemain: data.totalRemain,
              totalRevenue: data.totalRevenue,
              performance: data.performance,
              records: data.records,
            })
          }
        })
        setDataExport([...dataExportTemp])
      })
  }, [])

  return (
    <Container
      fluid
      ml={0}
      mr={0}
      style={{
        height: '70vh',
        padding: '8px',
        backgroundColor: 'white'
      }}
    >
      <Title order={4} style={{ paddingTop: '8px' }}>Thống kê của: {typeStatistic === TIME_TEXT.date ? `Ngày ${dateValue.getDate()}/${dateValue.getMonth() + 1}/${dateValue.getFullYear()}` : `Tháng ${monthValue}/${dateValue.getFullYear()}`}</Title>
      <Group>
        <DatePicker
          label="Chọn ngày"
          placeholder="Chọn ngày"
          value={dateValue}
          onChange={setDate}
          maxDate={lastDayOfYear}
          minDate={firstDayOfYear}
          mx="auto"
          maw={400}
          style={{
            margin: '0'
          }}
        />
        <Select
          label="Chọn tháng"
          placeholder="Chọn tháng"
          data={LIST_MONTH}
          onChange={setMonth}
        />
      </Group>
      <Title order={4} style={{ paddingTop: '8px' }}>Đơn hàng trực tuyến</Title>
      <Grid >
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan' }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}
          >
            <Group>
              <IconCoin style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {FormatMoney(dataStatisticOnline.totalPaidDeposit)}
                </Title>
                <Text>
                  Tiền cọc
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}>
            <Group>
              <IconCoin style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {FormatMoney(dataStatisticOnline.totalRemain)}
                </Title>
                <Text>
                  Tiền thu sau
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}>
            <Group>
              <IconCoin style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {FormatMoney(dataStatisticOnline.totalRevenue)}
                </Title>
                <Text>
                  Doanh thu
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'orange', to: 'red', deg: 90 }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}>
            <Group>
              <IconClipboardText style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {(dataStatisticOnline.performance)} Lượt
                </Title>
                <Text>
                  Số lượt đã đặt
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
      </Grid>
      <Divider my="sm" />
      <Title order={4}>Đơn hàng trực tiếp</Title>
      <Grid grow>
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan' }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}
          >
            <Group>
              <IconCoin style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {FormatMoney(dataStatisticOffline.totalPaidDeposit)}
                </Title>
                <Text>
                  Tiền cọc
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}>
            <Group>
              <IconCoin style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {FormatMoney(dataStatisticOffline.totalRemain)}
                </Title>
                <Text>
                  Tiền thu sau
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}>
            <Group>
              <IconCoin style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {FormatMoney(dataStatisticOffline.totalRevenue)}
                </Title>
                <Text>
                  Doanh thu
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
        <Grid.Col span={3}>
          <Badge
            variant="gradient"
            gradient={{ from: 'orange', to: 'red', deg: 90 }}
            style={{ height: '80px', justifyContent: 'space-between', width: '100%', display: 'flex' }}>
            <Group>
              <IconClipboardText style={{ width: '50px', height: '50px' }} />
              <Stack>
                <Title order={4}>
                  {(dataStatisticOffline.performance)} Lượt
                </Title>
                <Text>
                  Số lượt đã đặt
                </Text>
              </Stack>
            </Group>
          </Badge>
        </Grid.Col>
      </Grid>
      <Group style={{ paddingTop: '8px' }}>
        {/* <Button color='teal' onClick={handleExportFileExcel}>Xuất file</Button> */}
        <ExportExcelButton name='Xuất file - Đơn trực tiếp' orderType='offline' type={typeStatistic}
          time={typeStatistic === TIME_TEXT.date ? dateValue : monthValue}
          data={dataExport} />
        <ExportExcelButton name='Xuất file -  Đơn trực tuyến' orderType='online' type={typeStatistic}
          time={typeStatistic === TIME_TEXT.date ? dateValue : monthValue}
          data={dataExport} />
      </Group>

    </Container>
  );
}
