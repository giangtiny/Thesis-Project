import React from 'react';
import { Box, Badge, Image, Space } from '@mantine/core';

import { gradientBadgeProps } from '@/constants/props';

export default function Map({ url }: { url: string }) {
  return (
    <Box>
      <Badge {...gradientBadgeProps} size="lg">
        Vị trí
      </Badge>
      <Space h="md" />
      <Image src={`${url}${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`} alt={url} />
    </Box>
  );
}
