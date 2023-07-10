import { createStyles } from '@mantine/core';

export const useGGMapStyle = createStyles((theme) => ({
  icon: {
    transition: 'transform 0.3s, background-color 0.3s',
    '&:hover': {
      transform: 'scale(1.25)',
      color: 'green'
    }
  }
}));
