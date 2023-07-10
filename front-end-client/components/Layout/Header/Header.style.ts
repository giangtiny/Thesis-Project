import { createStyles } from '@mantine/core';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/theme';

export const useHeaderStyle = createStyles((theme) => ({
  header: {
    borderBottom: `1px solid ${SECONDARY_COLOR}`
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none'
    }
  },

  mainLinks: {
    marginRight: -theme.spacing.md,
    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  mainLink: {
    textTransform: 'uppercase',
    fontSize: 15,
    cursor: 'pointer',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    padding: `12px ${theme.spacing.md}px`,
    fontWeight: 700,
    borderBottom: '2px solid transparent',
    transition: 'border-color 100ms ease, color 100ms ease',
    marginRight: theme.spacing.md,
    '&:hover': {
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      textDecoration: 'none'
    }
  },

  mainLinkActive: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottomColor: PRIMARY_COLOR.PRIMARY_LIGHT_GREEN,
    borderBottomWidth: 3,
    backgroundColor: theme.colors.gray[1]
  }
}));
