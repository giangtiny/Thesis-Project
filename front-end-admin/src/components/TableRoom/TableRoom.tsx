import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Text, Container, Badge, Button, Space, Group, Checkbox } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { openConfirmModal, openModal } from '@mantine/modals';

import FormatMoney from '@/utils/formats';
import { RecordRoom } from '@/utils/types';
import RoomForm from '@/components/RoomForm';
import { deleteMultipleRooms, getAllRooms, updateRoom } from '@/api/room';

const PAGE_SIZE = 10;

export default function TableRoom({
  hotelId,
  isDropDown,
}: {
  hotelId: string;
  isDropDown?: boolean;
}) {
  const [reload, setReload] = useState(false);
  const [rooms, setRooms] = useState<RecordRoom[]>([]);
  const [records, setRecords] = useState<RecordRoom[]>([]);
  const [page, setPage] = useState(1);
  const [roomSelected, setRoomSelected] = useState<RecordRoom[]>([]);
  const [fetcing, setFetching] = useState<boolean>(true);
  const location = useLocation();
  const { action }: { action: string } = location.state ? location.state : '';
  const isCreating: boolean = action === 'new';

  useEffect(() => {
    (async () => {
      try {
        const rooms = await getAllRooms(hotelId);
        setRooms(rooms ? rooms : []);
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;
        setRecords(rooms.slice(from, to));
        setFetching(false);
      } catch (error) {
        console.log(error);
        setFetching(false);
      }
    })();
  }, [reload]);

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(rooms.slice(from, to));
  }, [page, rooms]);

  const handleDeleteMultipleRooms = async () => {
    const roomIds = roomSelected.map((room) => room.id);
    return openConfirmModal({
      title: "Xóa phòng",
      centered: true,
      children: (
        <Text size="sm">
          Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa những
          phòng này không?
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: async () =>
        deleteMultipleRooms(roomIds as string[]).then(() => {
          setFetching(true);
          getAllRooms(hotelId)
            .then((rooms) => {
              setRooms(rooms);
              setFetching(false);
              setRoomSelected([]);
            })
            .catch(() => {
              setFetching(false);
            });
        }),
    });
  };

  const handleUpdateRoom = async (roomData: RecordRoom) => {
    return await updateRoom(roomData);
  };

  return (
    <Container fluid ml={0} mr={0} p={0}>
      {!isDropDown ? (
        <Group mb={10}>
          <Button
            color="teal"
            onClick={() =>
              openModal({
                title: 'Thêm phòng',
                size: 'xl',
                closeOnClickOutside: false,
                closeOnEscape: false,
                children: <RoomForm isCreating assetId={hotelId} />,
                onClose: async () =>
                  getAllRooms(hotelId).then((rooms) => {
                    setRooms(() => rooms);
                  }),
              })
            }
          >
            Thêm phòng
          </Button>
          {roomSelected.length > 0 ? (
            <Button color="red" onClick={handleDeleteMultipleRooms}>
              Xóa phòng
            </Button>
          ) : null}
          <Space h="sm" />
        </Group>
      ) : null}
      <DataTable
        style={{ flexGrow: 1, overflow: 'auto', display: 'block' }}
        highlightOnHover
        withBorder
        fetching={fetcing}
        minHeight={200}
        withColumnBorders
        selectedRecords={roomSelected}
        onSelectedRecordsChange={setRoomSelected}
        totalRecords={rooms.length}
        recordsPerPage={PAGE_SIZE}
        page={page}
        onPageChange={(p) => setPage(p)}
        paginationText={({ from, to, totalRecords }) =>
          `Phòng ${from} - ${to} của tổng cộng ${totalRecords} phòng`
        }
        onRowClick={(room, rowIndex) => {
          openModal({
            title: 'Chi tiết phòng',
            size: 'xl',
            children: <RoomForm room={room} assetId={hotelId} />,
            onClose: async () =>
              getAllRooms(hotelId).then((rooms) => {
                setRooms(() => rooms);
              }),
          });
        }}
        columns={[
          {
            accessor: 'id',
            title: 'STT',
            textAlignment: 'center',
            render: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
          },
          { accessor: 'roomNo', textAlignment: 'center', title: 'Số phòng' },
          {
            accessor: 'numberOfBeds',
            title: 'Kiểu phòng',
            render: (record: RecordRoom, _) => <Text>{record.numberOfBed} giường ngủ</Text>,
          },
          {
            accessor: 'dayPrice',
            title: 'Giá phòng theo ngày',
            render: (record: RecordRoom, _) => (
              <Text color="red">{FormatMoney(parseInt(record.dayPrice))}/ngày</Text>
            ),
          },
          {
            accessor: 'available',
            title: 'Trạng thái',
            textAlignment: 'center',
            render: (record: RecordRoom, _) =>
              !record.status ? (
                <Badge color="green">Chưa có khách</Badge>
              ) : (
                <Badge color="yellow">Đang cho thuê</Badge>
              ),
          },
          {
            accessor: "blocked",
            title: "Khóa phòng",
            textAlignment: "center",
            render: (record: RecordRoom, _) => (
              <Checkbox
                checked={record.blocked}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  console.log('check',e);
                  const update = handleUpdateRoom({...record, blocked: e.target.checked});
                  update.then(() => {
                    setReload(!reload);
                  });
                }}
              />
            ),
          },
        ]}
        records={records}
        noRecordsText="Chưa có phòng nào cho khách sạn này"
      />
    </Container>
  );
}
