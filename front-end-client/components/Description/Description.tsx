import React from 'react';
import { Paper, Spoiler, Badge, Box, Space } from '@mantine/core';

import { gradientBadgeProps } from '@/constants/props';

export default function Description({ description }: { description: string }) {
  return (
    <Box>
      <Spoiler maxHeight={195} showLabel="Xem thêm" hideLabel="Hide">
        {description}
      </Spoiler>
    </Box>
  );
}
