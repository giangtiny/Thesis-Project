import { createStyles } from '@mantine/core';
export const useCarouselStyle = createStyles((theme, _params, getRef) => ({
  carousel: {
    '&:hover': {
      [`& .${getRef('carouselControls')}`]: {
        opacity: 1
      }
    }
  },

  adsCarousel: {},

  carouselControls: {
    ref: getRef('carouselControls'),
    transition: 'opacity 150ms ease',
    opacity: 0
  },

  carouselIndicator: {
    width: 4,
    height: 4,
    transition: 'width 250ms ease',

    '&[data-active]': {
      width: 16
    }
  },

  carouselSlideItems: {
    cursor: 'pointer'
  },

  carouselImages: {},

  carouselAdsImages: {},

  carouselImagesModal: {
    pointerEvents: 'none',
    maxWidth: '100%'
  }
}));
