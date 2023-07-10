import { createStyles } from '@mantine/core';

export const useTreBookingFormStyle = createStyles((theme) => ({
  dropzoneHide: {
    display: 'none',
  },

  row: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0 4px',
  },

  column: {
    flex: '20%',
    maxWidth: '20%',
    padding: '0 4px',
  },

  img: {
    marginTop: 8,
    verticalAlign: 'middle',
    width: '100%',
  },
}));
