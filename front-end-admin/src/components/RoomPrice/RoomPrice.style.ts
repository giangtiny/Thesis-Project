import { createStyles } from "@mantine/core";

export const useRoomPriceStyles = createStyles((theme) => ({
    dateEvent: {
      position: 'absolute',
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      color: 'red',
      fontSize: '14px',
      gap: '4px'
    },
    dateEventFee: {
      color: 'green',
      fontSize: '14px',
    },
    dateEventPromotion: {
      color: 'red',
      fontSize: '14px',
    }
}))