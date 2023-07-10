import { VillaProps } from '@/utils/types';
import { createFormContext } from '@mantine/form';

// You can give context variables any name
export const [VillaFormProvider, useVillaFormContext, useVillaForm] =
  createFormContext<VillaProps>();
