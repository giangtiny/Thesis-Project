import { HotelProps } from '@/utils/types';
import { createFormContext } from '@mantine/form';

// You can give context variables any name
export const [HotelFormProvider, useHotelFormContext, useHotelForm] =
  createFormContext<HotelProps>();
