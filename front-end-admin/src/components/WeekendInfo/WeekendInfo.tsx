import { useEffect, useState } from "react";
import { TextInput, Group, Button, PasswordInput, Select, Alert, Text, NumberInput } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useForm, UseFormReturnType } from "@mantine/form";
import { updateWeekend } from "@/api/event";
import { ASSET_NUMBER, FEE } from "@/constants/asset";
import { EventProps, MonthlyProps } from "@/utils/types";
import { IconX } from '@tabler/icons';
import { closeAllModals } from "@mantine/modals";

interface FormValues {
  ID?: string,
  month1: number,
  month2: number,
  month3: number,
  month4: number,
  month5: number,
  month6: number,
  month7: number,
  month8: number,
  month9: number,
  month10: number,
  month11: number,
  month12: number,
}

export default function WeekendInfo({ assetType, type, events, setUpdated, updated }: { assetType: 'hotel' | 'villa' | 'town-house', type: string, events: MonthlyProps[], setUpdated: React.Dispatch<React.SetStateAction<boolean>>, updated: boolean }) {
  const form = useForm<FormValues>({
    initialValues: {
      month1: 0,
      month2: 0,
      month3: 0,
      month4: 0,
      month5: 0,
      month6: 0,
      month7: 0,
      month8: 0,
      month9: 0,
      month10: 0,
      month11: 0,
      month12: 0,
    },

    validate: {
    },
  });

  const handleSubmit = () => {
    let check = false;
    (async () => {
      for (let i = 1; i < 13; i++) {
        if (form.isDirty(`month${i}`) ||
          (form.getInputProps(`month${i}`).value === 0 && (
            (type === FEE['saturday'] && events[i - 1].saturdayFee !== 0) ||
            (type === FEE['sunday'] && events[i - 1].sundayFee !== 0) ||
            (type === FEE['normal'] && events[i - 1].normalDayFee !== 0)
          ))) {
          const monthData = {
            hotelID: events[i - 1].hotelID,
            villaID: events[i - 1].villaID,
            townHouseID: events[i - 1].townHouseID,
            feeType: ASSET_NUMBER[assetType],
            month: events[i - 1].month,
            saturdayFee: type === FEE['saturday'] ? form.getInputProps(`month${i}`).value / 100 : events[i - 1].saturdayFee / 100,
            sundayFee: type === FEE['sunday'] ? form.getInputProps(`month${i}`).value / 100 : events[i - 1].sundayFee / 100,
            normalDayFee: type === FEE['normal'] ? form.getInputProps(`month${i}`).value / 100 : events[i - 1].normalDayFee / 100,
          }
          const response = await updateWeekend(monthData);
          if (response?.status === 200) {
            check = true;
          }
        }
      }
      if (check) {
        closeAllModals();
        setUpdated(!updated);
      }
    })();

  }

  useEffect(() => {
    if (type === FEE['normal'] && events) {
      form.setValues({
        month1: events[0].normalDayFee,
        month2: events[1].normalDayFee,
        month3: events[2].normalDayFee,
        month4: events[3].normalDayFee,
        month5: events[4].normalDayFee,
        month6: events[5].normalDayFee,
        month7: events[6].normalDayFee,
        month8: events[7].normalDayFee,
        month9: events[8].normalDayFee,
        month10: events[9].normalDayFee,
        month11: events[10].normalDayFee,
        month12: events[11].normalDayFee
      });
    }
    if (type === FEE['saturday'] && events) {
      form.setValues({
        month1: events[0].saturdayFee,
        month2: events[1].saturdayFee,
        month3: events[2].saturdayFee,
        month4: events[3].saturdayFee,
        month5: events[4].saturdayFee,
        month6: events[5].saturdayFee,
        month7: events[6].saturdayFee,
        month8: events[7].saturdayFee,
        month9: events[8].saturdayFee,
        month10: events[9].saturdayFee,
        month11: events[10].saturdayFee,
        month12: events[11].saturdayFee
      });
    };
    if (type === FEE['sunday'] && events) {
      form.setValues({
        month1: events[0].sundayFee,
        month2: events[1].sundayFee,
        month3: events[2].sundayFee,
        month4: events[3].sundayFee,
        month5: events[4].sundayFee,
        month6: events[5].sundayFee,
        month7: events[6].sundayFee,
        month8: events[7].sundayFee,
        month9: events[8].sundayFee,
        month10: events[9].sundayFee,
        month11: events[10].sundayFee,
        month12: events[11].sundayFee
      });
    };
  }, [])

  return (
    <>
      <form
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <DataTable
          style={{ flexGrow: 1, overflow: 'auto', display: 'block' }}
          withBorder
          withColumnBorders
          minHeight={150}
          noRecordsIcon={<IconX />}
          noRecordsText="Không có dữ liệu"
          columns={[
            {
              accessor: 'id',
              title: 'STT',
              textAlignment: 'center',
              width: '50%',
              render: (_, index) => `Tháng ${index + 1}`,
            },
            {
              accessor: 'fee',
              title: 'Phụ phí (%)',
              textAlignment: 'center',
              width: '50%',
              render: (_, index) => {
                let month = `month${index + 1}`;
                return (
                  <NumberInput
                    defaultValue={form.getInputProps(month).value}
                    {...form.getInputProps(month)}
                    precision={2}
                    step={5}
                    min={-100}
                  />)
              },
            },
          ]}
          records={events}
          idAccessor="id"
        />
        <Group position="right" mt="md">
          <Button variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button color='teal' type="submit">Submit</Button>
        </Group>
      </form>
    </>
  )
}