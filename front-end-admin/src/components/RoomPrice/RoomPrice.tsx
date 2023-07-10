import React, { useState, useEffect } from 'react';
import { Text, Container, Button, Group, Grid, Title, ActionIcon, Tooltip, Center, Stack, Loader } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { openConfirmModal } from '@mantine/modals';
import { Calendar } from '@mantine/dates';
import { IconTrash, IconEdit } from '@tabler/icons';
import { FEE } from '@/constants/asset';
import { eventInfoModal, weekendInfoModal } from '@/utils/modals';
import { getAllHolidaysOfHotel, getAllHolidaysOfVilla, getAllHolidaysOfTownhouse, deleteHoliday, getAllWeekends } from '@/api/event';
import { ASSET_NAME, ASSET_NUMBER } from '@/constants/asset';
import { EventProps, MonthlyProps, HolidayProps, PriceMonthlyProps } from '@/utils/types';
import FormatOutputDate from '@/utils/formats/FormatDate';
import { useRoomPriceStyles } from './RoomPrice.style';

function getDatesHoliday(data: HolidayProps[]) {
  let len = data.length;
  let DatesEvent: HolidayProps[] = [];
  for (let i = 0; i < len; i++) {
    DatesEvent.push(data[i]);
  }
  return DatesEvent;
}

function isHolidayDay(date: Date, data: HolidayProps[]) {
  let check = false;
  let checkIndex = -1;
  const len = data.length;
  for (let i = 0; i < len; i++) {
    if ((data[i].date.getFullYear() === date.getFullYear() && data[i].date.getMonth() === date.getMonth() && data[i].date.getDate() === date.getDate())) {
      check = true;
      checkIndex = i;
      break;
    }
  }
  return { check: check, index: checkIndex };
}

