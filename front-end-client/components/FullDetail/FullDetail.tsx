import React, { useEffect } from 'react';
import {
  Badge,
  Divider,
  Container,
  Grid,
  Group,
  Space,
  Text,
  Transition,
  MantineTransition,
  Flex,
  Col,
  Center
} from '@mantine/core';
import { useSelector } from 'react-redux';
import { IconStar } from '@tabler/icons';
import * as icons from '@tabler/icons';
import { useFullDetailStyle } from './FullDetail.style';
import ImageGroup from '@/components/ImageGroup';
import Calendar from '@/components/Calendar';
import Description from '@/components/Description';
import PaymentBox from '@/components/PaymentBox';
import FullHotel from '@/components/FullHotel';

import { gradientBadgeProps } from '@/constants/props';
import { selectBookedDate } from '@redux/selectors';
import { useAppDispatch } from '@redux/store';
import { CommentDto, HotelProps } from '@/utils/types';
import { openImagesCarouselModal } from '@/utils/modals';
import ImageGallery from 'react-image-gallery';
import { DETAILS_TEXT } from '@/constants/details';
import { useDocumentTitle, useMediaQuery } from '@mantine/hooks';
import { roomActions } from '@redux/slices';
import { rooms_floor } from '@/constants/static-data';
import ImagePreview from '../ImagePreview';
import config from '@/config/config';

import GGMapFullView from '../GGMapFullView';
import CommentCarousel from '../CommentCarousel';
interface Props {
  currentHotel: HotelProps;
  comments: CommentDto[];
}
export default function FullDetail(props: Props) {
  const { currentHotel, comments } = props;
  const {
    id,
    name,
    address,
    description,
    images,
    images360,
    star,
    price,
    isForContact,
    phone,
    promotionDescription,
    minRoomPrice,
    lat,
    lng,
    amenities
  } = currentHotel;
  const detailImages = images.map((image) => ({ original: image, thumbnail: image }));
  const renderableImages = images.map((image) => config.IMAGE_URL + image);
  const renderableImages360 = images360.map((image) => config.IMAGE_URL + image);
  const { classes, theme } = useFullDetailStyle();
  const dispatch = useAppDispatch();
  useDocumentTitle(`${name} - Tre Bay Booking`);
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const [checkinDate, checkoutDate] = useSelector(selectBookedDate);
  const transitionProps = {
    mounted: Boolean(checkinDate && checkoutDate),
    transition: 'fade' as MantineTransition,
    duration: 300,
    timingFunction: 'ease'
  };

  useEffect(() => {
    dispatch(roomActions.setAllRooms(rooms_floor));
  }, [checkinDate, checkoutDate]);

  const renderFullHotel = () => {
    //@ts-ignore
    return <FullHotel />;
  };
  return (
    <Container size="xl">
      <Text className={classes.title}>{name}</Text>
      <Space h="xs" />
      <Flex justify={'space-between'}>
        <Group spacing={5}>
          <Badge {...gradientBadgeProps} className={classes.rating}>
            {star} <IconStar size={11} fill="#fff" />
          </Badge>
          <Text color="dimmed" className={classes.address}>
            · 3 đánh giá · {address}
          </Text>
        </Group>
        <ImagePreview images360={renderableImages360}></ImagePreview>
      </Flex>
      <Space h="xl" />

      <ImageGroup images={renderableImages} />
      <Space h={40} />
      <Grid>
        <Grid.Col xl={8} lg={8} md={12} sm={12} xs={12}>
          {/* <ImageGallery items={detailImages} lazyLoad showPlayButton={false} /> */}
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            Ưu Đãi
          </Badge>
          <Space h="md" />
          <Description description={promotionDescription || ''} />
          <Divider my="xl" />
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            Mô tả
          </Badge>
          <Space h="md" />
          <Description description={description} />
          <Divider my="xl" />
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            Tiện ích
          </Badge>
          <Space h="md" />
          <Grid>
            {amenities.map((amenity, index) => {
              const IconComponent = icons[`${amenity.icon}` as keyof typeof icons];
              return (
                <Grid.Col span={4} key={index}>
                  <Group align="center" style={{ marginBottom: '10px' }}>
                    <IconComponent />
                    <Text ml={10}>{amenity.description}</Text>
                  </Group>
                </Grid.Col>
              );
            })}
          </Grid>
          <Divider my="xl" />
          <Badge color="teal" size={isMobile ? 'lg' : 'xl'} variant="filled">
            {DETAILS_TEXT.BOOK_NOW_TEXT}
          </Badge>
          <Space h="md" />
          <Calendar />
        </Grid.Col>
        <Grid.Col xl={4} lg={4} md={0} sm={0} xs={0}>
          <Container style={{ position: 'sticky', top: 80 }}>
            <PaymentBox phone={phone} price={price || minRoomPrice} isForContact={isForContact} />
          </Container>
        </Grid.Col>
      </Grid>
      <Space h="xl" />
      <Transition {...transitionProps}>
        {(styles) => (
          <div style={styles}>
            <Space h="xl" />
            {renderFullHotel()}
          </div>
        )}
      </Transition>
      <Space h="xl" />
      <Divider my="xl" />
      <Badge color="teal" size="xl" variant="filled">
        Đánh giá
      </Badge>
      <Space h="sm" />
      <Grid>
        <Grid.Col span={12}>
          <Flex justify={'start'} align={'center'}>
            <Text fw={'bold'} className={classes.ratingInComment}>
              <Center>
                <IconStar size={'1.25rem'} fill="#000" />
                <Space w="sm" /> {star}
              </Center>
            </Text>
            <Space w="sm" />
            <Text fw={'bold'} className={classes.ratingInCommentCount}>
              · {comments?.length} đánh giá
            </Text>
          </Flex>
        </Grid.Col>
        <CommentCarousel
          hotel={{ name: name, image: renderableImages[0], id: id }}
          rating={Number(star)}
          comments={comments}
        />
      </Grid>
      <Space h="xl" />
      <Divider my="xl" />
      <Badge color="teal" size="xl" variant="filled">
        Nơi bạn sẽ đến
      </Badge>
      <Space h="xl" />
      <GGMapFullView lat={lat} lng={lng}></GGMapFullView>
      <Space h="xl" />
    </Container>
  );
}
