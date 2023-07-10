import { PRIMARY_COLOR } from '@/constants/theme';
import { createStyles } from '@mantine/core';

export const useCommentCarouselStyle = createStyles((theme, _params, getRef) => ({
  commentCarousel: {
    '&:hover': {
      [`& .${getRef('commentCarouselControls')}`]: {
        opacity: 1
      }
    }
  },

  commentCarouselControls: {
    ref: getRef('commentCarouselControls'),
    transition: 'opacity 150ms ease',
    opacity: 0
  },

  commentCarouselIndicator: {
    width: 4,
    height: 4,
    transition: 'width 250ms ease',

    '&[data-active]': {
      width: 16
    }
  },

  commentCarouselImages: {
    cursor: 'pointer'
  },
  rating: {
    fontSize: 13,
    color: '#fff'
  },
  showMore: {
    width: 'max-content',
    padding: theme.spacing.xs,
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
  }
}));
