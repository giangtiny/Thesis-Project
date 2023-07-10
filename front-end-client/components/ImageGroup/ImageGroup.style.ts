import { createStyles } from '@mantine/core';

const height: string = '100% !important';

const radius: number = 20;

export const useImageGroupStyle = createStyles((theme) => ({
  generalImages: {
    cursor: 'pointer',
    transition: 'transform .3s;',
    '&:hover': {
      transform: 'scale(1.05);'
    }
  },

  imageTopRight: {
    borderTopRightRadius: radius
  },

  root: {
    height: height,
    position: 'relative'
  },

  imageWrapper: {
    height: height
  },

  figure: {
    height: height
  },

  image: {
    height: height,
    borderTopLeftRadius: radius,
    borderBottomLeftRadius: radius
  },

  box: {
    cursor: 'pointer',
    height: '100%',
    position: 'relative',
    borderBottomRightRadius: radius
  },

  backGround: {
    height: '100%',
    borderBottomRightRadius: `${radius}px !important`,
    display: 'flex !important'
  },

  overlay: {
    borderBottomRightRadius: `${radius}px !important`
  },

  moreImagesText: {
    fontSize: 28,
    color: 'white',
    zIndex: 6
  }
}));
