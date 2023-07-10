import { createStyles } from '@mantine/core';
import { PRIMARY_COLOR } from '@/constants/theme';
import { GRADIENTS } from '@/constants/theme/color';

export const useFooterStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xs * 2,
    backgroundImage: theme.fn.gradient(GRADIENTS.LIGHT_DARK_GREEN_195),
    borderTop: `1px solid ${theme.colors.gray[2]}`
  },

  logo: {
    maxWidth: 220,

    [theme.fn.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  description: {
    marginTop: 5,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs,
      textAlign: 'center'
    }
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
      alignItems: 'center'
    }
  },

  groups: {
    display: 'flex',
    flexWrap: 'wrap',

    [theme.fn.smallerThan('sm')]: {
      display: 'none'
    }
  },

  wrapper: {
    width: 'auto',
    marginRight: 50
  },

  link: {
    display: 'block',
    color: theme.colors.gray[3],
    fontSize: theme.fontSizes.sm,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundImage: `linear-gradient(${theme.colors.gray[3]} 0 0)`,
    backgroundPosition: '0 100%',
    backgroundSize: '0% 2px',
    backgroundRepeat: 'no-repeat',
    transition: 'background-size 0.3s, background-position 0s 0.3s',
    '&:hover': {
      backgroundPosition: '100% 100%',
      backgroundSize: '100% 2px'
    }
  },

  linkDisabled: {
    pointerEvents: 'none'
  },

  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xs / 2,
    color: theme.colors.gray[0]
  },

  afterFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTop: `1px solid ${theme.colors.gray[2]}`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column'
    }
  },

  social: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xs
    }
  },

  footerText: {
    color: theme.colors.gray[2],
    fontSize: theme.fontSizes.sm
  }
}));
