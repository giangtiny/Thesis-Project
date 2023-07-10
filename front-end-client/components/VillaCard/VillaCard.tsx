import React from 'react';
import { IconHeart, IconMap2, IconStar } from '@tabler/icons';
import { Card, Text, ActionIcon, Badge, Group, Divider, Box, Button, Alert } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useVillaCardStyles } from './Villa.style';
import { PRICE_TEXT, PRICE_UNIT } from '@/constants/prices';
import { URL } from '@/constants/urls';
import Carousel from '@/components/Carousel';
import { GRADIENTS } from '@/constants/theme/color';
import { VillaCardProps } from '@/utils/types';
import { formatMoney } from '@/utils/formatter';

export function VillaCard(
  props: VillaCardProps & Omit<React.ComponentPropsWithoutRef<'div'>, keyof VillaCardProps>
) {
  const { id, images, name, address, star, price, size = 'sm' } = props;
  const { classes, theme, cx } = useVillaCardStyles();
  const linkProps = { href: URL.DETAIL + id, rel: 'noopener noreferrer' };
  const router = useRouter();

  return (
    <Box style={{ width: 'auto' }}>
      <Card className={classes.card} p="md" radius="md" shadow="md">
        <Card.Section>
          <Carousel images={images} link={URL.DETAIL + id} type="images" />
        </Card.Section>

        <Badge
          className={classes.rating}
          variant="gradient"
          gradient={GRADIENTS.LIGHT_DARK_GREEN_195}>
          <Group spacing={5}>
            <IconStar size={16} /> {star}
          </Group>
        </Badge>

        <Card.Section p="lg">
          <Group position="apart">
            <Link {...linkProps}>
              <Text className={classes.title} size={size === 'md' ? 'xl' : 'lg'}>
                {name}
              </Text>
            </Link>
            <ActionIcon className={classes.action} mt={5}>
              <IconHeart size={22} color={theme.colors.red[6]} />
            </ActionIcon>
          </Group>

          <Text color="dimmed" lineClamp={2} size={size === 'md' ? 'md' : 'sm'}>
            <IconMap2 size={20} />
            <Text span ml={10}>
              {address}
            </Text>
          </Text>
          <Divider my="sm" />
          <Group position="apart">
            <Alert color="green" p="xs" pt={6} pb={6} style={{ flexGrow: size === 'md' ? 0 : 1 }}>
              <Text>
                <Text span underline>
                  {PRICE_TEXT}
                </Text>
                <Text span weight={600} size="md" ml={5}>
                  {formatMoney(price)}
                </Text>
                <Text span>{PRICE_UNIT}</Text>
              </Text>
            </Alert>
            <Button
              variant="filled"
              onClick={() => router.push(URL.DETAIL + id)}
              fullWidth={size === 'sm'}
              className={classes.button}
              color="green">
              Đặt chỗ
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </Box>
  );
}
