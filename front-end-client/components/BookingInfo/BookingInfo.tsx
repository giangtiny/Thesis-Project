import React from 'react';
import { Divider, Group, Image, Stack, Text, Title, Button, TextInput } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectBookedDate, selectGuest } from '@redux/selectors';
import { useBookingInforStyles } from './BookingInfo.style';
import { openModal } from '@mantine/modals';
import Calendar from '../Calendar';
import GuestSelectBoxComponent from '@/components/GuestSelectBox';

export default function BookingInfoComponent() {
  const { classes } = useBookingInforStyles();
  const dates = useSelector(selectBookedDate);
  const guest = useSelector(selectGuest);
  const [checkinDate, checkoutDate] = dates;

  return (
    <Stack>
      <Title order={3}>Thông tin đặt chỗ</Title>
      <Group noWrap>
        <Image
          src="https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI="
          alt="booked-hotel-image"
          width={130}
          radius="md"
        />
        <Stack spacing={5}>
          <Text size="lg">Khách sạn Thủy Vân</Text>
          <Text color="dimmed">Phòng: 101</Text>
          <Text color="dimmed">Địa chỉ: 222/2B Hạ Long, Phường 19, Quận 20, TP.Vũng tàu</Text>
        </Stack>
      </Group>
      <Stack>
        <Title order={5}>Ngày</Title>
        <Group position="apart">
          <Text>
            Ngày {checkinDate?.toLocaleDateString()} - Ngày {checkoutDate?.toLocaleDateString()}
          </Text>
          <Button
            variant="subtle"
            color="green"
            onClick={() => {
              openModal({
                title: 'Chỉnh sửa ngày nhận phòng/ trả phòng',
                children: <Calendar />,
                size: 'xl'
              });
            }}>
            Chỉnh sửa
          </Button>
        </Group>
      </Stack>
      <Stack>
        <Title order={5}>Khách</Title>
        <Group position="apart">
          <Text>
            {guest.elder > 0
              ? guest.children > 0
                ? `${guest.elder} Người lớn - ${guest.children} Trẻ em`
                : `${guest.elder} Người lớn`
              : `${guest.children} Trẻ em`}
          </Text>
          <Button
            variant="subtle"
            color="green"
            onClick={() => {
              openModal({
                title: 'Chỉnh sửa số lượng người',
                children: <GuestSelectBoxComponent />,
                size: 'sm'
              });
            }}>
            Chỉnh sửa
          </Button>
        </Group>
      </Stack>
      <Stack spacing={5}>
        <Title order={5}>Họ và tên</Title>
        <TextInput classNames={{ input: classes.textInput }} />
      </Stack>
      <Stack spacing={5}>
        <Title order={5}>Số điện thoại đặt chỗ</Title>
        <TextInput classNames={{ input: classes.textInput }} />
      </Stack>
      <Stack spacing={5}>
        <Title order={5}>Email</Title>
        <TextInput classNames={{ input: classes.textInput }} />
      </Stack>
      <Divider my="auto" />
      <Title order={3}>Chính sách hủy</Title>
      <Text>
        Miễn phí hủy phòng trước 2:00 chiều trong ngày {checkinDate?.toLocaleDateString()}. Sau khi
        hủy phòng trước 2:00 chiều trong ngày {checkinDate?.toLocaleDateString()} sẽ được hoàn đầy
        đủ tiền cọc. Sau thời gian trên sẽ không hoàn lại tiền cọc
      </Text>
    </Stack>
  );
}
