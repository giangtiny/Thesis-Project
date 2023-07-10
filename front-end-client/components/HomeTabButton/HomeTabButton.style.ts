import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

const border = '3px solid';

export const useHomeTabButtonStyle = createStyles((theme, _params, getRef) => ({
  button: {
    color: theme.colors.dark[2],
    borderBottom: `${border} white`,
    '&:hover': {
      color: 'black',
      borderBottom: `${border} gray`,
      transition: '0.5s'
    }
  },

  icon: {
    ref: getRef('svg'),
    height: 50,
    width: 50
  },

  buttonActive: {
    color: 'teal',
    borderBottom: `${border} teal`
  },

  buttonSmall: {
    borderBottom: 'none'
  },

  iconSmall: {
    ref: getRef('svg'),
    height: 30,
    width: 30
  }
}));
