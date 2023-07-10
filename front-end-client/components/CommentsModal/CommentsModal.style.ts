import { createStyles } from '@mantine/core';

export const useCommentsModalStyle = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`
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
    marginRight: theme.spacing.sm
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
  ratingInComment: {
    fontSize: '1.35rem'
  },
  ratingInCommentCount: {
    fontSize: '1.35rem'
  },
  date: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray
  }
}));
