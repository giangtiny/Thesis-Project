import { createStyles } from '@mantine/core';

export const useImagePreviewStyle = createStyles((theme) => ({
  icon: {
    transition: 'transform 0.3s, background-color 0.3s',
    '&:hover': {
      transform: 'scale(1.25)',
      color: '#FBBC06'
    }
  }
}));
