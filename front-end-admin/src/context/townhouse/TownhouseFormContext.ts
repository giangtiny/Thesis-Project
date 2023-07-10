import { TownhouseProps } from '@/utils/types';
import { createFormContext } from '@mantine/form';

// You can give context variables any name
export const [TownhouseFormProvider, useTownhouseFormContext, useTownhouseForm] =
  createFormContext<TownhouseProps>();
