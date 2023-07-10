import React from 'react';
import { Box, Group, Badge, Title } from '@mantine/core';
import { gradientBadgeProps } from '@/constants/props';
import { UseHomeSectionTitleStyle } from './HomeSectionTitle.Style';

export default function HomeSectionTitle({ badge, label }: { badge: string; label: string }) {
  const { classes } = UseHomeSectionTitleStyle();

  return (
    <Box>
      <Title order={6} className={classes.title} align="center" mt="sm">
        {label}
      </Title>
      <Group position="center" mt={15}>
        <Badge color="teal" size="lg">
          {badge}
        </Badge>
      </Group>
    </Box>
  );
}
