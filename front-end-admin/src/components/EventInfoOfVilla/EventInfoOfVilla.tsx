import { useEffect, useState } from "react";
import { TextInput, Group, Button, PasswordInput, Select, Alert, Text, NumberInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useForm, UseFormReturnType } from "@mantine/form";
import { HolidayProps } from "@/utils/types";
import { DatePicker } from '@mantine/dates';
import { IconCalendar, IconX } from '@tabler/icons';
import { api } from '@/api/axios';
import { addHolidayForVilla, updateHoliday } from "@/api/event";
import { accountFormInputProps } from "@/constants/forms";
import { closeAllModals } from "@mantine/modals";
import { styles } from '@/utils/toasts';

interface FormValues {
  id?: string,
  villaID: string,
  name: string,
  date: Date,
  fee: number,
  promotion: number,
}

export default function EventInfoOfVilla({ objectId, type, holiday, setUpdated, updated }: { objectId: string, type: string, holiday?: HolidayProps, setUpdated: React.Dispatch<React.SetStateAction<boolean>>, updated: boolean }) {

  const handleAddHoliday = async () => {
    if (form.getInputProps('fee').value !== 0 || form.getInputProps('promotion').value !== 0) {
      const holidayData = {
        villaID: objectId,
        name: String(form.getInputProps('name').value),
        date: form.getInputProps('date').value.toISOString(),
        fee: form.getInputProps('fee').value * 0.01,
        promotion: form.getInputProps('promotion').value * 0.01
      }
      const responseData = await addHolidayForVilla(holidayData);
      if (responseData) {
        console.log(responseData);
        setUpdated(!updated);
        closeAllModals();
      }
    }
    else {
      showNotification({
        title: null,
        message: 'Cần có thông tin khuyến mãi hoặc phụ phí',
        icon: <IconX />,
        styles: (theme) => styles('red', theme),
      });
    }
  }
  const handleUpdateHoliday = async () => {
    if (form.getInputProps('fee').value !== 0 || form.getInputProps('promotion').value !== 0) {
      const holidayData = {
        id: holiday?.id || '',
        villaID: objectId,
        name: String(form.getInputProps('name').value),
        date: form.getInputProps('date').value.toISOString(),
        fee: form.getInputProps('fee').value * 0.01,
        promotion: form.getInputProps('promotion').value * 0.01
      }
      const responseData = await updateHoliday(holidayData);
      if (responseData) {
        console.log(responseData);
        setUpdated(!updated);
        closeAllModals();
      }
    }
    else {
      showNotification({
        title: null,
        message: 'Cần có thông tin khuyến mãi hoặc phụ phí',
        icon: <IconX />,
        styles: (theme) => styles('red', theme),
      });
    }
  }
  const form = useForm<FormValues>({
    initialValues: {
      id: '',
      villaID: objectId,
      name: '',
      date: new Date(),
      fee: 0,
      promotion: 0
    },

    validate: {
    },
  });

  useEffect(() => {
    if (type === 'add' && holiday) {
      form.setValues({ ...holiday });
    }
    if (type === 'update' && holiday) {
      form.setValues({ ...holiday, fee: holiday.fee ? holiday.fee : 0, promotion: holiday.promotion ? holiday.promotion : 0 });
    };
  }, [])

  return (
    <>
      <form
        onSubmit={form.onSubmit(type === 'add' ? handleAddHoliday : handleUpdateHoliday)}
      >
        <DatePicker
          locale="vi"
          placeholder="Pick date"
          label="Ngày sự kiện"
          icon={<IconCalendar size={16} />}
          {...form.getInputProps('date')}

        />
        <TextInput
          label="Tên sự kiện"
          placeholder="Nhập tên sự kiện"
          {...form.getInputProps('name')}
        />
        <NumberInput
          mt="0"
          label="Phụ phí (%)"
          defaultValue={0}
          precision={2}
          step={5}
          min={0}
          {...form.getInputProps('fee')}
        />
        <NumberInput
          mt="0"
          label="Khuyến mãi (%)"
          defaultValue={0}
          precision={2}
          step={5}
          min={0}
          {...form.getInputProps('promotion')}
        />
        <Group position="right" mt="md">
          <Button variant="outline" onClick={() => {
            form.reset();
            form.setFieldValue('villaID', objectId);
          }}>
            Reset
          </Button>
          <Button color='teal' type="submit">{type === 'add' ? 'Thêm' : 'Cập nhật'}</Button>
        </Group>
      </form>
    </>
  )
}