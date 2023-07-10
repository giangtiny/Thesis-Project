/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useRef } from 'react';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { createStyles, Paper, Text, Title, Button, useMantineTheme } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
const useStyles = createStyles((theme) => ({
  card: {
    height: 450,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}));

interface CardProps {
  image: string;
  title: string;
  category: string;
}

function Card({ image, title, category }: CardProps) {
  const { classes } = useStyles();

  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      sx={{ backgroundImage: `url(${image})` }}
      className={classes.card}></Paper>
  );
}

const data = [
  {
    image:
      'https://thepetitewanderer.com/wp-content/uploads/2018/11/40363709_672392806451802_6164655856613851136_n.jpg',
    title: 'Best forests to visit in North America',
    category: 'nature'
  },
  {
    image: 'https://madisonsfootsteps.com/wp-content/uploads/2019/02/JPG-Images-copy.jpg',
    title: 'Hawaii beaches review: better than you think',
    category: 'beach'
  },
  {
    image: 'https://i.pinimg.com/736x/41/ba/a3/41baa30419a527b8ab91e94b14190c3b.jpg',
    title: 'Mountains at night: 12 best locations to enjoy the view',
    category: 'nature'
  },
  {
    image:
      'https://e0.pxfuel.com/wallpapers/184/985/desktop-wallpaper-travel-phone-aesthetic-travel-thumbnail.jpg',
    title: 'Aurora in Norway: when to visit for best experience',
    category: 'nature'
  },
  {
    image: 'https://media.graphassets.com/gbBw8et0TdmM0itHpMVU',
    title: 'Best places to visit this winter',
    category: 'tourism'
  },
  {
    image:
      'https://a.hwstatic.com/image/upload/q_50,h_792/v1644507605/pwa/community/community-image-3.jpg',
    title: 'Active volcanos reviews: travel at your own risk',
    category: 'nature'
  }
];

export default function Events() {
  const autoplay = useRef(Autoplay());

  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));
  return (
    <section className="social-section-wrapper" data-v-a5d2efa6 data-v-66a31625>
      <div className="card-carousel" data-v-02683708 data-v-a5d2efa6>
        <Carousel
          w={800}
          slideSize="33%"
          breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: 2 }]}
          slideGap="md"
          align="center"
          withControls={false}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          slidesToScroll={1}>
          {slides}
        </Carousel>
      </div>
      <div className="text" data-v-a5d2efa6>
        <header className="text-header" data-v-a5d2efa6 style={{ fontFamily: 'inherit' }}>
          Chia sẽ lên <span>mạng xã hội</span> chuyến đi của bạn
        </header>
        <p className="text-body" data-v-a5d2efa6>
          Chỉ với vài cú click! Để cuộc hành trình thêm thú vị!
        </p>
        <div className="text-label tag-wrapper tag-skew-right" data-v-54fec16c data-v-a5d2efa6>
          <div
            className="tag-text"
            style={{
              backgroundColor: 'var(--wds-color-pink)',
              color: 'var(--wds-color-white)',
              fill: 'var(--wds-color-white)',
              fontFamily: 'inherit'
            }}
            data-v-54fec16c>
            Sắp ra mắt
          </div>
        </div>
      </div>
    </section>
  );
}
