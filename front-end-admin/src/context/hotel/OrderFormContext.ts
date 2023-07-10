import { createFormContext } from '@mantine/form';
import { IOrderDetail } from '@/utils/types';

// You can give context variables any name
export const [OrderFormProvider, useOrderFormContext, useOrderForm] =
  createFormContext<IOrderDetail>();
