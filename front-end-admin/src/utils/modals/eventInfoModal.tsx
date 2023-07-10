import { Text } from '@mantine/core'
import { openModal } from '@mantine/modals';
import EventInfoOfHotel from '@/components/EventInfoOfHotel';
import EventInfoOfVilla from '@/components/EventInfoOfVilla';
import EventInfoOfTownhouse from '@/components/EventInfoOfTownhouse';
import { HolidayProps } from '@/utils/types';

export const eventInfoModal = (assetType: 'hotel' | 'villa' | 'town-house', objectId: string, type: string, updated: boolean, setUpdated: React.Dispatch<React.SetStateAction<boolean>>, holiday?: HolidayProps) => {
  return (
    openModal({
      title: <Text fw={600} fz='lg'>Thông tin sự kiện</Text>,
      children: assetType === 'hotel' ? <EventInfoOfHotel objectId={objectId} type={type} holiday={holiday} setUpdated={setUpdated} updated={updated} /> :
        assetType === 'villa' ? <EventInfoOfVilla objectId={objectId} type={type} holiday={holiday} setUpdated={setUpdated} updated={updated} /> :
          <EventInfoOfTownhouse objectId={objectId} type={type} holiday={holiday} setUpdated={setUpdated} updated={updated} />,
      size: 'lg'
    })
  )
} 