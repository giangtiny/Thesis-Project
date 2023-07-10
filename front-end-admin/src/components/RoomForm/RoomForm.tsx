import React, { Dispatch, SetStateAction } from "react";
import { RecordRoom } from "@/utils/types";
import { useForm } from "@mantine/form";
import { Stack, TextInput, Group, Button } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { roomFormInputProps } from "@/constants/forms";
import { addRoom, updateRoom } from "@/api/room";
import PoliciesTable from "../PoliciesTable";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { styles } from "@/utils/toasts";

export default function RoomForm({ assetId, isCreating, room }: { assetId: string; isCreating?: boolean; room?: RecordRoom }) {
  const form = useForm<RecordRoom>({
    initialValues: room
      ? room
      : {
          roomNo: '',
          numberOfBed: '',
          dayPrice: '',
          blocked: false,
          hotelID: assetId,
          hourFeePolicies: [],
        },
    validate: {
      roomNo: (value: string) => (value.length < 1 ? "Không được để trống số/tên phòng" : null),
      numberOfBed: (value: string) => (/^[1-9][0-9]*$/.test(value) ? null : "Số giường phải là một số lớn hơn 0"),
      dayPrice: (value: string) => (/^[1-9][0-9]*$/.test(value) ? null : "Tiền phòng theo ngày phải là một số lớn hơn 0"),
    },
  });
  const disabled = room && room.status;

  const renderRoomForm = () =>
    roomFormInputProps.map((room) => <TextInput label={room.label} {...form.getInputProps(room.inputProps)} placeholder={room.placeholder} disabled={disabled} key={room.label} />);

  const handleCreateRoom = async () => {
    return addRoom(form.values).then(() => {
      closeAllModals();
    });
  };

  const handleUpdateRoom = async () => {
    return updateRoom(form.values).then(() => {
      closeAllModals();
    });
  };

  return (
    <form onSubmit={form.onSubmit(isCreating ? handleCreateRoom : handleUpdateRoom)}>
      <Stack>
        {renderRoomForm()}
        <PoliciesTable form={form} disabled={disabled} />
        {!isCreating ? (
          <Group position="right">
            <Button color="teal" type="submit" disabled={!form.isDirty() && !form.isTouched("hourFeePolicies")}>
              Cập nhật thông tin
            </Button>
          </Group>
        ) : (
          <Group position="right">
            <Button variant="outline" color="red" onClick={() => closeAllModals()}>
              Hủy
            </Button>
            <Button color="teal" type="submit">
              Tạo phòng
            </Button>
          </Group>
        )}
      </Stack>
    </form>
  );
}
