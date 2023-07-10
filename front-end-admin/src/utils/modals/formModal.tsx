import TreBookingForm from '@/components/TreBookingForm';
import { ASSET_NAME } from '@/constants/asset';
import { openModal } from '@mantine/modals';

import { HotelProps, VillaProps } from '../types';

export const openFormModal = (
  assetType: 'hotel' | 'villa' | 'town-house',
  hotel?: HotelProps,
  villa?: VillaProps
) => {
  const assetName = ASSET_NAME[assetType];
  return openModal({
    title: (hotel || villa ? 'Cập nhật chi tiết' : 'Thêm mới') + ' ' + assetName,
    children: <TreBookingForm assetType={assetType} />,
    size: 'lg',
  });
};