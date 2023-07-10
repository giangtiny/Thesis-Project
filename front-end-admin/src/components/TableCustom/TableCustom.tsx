import React, { useState, useEffect } from 'react';
import {
  Text,
  Group,
  Image,
  ActionIcon,
  createStyles,
  Container,
  Badge,
  Tooltip,
} from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons';
import { useTableCustomStyles } from './TableCustom.style';
import TableRoom from '@/components/TableRoom';
import { useNavigate } from 'react-router-dom';
import { AssetProps, AssetType, HotelProps, VillaProps, TownhouseProps } from '@/utils/types';
import { ASSET_TEXT, ASSET_NAME } from '@/constants/asset';
import { DETAIL, DETAIL_ROUTES, HOTEL } from '@/constants/routes';
import { openConfirmModal } from '@mantine/modals';
import { useForceUpdate } from '@mantine/hooks';
import { deleteHotel } from '@/api/hotel';
import { deleteVilla } from '@/api/villa';
import { deleteTownhouse } from '@/api/townhouse';

type TableDataType = VillaProps | HotelProps | TownhouseProps;

export default function TableCustom({
  assetType,
  data,
}: {
  assetType: 'hotel' | 'villa' | 'town-house';
  data: TableDataType[];
}) {
  const { classes } = useTableCustomStyles();
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState<TableDataType[]>(data);

  const handleDelete = (id: string) => {
    if (assetType === ASSET_TEXT.HOTEL) {
      deleteHotel(id).then(() => {
        setCurrentData((prevData) => prevData.filter((data) => data.id !== id));
      });
    }
    if (assetType === ASSET_TEXT.VILLA) {
      deleteVilla(id).then(() => {
        setCurrentData((prevData) => prevData.filter((data) => data.id !== id));
      });
    }
    if (assetType === ASSET_TEXT.TOWN_HOUSE) {
      deleteTownhouse(id).then(() => {
        setCurrentData((prevData) => prevData.filter((data) => data.id !== id));
      });
    }
  };

  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: `Xác nhận xóa ${ASSET_NAME[assetType]}`,
      centered: true,
      children: (
        <Text size="sm">
          Sau khi xóa sẽ không khôi phục được dữ liệu.
          Bạn có chắc chắn muốn xóa {ASSET_NAME[assetType]} này không ?
        </Text>
      ),
      labels: { confirm: 'Xác nhận', cancel: 'Hủy xóa' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleDelete(id),
    });

  return (
    <DataTable
      withBorder
      withColumnBorders
      columns={[
        { accessor: 'id', title: 'ID', render: (_, index) => index + 1 },
        { accessor: 'name', title: 'Tên' },
        { accessor: 'address', title: 'Địa chỉ' },
        {
          accessor: 'totalRoom',
          title: 'Tổng phòng',
          hidden: assetType === ASSET_TEXT.VILLA || assetType === ASSET_TEXT.TOWN_HOUSE,
          render: (record: TableDataType, index) => <Text> {record.totalRoom} phòng</Text>,
        },
        {
          accessor: 'available',
          title: 'Trạng thái',
          textAlignment: 'center',
          hidden: assetType === ASSET_TEXT.HOTEL,
          render: (record: TableDataType, _) =>
            (record.available) ? (
              <Badge color="green">Chưa có khách</Badge>
            ) : (
              <Badge color="yellow">Đang cho thuê</Badge>
            ),
        },
        {
          accessor: 'actions',
          title: <Text mr="xs">Thao tác</Text>,
          textAlignment: 'center',
          render: (record: TableDataType, _) => (
            <Group spacing={4} position="center" noWrap>
              <Tooltip label="Chỉnh sửa thông tin">
                <ActionIcon
                  color="blue"
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation();
                    navigate(`${DETAIL_ROUTES[assetType]}/${record.id}`, {
                      state: { action: 'update' },
                    });
                  }}
                >
                  <IconEdit size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Xóa">
                <ActionIcon
                  color="red"
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation();
                    openDeleteModal(record.id);
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          ),
        },
      ]
      }
      records={currentData}
      highlightOnHover
      onRowClick={(record: TableDataType) => {
        assetType !== 'hotel' &&
          navigate(`${DETAIL_ROUTES[assetType]}/${record.id}`, {
            state: { action: 'update' },
          });;
      }}
      rowExpansion={
        assetType === 'hotel'
          ? { content: ({ record }) => <TableRoom hotelId={record.id} isDropDown /> }
          : undefined
      }
    />
  );
}
