import { Text } from '@mantine/core'
import { openModal } from '@mantine/modals';
import WeekendInfo from '@/components/WeekendInfo';
import { EventProps, WeekendProps, MonthlyProps } from '@/utils/types';

export const weekendInfoModal = (assetType: 'hotel' | 'villa' | 'town-house', type: string, updated: boolean, setUpdated: React.Dispatch<React.SetStateAction<boolean>>, events: MonthlyProps[]) => {
  return (
    openModal({
      title: <Text fw={600} fz='lg'>Thông tin hàng tháng</Text>,
      children: <WeekendInfo assetType={assetType} type={type} events={events} setUpdated={setUpdated} updated={updated} />,
      size: 'lg'
    })
  )
}