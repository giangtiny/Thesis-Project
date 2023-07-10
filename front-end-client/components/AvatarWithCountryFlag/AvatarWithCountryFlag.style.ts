import { randomColor } from '@/utils/random';
import { createStyles } from '@mantine/core';

export const useAvatarWithCountryFlagStyle = createStyles((theme) => ({
  MainAva: {
    position: 'relative',
    '& .mantine-Avatar-root': {
      borderRadius: '50%',
      borderWidth: '0.15rem',
      borderStyle: 'solid',
      borderColor: randomColor
    },
    '& img': {
      borderRadius: '50%',
      borderWidth: '0.15rem',
      borderStyle: 'solid',
      borderColor: 'white'
    }
  },
  CountryFlag: {
    position: 'absolute',
    borderRadius: '50%',
    right: '0.2rem',
    bottom: '0.2rem'
  },

  AvaImages: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '#FD7E14'
  }
}));
