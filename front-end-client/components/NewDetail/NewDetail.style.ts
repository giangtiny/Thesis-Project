import { createStyles } from '@mantine/core';
export const useNewDetailStyles = createStyles((theme) => ({
  paper: {
    backgroundColor: theme.colors.gray[0],
    padding: theme.spacing.xs,
    paddingLeft: 700,
    paddingRight: 700,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xs
  },
  mainImage: {
    borderRadius: theme.radius.md
  },
  title: {
    fontFamily: 'Circular, sans-serif',
    color: theme.colors.gray[9],
    marginTop: theme.spacing.md,
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 45
  },
  description: {
    fontFamily: 'Circular, sans-serif',
    color: theme.colors.gray[7],
    marginTop: theme.spacing.xs,
    textAlign: 'center'
  },
  contentWrapper: {
    marginTop: theme.spacing.md
  },
  contentImage: {
    borderRadius: theme.radius.md,
    margin: 'auto',
    marginBottom: theme.spacing.xs,
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  },
  contentText: {
    fontFamily: 'Circular, sans-serif',
    color: theme.colors.gray[9],
    marginBottom: theme.spacing.sm,
    fontSize: theme.fontSizes.lg
  },
  readTime: {
    fontFamily: 'Circular, sans-serif',
    color: theme.colors.gray[6],
    marginTop: theme.spacing.md,
    textAlign: 'center'
  }
}));
