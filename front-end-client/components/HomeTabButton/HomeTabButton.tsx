import React from 'react';
import { Stack, UnstyledButton, Text, Center, Tooltip } from '@mantine/core';
import { useRouter } from 'next/router';
import { useWindowScroll } from '@mantine/hooks';
import Link from 'next/link';

import { useHomeTabButtonStyle } from './HomeTabButton.style';

interface HomeTabButtonProps {
  url: string;
  Icon: React.FunctionComponent<any>;
  title: string;
}

export default function HomeTabButtonComponent({ url, Icon, title }: HomeTabButtonProps) {
  const router = useRouter();
  const [scroll] = useWindowScroll();
  const { classes, cx } = useHomeTabButtonStyle();
  const active = router.pathname === url;

  return (
    <Link href={url}>
      <Tooltip label={title}>
        <UnstyledButton
          className={cx(classes.button, {
            [classes.buttonActive]: active
          })}
          p={10}>
          <Stack spacing={5}>
            <Center style={{ width: '100%', height: '100%' }}>
              <Icon className={classes.icon} />
            </Center>
            <Text align="center">{title}</Text>
          </Stack>
        </UnstyledButton>
      </Tooltip>
    </Link>
  );
}