export default function RoomPrice({
  objectId, assetType
}: {
  objectId: string;
  assetType: 'hotel' | 'villa' | 'town-house'
}) {
  const listNamesOfMonthly = [FEE['saturday'], FEE['sunday'], FEE['normal']];
  const [loadingWeekend, setLoadingWeekend] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [value, setValue] = useState<Date | null>(new Date());
  const { classes, cx } = useRoomPriceStyles();

  const [holidayData, setHolidayData] = useState<HolidayProps[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyProps[]>([]);
  const [dataMonth, setDataMonth] = useState<EventProps[]>([]);

  const handlePickEventModal = (date: Date) => {
    const checkDate = isHolidayDay(date, dataCalendar);
    if (checkDate.check) {
      const holiday: HolidayProps = {
        id: dataCalendar[checkDate.index].id,
        hotelID: dataCalendar[checkDate.index].hotelID,
        villaID: dataCalendar[checkDate.index].villaID,
        townHouseID: dataCalendar[checkDate.index].townHouseID,
        date: dataCalendar[checkDate.index].date,
        name: dataCalendar[checkDate.index].name,
        fee: dataCalendar[checkDate.index].fee,
        promotion: dataCalendar[checkDate.index].promotion,
      }
      eventInfoModal(assetType, objectId, 'update', updated, setUpdated, holiday);
    }
    else {
      const holiday: HolidayProps = {
        id: '',
        hotelID: assetType === 'hotel' ? objectId : '0',
        villaID: assetType === 'hotel' ? objectId : '0',
        townHouseID: assetType === 'hotel' ? objectId : '0',
        date: date,
        name: '',
        fee: 0,
        promotion: 0,
      }
      eventInfoModal(assetType, objectId, 'add', updated, setUpdated, holiday);
    }
  }

  const openDeleteHolidayModal = (holidayId: string) =>
    openConfirmModal({
      title: <Title fz='lg'>Xác nhận xóa sự kiện này?</Title>,
      centered: true,
      children: (
        <Text size="sm">
          Sau khi xóa sẽ không khôi phục được dữ liệu. Bạn có chắc chắn muốn xóa sự kiện này không ?
        </Text>
      ),
      labels: { confirm: 'Xác nhận', cancel: 'Hủy xóa' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        const response = deleteHoliday(holidayId);
        response.then(() => {
          setUpdated(!updated);
        })
      },
    });
  const [dataCalendar, setDataCalendar] = useState<HolidayProps[]>([]);
  useEffect(() => {
    (async () => {
      try {
        let holidays = assetType === 'hotel' ? await getAllHolidaysOfHotel(objectId) :
          assetType === 'villa' ? await getAllHolidaysOfVilla(objectId) :
            await getAllHolidaysOfTownhouse(objectId);
        holidays = holidays.map((item: HolidayProps, index: number) => {
          return { ...item, date: new Date(item.date), fee: (item.fee * 100 >= (Math.floor(item.fee * 100) + 0.01) ? Math.round(item.fee * 10000) / 100 : Math.round(item.fee * 100)), promotion: (item.promotion * 100 >= (Math.floor(item.promotion * 100) + 0.01) ? Math.round(item.promotion * 10000) / 100 : Math.round(item.promotion * 100)) }
        })
        setHolidayData(holidays ? holidays : []);
        setDataCalendar(getDatesHoliday(holidays));
        setLoadingEvent(false)

        let weekends = await getAllWeekends(objectId, ASSET_NUMBER[assetType]);
        console.log(weekends);
        weekends = weekends.map((week: MonthlyProps) => {
          return { ...week, saturdayFee: week.saturdayFee * 100, sundayFee: week.sundayFee * 100, normalDayFee: week.normalDayFee * 100 };
        })
        setMonthlyData(weekends ? weekends : [])
        const len = weekends.length;
        const thisMonth = new Date().getMonth();
        const dataThisMonth: EventProps[] = [];
        dataThisMonth.push({ name: 'Thứ 7', quantity: weekends[thisMonth].saturdayFee });
        dataThisMonth.push({ name: 'Chủ nhật', quantity: weekends[thisMonth].sundayFee });
        dataThisMonth.push({ name: 'Ngày thường', quantity: weekends[thisMonth].normalDayFee });
        setDataMonth(dataThisMonth);
        setLoadingWeekend(false)
      } catch (error) {
        console.log(error);
      }
    })();
  }, [updated]);

  return (
    <Container
      fluid
      ml={0}
      mr={0}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
      }}
    >
      <Grid style={{ margin: 0 }}>
        <Grid.Col span={6} style={{ backgroundColor: 'white' }}>
          <Group>
            <Title fz='xl' style={{ width: '100%' }}>Bảng giá sự kiện</Title>
            <Title fz='md' style={{ width: '100%' }}>Bảng giá theo tháng</Title>
            {loadingWeekend ? (
              <Center style={{ height: '20vh', width: '50vw' }}>
                <Stack>
                  <Loader />
                  <Text align="center">Đang tải...</Text>
                </Stack>
              </Center>
            ) : (
              <DataTable
                style={{ flexGrow: 1, display: 'block' }}
                highlightOnHover
                withBorder
                // fetching={fetcing}
                withColumnBorders
                onRowClick={(event, rowIndex) => {
                  weekendInfoModal(assetType, listNamesOfMonthly[rowIndex], updated, setUpdated, monthlyData);
                }}
                columns={[
                  {
                    accessor: 'name',
                    textAlignment: 'center',
                    title: 'Tên sự kiện'
                  },
                  {
                    accessor: 'quantity',
                    title: '% thay đổi',
                    textAlignment: 'center',
                    render: (record: EventProps, _) => <Text>{record.quantity}%</Text>,
                  },
                ]}
                records={dataMonth}
                noRecordsText="Chưa có giá theo tháng nào."
                idAccessor="name"
              />
            )}

            <Title fz='md' style={{ width: '100%' }}>Bảng giá theo sự kiện</Title>
            {loadingEvent ? (
              <Center style={{ height: '30vh', width: '50vw' }}>
                <Stack>
                  <Loader />
                  <Text align="center">Đang tải...</Text>
                </Stack>
              </Center>
            ) : (
              <DataTable
                style={{ flexGrow: 1, overflow: 'auto', display: 'block', minHeight: holidayData.length === 0 ? '150px' : 'auto' }}
                highlightOnHover
                withBorder
                withColumnBorders
                onRowClick={(event, rowIndex) => {
                  eventInfoModal(assetType, objectId, 'update', updated, setUpdated, event);
                }}
                columns={[
                  {
                    accessor: 'date',
                    title: 'Ngày',
                    textAlignment: 'center',
                    render: (record: HolidayProps, _) => record.date ? <Text>{String(FormatOutputDate(record.date))}</Text> : null,
                  },
                  { accessor: 'name', textAlignment: 'center', title: 'Tên sự kiện' },
                  {
                    accessor: 'fee',
                    title: '% Fee',
                    textAlignment: 'center',
                    render: (record: HolidayProps, _) => (record.fee ? <Text>{record.fee}%</Text> : null),
                  },
                  {
                    accessor: 'promotion',
                    title: '% Promotion',
                    textAlignment: 'center',
                    render: (record: HolidayProps, _) => (record.promotion ? <Text>{record.promotion}%</Text> : null),
                  },
                  {
                    accessor: 'Delete',
                    title: 'Xóa',
                    textAlignment: 'center',
                    render: (record: HolidayProps, _) => (
                      <Group position="center" noWrap>
                        <Tooltip label="Xóa">
                          <ActionIcon
                            color="red"
                            onClick={(e: React.MouseEvent<HTMLElement>) => {
                              e.stopPropagation();
                              openDeleteHolidayModal(record?.id || '');
                            }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    ),
                  }
                ]}
                records={holidayData}
                noRecordsText={`Chưa có sự kiện nào cho ${ASSET_NAME[assetType]} này`}
                idAccessor="id"
              />
            )}

          </Group>
        </Grid.Col>
        <Grid.Col span={6} style={{ backgroundColor: 'white' }}>
          <Container>
            <Title fz='xl'>Lịch</Title>
            <Calendar
              locale="vi"
              value={value}
              onChange={(value) => {
                setValue(value)
                if (value) {
                  const datePicked: Date = value;
                  handlePickEventModal(datePicked);
                }
              }}
              renderDay={(date: Date) => {
                const checkDate = isHolidayDay(date, dataCalendar);
                if (checkDate.check) {
                  return <div>
                    <Text>{String(date.getDate())}</Text>
                    <Group className={classes.dateEvent}>
                      {holidayData[checkDate.index].fee ? <Text className={classes.dateEventFee}>{holidayData[checkDate.index].fee}%</Text> : null}
                      {holidayData[checkDate.index].promotion ? <Text className={classes.dateEventPromotion}>{holidayData[checkDate.index].promotion}%</Text> : null}
                    </Group>
                  </div>
                }
                return <div>
                  <Text>{String(date.getDate())}</Text>
                </div>
              }}
              fullWidth
              size="xl"
              styles={(theme) => ({
                cell: {
                  border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                    }`,
                },
                day: { borderRadius: 0, height: 70, fontSize: theme.fontSizes.lg },
                weekday: { fontSize: theme.fontSizes.lg },
                weekdayCell: {
                  fontSize: theme.fontSizes.xl,
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
                  border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                    }`,
                  height: 70,
                },
              })}
            />
          </Container>
        </Grid.Col>
      </Grid>
    </Container>
  );
}