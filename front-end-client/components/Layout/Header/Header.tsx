import {
  Menu,
  Button,
  Container,
  Group,
  Header as MantineHeader,
  MantineNumberSize,
  Transition,
  ActionIcon,
  Text,
  Burger,
  Space
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconMenu2, IconSearch, IconUserCircle } from '@tabler/icons';

import SearchBar from '@/components/Searchbar';
import { LogoHorizon } from '@/icons/index';
import { useHeaderStyle } from './Header.style';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { HEADER_HEIGHT } from '@/constants/theme';

interface LinkProps {
  label: string;
  link: string;
}

const mainLinks: LinkProps[] = [
  {
    link: '/products',
    label: 'Đặt chỗ'
  },
  {
    link: '/news',
    label: 'Tin Tức'
  },
  {
    link: '/about',
    label: 'Liên hệ'
  }
];
export default function Header({ size }: { size: MantineNumberSize }) {
  const { classes, cx } = useHeaderStyle();
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const mainItems = mainLinks.map((item, index) => (
    <Link href={item.link} key={item.label}>
      <Text
        className={cx(classes.mainLink, {
          [classes.mainLinkActive]: item.link === router.pathname && item.link !== '/'
        })}>
        {item.label}
      </Text>
    </Link>
  ));

  const menu = (
    <Menu>
      <Menu.Target>
        <Button p={5} radius={20} variant="outline" color="teal">
          <Group spacing={8}>
            <IconMenu2 size={15} color="teal" />
            <IconUserCircle color="teal" />
          </Group>
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => router.push('authentication')}>Đăng nhập</Menu.Item>
        <Menu.Item
          onClick={() => router.push({ pathname: '/authentication', query: { mode: 'register' } })}>
          Đăng ký
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <MantineHeader height={'auto'} p="xs" className={classes.header}>
      <div style={{ padding: '0 5% 0 5%' }}>
        <Group position="apart" style={{ flexWrap: 'nowrap' }}>
          <Link href="/">
            <a>
              <LogoHorizon height={40} style={{ cursor: 'pointer' }} width="auto" />
            </a>
          </Link>
          <Group className={classes.mainLinks}>
            <Group spacing={0} position="right">
              {mainItems}
            </Group>
            {menu}
          </Group>
          <Group className={classes.burger}>
            <ActionIcon size={30} color={'teal'} variant="subtle" radius="xl">
              <IconSearch size={25} stroke={1.5} />
            </ActionIcon>
            <Burger opened={opened} onClick={toggle} size="sm" />
          </Group>
        </Group>
      </div>
    </MantineHeader>
  );
}
