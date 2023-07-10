import { createStyles } from '@mantine/core';

export const useFullDetailStyle = createStyles((theme) => ({
  title: {
    fontWeight: 600,
    fontSize: 36,
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      fontSize: 25
    }
  },

  rating: {
    fontSize: 13,
    color: '#fff'
  },
  ratingInComment: {
    fontSize: '1.35rem'
  },
  ratingInCommentCount: {
    fontSize: '1.35rem'
  },
  address: {
    fontSize: 14,
    fontWeight: 550
  }
}));
