import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const useVillaCardLandingStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    display: 'flex',
    '&:not(:last-child)': {
      marginBottom: '10%'
    }
  },
  image: {
    width: '60%'
  },
  detail: {
    width: '60%',
    position: 'absolute',
    top: '10%',

    backgroundColor: 'white',
    boxShadow:
      'rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px'
  },

  rating: {
    pointerEvents: 'none',
  },

  title: {
    display: 'block',
    marginBottom: theme.spacing.xs / 2,
    cursor: 'pointer',
    backgroundImage: `linear-gradient(${PRIMARY_COLOR.PRIMARY_LIGHT_GREEN} 0 0)`,
    backgroundPosition: '0 100%',
    backgroundSize: '0% 2px',
    backgroundRepeat: 'no-repeat',
    transition: 'background-size 0.3s, background-position 0s 0.3s',
    '&:hover': {
      backgroundPosition: '100% 100%',
      backgroundSize: '100% 2px'
    }
  },

  action: {
    backgroundColor: theme.colors.gray[0],
    ...theme.fn.hover({
      backgroundColor: theme.colors.gray[1],
      transitionTimingFunction: 'ease-in-out',
      transitionDuration: '0.3s'
    })
  },

  footer: {
    marginTop: theme.spacing.md
  },

  button: {
    backgroundColor: PRIMARY_COLOR.PRIMARY_DARK_GREEN
  }
}));
