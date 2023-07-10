import { UseFormReturnType } from '@mantine/form';
import { AssetType, HotelProps, VillaProps } from './assetType';

export interface FormProps {
  assetType: 'hotel' | 'villa' | 'town-house';
}
