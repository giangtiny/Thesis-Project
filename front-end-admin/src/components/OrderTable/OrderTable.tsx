import React, { useState, useEffect } from 'react';
import { Text, Group, ActionIcon, Badge, Tooltip, Button, Select, Space } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconEdit, IconMoodSad, IconPlus, IconTrash } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { DETAIL, DETAIL_ROUTES, HOTEL, ORDERS } from '@/constants/routes';
import FormatMoney from '@/utils/formats';
import { HotelProps, IOrderDetail } from '@/utils/types';
import { getAllHotel } from '@/api/hotel';
import { deleteOrder, getAllRoomOrdersOfHotel, updateOrderByHourDetail } from '@/api/order';
import HotelSelect from '@/components/HotelSelect';
import { ASSET_NAME, ASSET_TEXT, ORDER_TYPE_TEXT } from '@/constants/asset';
import { openConfirmModal } from '@mantine/modals';
import { deleteOrderVilla, getAllOrdersOfVilla } from '@/api/orderVilla';
import { deleteOrderTownhouse, getAllOrdersOfTownhouse } from '@/api/orderTownhouse';
import { ORDER_TYPE_VALUE } from '@/constants/forms';

const PAGE_SIZE = 10;

export default function OrdersTable({
  assetType,
}: {
  assetType: 'hotel' | 'villa' | 'town-house';
}) {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  //will need to be refactored when implement villa and townhouse
  const [records, setRecords] = useState<IOrderDetail[]>([]);
  const [orders, setOrders] = useState<IOrderDetail[]>([]);
  const [currentHotel, setCurrentHotel] = useState<string | null>(null);

  useEffect(() => {
    if (assetType === ASSET_TEXT.HOTEL) {
      (async () => {
        if (currentHotel) {
          try {
            const orders = await getAllRoomOrdersOfHotel(currentHotel);
            console.log(orders);

            setOrders(orders);
            setLoading(false);
          } catch (e) {
            console.log(e);
            setLoading(false);
          }
        }
      })();
    }
    if (assetType === ASSET_TEXT.VILLA) {
      (async () => {
        if (currentHotel) {
          try {
            const orders = await getAllOrdersOfVilla(currentHotel);
            console.log(orders);

            setOrders(orders);
            setLoading(false);
          } catch (e) {
            console.log(e);
            setLoading(false);
          }
        }
      })();
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      (async () => {
        if (currentHotel) {
          try {
            const orders = await getAllOrdersOfTownhouse(currentHotel);
            console.log(orders);

            setOrders(orders);
            setLoading(false);
          } catch (e) {
            console.log(e);
            setLoading(false);
          }
        }
      })();
    }
  }, [currentHotel, assetType]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      setRecords(orders.slice(from, to));
    } else {
      setRecords([]);
    }
  }, [orders, page]);

  // const updateOrderByHour = async (order: IOrderDetail) => {
  //   return await updateOrderByHourDetail(order);
  // }

  const handleDeleteOrder = (orderId: string) => {
    return openConfirmModal({
      title: 'Xóa đơn hàng',
      centered: true,
      children: (
        <Text size="sm">
          Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa đơn hàng này không?
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (assetType === ASSET_TEXT.HOTEL) {
          deleteOrder(orderId)
            .then(() => setOrders((orders) => orders.filter((order) => order.id !== orderId)))
            .catch((err) => console.log(err))
        }
        if (assetType === ASSET_TEXT.VILLA) {
          deleteOrderVilla(orderId)
            .then(() => setOrders((orders) => orders.filter((order) => order.id !== orderId)))
            .catch((err) => console.log(err))
        }
        if (assetType === ASSET_TEXT.TOWN_HOUSE) {
          deleteOrderTownhouse(orderId)
            .then(() => setOrders((orders) => orders.filter((order) => order.id !== orderId)))
            .catch((err) => console.log(err))
        }
      }
    });
  };

  return (
    <React.Fragment>
      <HotelSelect assetType={assetType} currentHotel={currentHotel} setCurrentHotel={setCurrentHotel} />
      <Space h="md" />
      <Button
        mb={15}
        color="teal"
        onClick={() =>
          navigate(`${ORDERS}${DETAIL_ROUTES[assetType]}/new`, {
            state: { action: 'new' },
          })
        }
        rightIcon={<IconPlus />}
      >
        Tạo đơn mới
      </Button>
      <DataTable
        withBorder
        withColumnBorders
        fetching={loading}
        columns={[
          {
            accessor: 'ID',
            title: 'STT',
            width: 30,
            render: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
          },
          { accessor: 'userName', title: 'Họ tên người đặt', ellipsis: true },
          {
            accessor: 'phoneNumber',
            title: 'SĐT',
            textAlignment: 'center',
            render: (record, _) => record.phoneNumber,
          },
          {
            accessor: 'date',
            title: 'Ngày tạo đơn',
            textAlignment: 'center',
            cellsSx: (theme) => ({
              color: theme.colors.green[8],
              background: theme.fn.rgba(theme.colors.red[2], 0.25),
            }),
            render: (record, _) => new Date(record.checkIn as string).toLocaleDateString(),
          },
          {
            accessor: 'orderType',
            title: 'Loại đơn',
            textAlignment: 'center',
            hidden: assetType === 'villa' || assetType === 'town-house',
            render: (record, _) => ORDER_TYPE_TEXT[record.orderType],
          },
          {
            accessor: 'isFullPaid',
            title: 'Trạng thái',
            textAlignment: 'center',
            render: (record, _) =>
              record.isFullyPaid ? (
                <Badge color="green">Đã thanh toán</Badge>
              ) : (
                <Badge color="red">Chưa thanh toán</Badge>
              ),
          },
          {
            accessor: 'actions',
            title: <Text mr="xs">Thao tác</Text>,
            textAlignment: 'center',
            render: (record, _) => (
              <Group spacing={4} position="center" noWrap>
                <Tooltip label="Chỉnh sửa thông tin">
                  <ActionIcon color="blue">
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Xóa">
                  <ActionIcon
                    color="red"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      e.stopPropagation();
                      record.id && handleDeleteOrder(record.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
        highlightOnHover
        striped
        records={records}
        minHeight={150}
        noRecordsText={`Không có đơn cho ${ASSET_NAME[assetType]} này`}
        noRecordsIcon={<IconMoodSad />}
        totalRecords={orders && orders.length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
        paginationText={({ from, to, totalRecords }) =>
          `Đơn ${from} - ${to} của tổng cộng ${totalRecords} đơn`
        }
        onRowClick={(record) => {
          // if (assetType === ASSET_TEXT.HOTEL && record.orderType === ORDER_TYPE_VALUE.hour && record.isFullyPaid != true) {
          //   updateOrderByHourDetail(record)
          //     .then((order) => {
          //       navigate(
          //         `${ORDERS}${DETAIL_ROUTES[assetType]}/${record.id}?orderType=${record.orderType}`,
          //         {
          //           state: { action: 'update' },
          //         }
          //       );
          //     })
          //     .catch((error) => {
          //       console.log(error);
          //       setLoading(false);
          //     });
          // }
          // else {
          (assetType === ASSET_TEXT.HOTEL) &&
            navigate(
              `${ORDERS}${DETAIL_ROUTES[assetType]}/${record.id}?orderType=${record.orderType}`,
              {
                state: { action: 'update' },
              }
            );
          (assetType === ASSET_TEXT.VILLA || assetType === ASSET_TEXT.TOWN_HOUSE) &&
            navigate(
              `${ORDERS}${DETAIL_ROUTES[assetType]}/${record.id}`,
              {
                state: { action: 'update' },
              }
            );
          // }

        }}
        paginationSize="md"
      />
    </React.Fragment>
  );
}
