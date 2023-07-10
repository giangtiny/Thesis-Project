import { createStyles } from '@mantine/core';

export const useImagesSelectStyles = createStyles((theme) => ({
  image: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'teal 0px 0px 0px 3px',
    },
  },
  imageSelect: {
    boxShadow: 'red 0px 0px 0px 3px',
  },
}));
