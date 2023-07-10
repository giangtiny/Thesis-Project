import React, { useState } from 'react';
import {
  IconArrowRight,
  IconCar,
  IconHeart,
  IconMap2,
  IconStar,
  IconWifi,
  IconSwimming,
  IconBed,
  IconAirConditioning,
  IconMeat
} from '@tabler/icons';
import * as icons from '@tabler/icons';
import {
  Card,
  Text,
  ActionIcon,
  Badge,
  Group,
  Divider,
  Box,
  Button,
  Alert,
  Col,
  Grid,
  Flex,
  Space
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useVillaCardLandingStyles } from './VillaCardLanding.style';
import { PRICE_TEXT, PRICE_UNIT } from '@/constants/prices';
import { URL } from '@/constants/urls';
import Carousel from '@/components/Carousel';
import { GRADIENTS, PRIMARY_COLOR } from '@/constants/theme/color';
import { VillaCardProps } from '@/utils/types';
import { formatMoney } from '@/utils/formatter';
import ImagePreview from '../ImagePreview';
import GGMap from '../GGMap';
import config from '@/config/config';
export function VillaCardLanding(
  props: VillaCardProps &
    Omit<React.ComponentPropsWithoutRef<'div'>, keyof VillaCardProps> & { index: number }
) {
  const {
    id,
    images,
    images360,
    name,
    address,
    star,
    price,
    size = 'sm',
    index,
    minRoomPrice,
    lat,
    lng,
    amenities
  } = props;
  const renderableImages = images.map((image) => config.IMAGE_URL + image);
  const renderableImages360 = images360?.map((image) => config.IMAGE_URL + image);

  const { classes, theme, cx } = useVillaCardLandingStyles();
  const linkProps = { href: URL.DETAIL + id, rel: 'noopener noreferrer' };
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const isOdd = index % 2 != 0;
  const features = [
    {
      icon: <IconCar size={20} />,
      text: 'Car Parking'
    },
    {
      icon: <IconWifi size={20} />,
      text: 'Free Wifi'
    },
    {
      icon: <IconSwimming size={20} />,
      text: 'Swimming Pool'
    },
    {
      icon: <IconMeat size={20} />,
      text: 'Restaurant'
    },
    {
      icon: <IconBed size={20} />,
      text: 'Comfortable Beds'
    },
    {
      icon: <IconAirConditioning size={20} />,
      text: 'Air Conditioning'
    }
  ];
  console.log(images360);
  return (
    <Card
      className={classes.card}
      p="md"
      radius="md"
      style={{ display: 'flex', flexDirection: isOdd ? 'row-reverse' : 'row' }}>
      <Card.Section
        className={classes.image}
        style={{ position: 'relative', zIndex: isHovered ? 20 : 0 }}>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{}}>
          <Carousel images={renderableImages} link={URL.DETAIL + id} type="images" />
        </div>
      </Card.Section>

      <Card.Section
        className={classes.detail}
        p="lg"
        style={{
          position: 'absolute',
          filter: isHovered ? 'blur(5px)' : 'none',
          left: isOdd ? '2%' : '40%'
        }}>
        <Flex align={'center'} justify={'space-between'}>
          <Badge
            className={classes.rating}
            variant="gradient"
            gradient={GRADIENTS.LIGHT_DARK_GREEN_195}>
            <Group spacing={5}>
              <IconStar size={16} /> {star}
            </Group>
          </Badge>
          <Flex justify={'flex-end'}>
            <ImagePreview images360={renderableImages360}></ImagePreview>
            <Space w={'30%'}></Space>
            <GGMap lat={lat} lng={lng}></GGMap>
          </Flex>
        </Flex>

        <Text>
          <Text color={'gray'} span>
            {PRICE_TEXT}
          </Text>
          <Text span weight={700} size={'xl'} ml={5} color={PRIMARY_COLOR.PRIMARY_DARK_GREEN}>
            {minRoomPrice && formatMoney(minRoomPrice)}
          </Text>
          <Text span>{PRICE_UNIT}</Text>
        </Text>

        <Group position="apart">
          <Link {...linkProps}>
            <Text style={{ fontSize: 28 }}>{name}</Text>
          </Link>
        </Group>

        <Text color="dimmed" lineClamp={2} style={{ fontSize: 18 }}>
          <IconMap2 size={20} />
          <Text span ml={10}>
            {address}
          </Text>
        </Text>
        <Grid mt="md">
          {amenities?.slice(0, 3).map((amenity, index) => {
            const IconComponent = icons[`${amenity.icon}` as keyof typeof icons];
            return (
              <Col sm={4} key={index}>
                <Group align="center" style={{ marginBottom: '10px' }}>
                  <IconComponent />
                  <Text ml={10}>{amenity.description}</Text>
                </Group>
              </Col>
            );
          })}

          {amenities?.slice(3, 6).map((amenity, index) => {
            const IconComponent = icons[`${amenity.icon}` as keyof typeof icons];
            return (
              <Col sm={4} key={index}>
                <Group align="center" style={{ marginBottom: '10px' }}>
                  <IconComponent />
                  <Text ml={10}>{amenity.description}</Text>
                </Group>
              </Col>
            );
          })}
        </Grid>
        <Divider my="sm" />
        <Group position="left" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link {...linkProps}>
            <Text
              weight={600}
              className={classes.title}
              style={{ display: 'flex', fontSize: 16, alignItems: 'center' }}>
              Chi Tiết <IconArrowRight size={20} />
            </Text>
          </Link>
          <Button
            variant="filled"
            onClick={() => router.push(URL.DETAIL + id)}
            className={classes.button}
            size="lg"
            color="green">
            Đặt chỗ
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
