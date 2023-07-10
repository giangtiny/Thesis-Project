import { createStyles } from '@mantine/core';

export const useCommentStyle = createStyles((theme) => ({
  comment: {
    marginTop: theme.spacing.md
  },

  body: {
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    color: theme.colors.gray
  },

  content: {
    '& > p': {
      marginBottom: theme.spacing.sm,
      '&:last-child': {
        marginBottom: 0
      }
    }
  },

  avatar: {
    marginRight: theme.spacing.sm - 15
  },

  authorInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  rating: {
    fontSize: 13,
    color: '#fff'
  },
  authorName: {
    fontWeight: 500,
    fontSize: theme.fontSizes.md,
    color: theme.colors.gray
  },

  date: {
    display: 'flex',
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray
  }
}));
