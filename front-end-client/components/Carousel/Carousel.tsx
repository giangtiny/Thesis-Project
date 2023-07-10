import React from 'react';
import { useRouter } from 'next/router';
import { Carousel as MantineCarousel } from '@mantine/carousel';
import { Image, AspectRatio } from '@mantine/core';

import { useCarouselStyle } from './Carousel.Style';
import { CarouselProps } from '@/utils/types';
import { IMAGE_TYPE_TEXT } from '@/constants/images';

export default function Carousel({ images, link, type }: CarouselProps) {
  const { classes, cx } = useCarouselStyle();
  const isAdvertise = type === IMAGE_TYPE_TEXT.ADVERTISE;
  const isImage = type === IMAGE_TYPE_TEXT.IMAGE;
  const isModal = type === IMAGE_TYPE_TEXT.MODAL;
  const router = useRouter();

  const slides = images.map((image) => (
    <MantineCarousel.Slide key={image}>
      <AspectRatio ratio={isAdvertise ? 10 / 4 : 16 / 9}>
        <Image
          src={image}
          alt={image}
          classNames={{
            imageWrapper: cx(classes.carouselSlideItems, {
              [classes.carouselImages]: isImage,
              [classes.carouselAdsImages]: isAdvertise,
              [classes.carouselImagesModal]: isModal
            })
          }}
          onClick={() =>
            link &&
            router.push({
              pathname: link
            })
          }
        />
      </AspectRatio>
    </MantineCarousel.Slide>
  ));
  return (
    <MantineCarousel
      withIndicators
      loop
      classNames={{
        root: cx(classes.carousel, { [classes.adsCarousel]: isAdvertise }),
        controls: classes.carouselControls,
        indicator: classes.carouselIndicator
      }}>
      {slides}
    </MantineCarousel>
  );
}
