import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const useVillaCardStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows.md
    }
  },

  rating: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs + 2,
    pointerEvents: 'none'
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
