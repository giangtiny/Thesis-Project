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
  Burger
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconMenu2, IconUser, IconUserCircle } from '@tabler/icons';

import SearchBar from '@/components/Searchbar';
import { LogoHorizon } from '@/icons/index';
import { useLandingHeaderStyle } from './LandingHeader.style';
import { useDisclosure } from '@mantine/hooks';
import React, { ReactNode } from 'react';
import { HEADER_HEIGHT } from '@/constants/theme';
import { TransparentButton } from '@/components/TransparentButton';

interface LinkProps {
  label: string;
  link?: string;
  icon?: ReactNode;
  isTarget: boolean;
  item?: DropDownItem[];
}
interface DropDownItem {
  label: string;
  value: string;
}

const languages = [
  {
    label: 'English',
    value: 'eng'
  },
  {
    label: 'Vietnamese',
    value: 'vie'
  },
  {
    label: 'France',
    value: 'fr'
  }
];

const currency = [
  {
    label: 'US Dollar',
    value: 'usd'
  },
  {
    label: 'Vietnam Dong',
    value: 'vnd'
  },
  {
    label: 'Euro',
    value: 'eur'
  }
];
const mainLinks: LinkProps[] = [
  {
    link: '/authentication',
    label: 'authentication',
    icon: <IconUser></IconUser>,
    isTarget: true
  },

  {
    label: 'VND',
    isTarget: false,
    item: [
      {
        label: 'US Dollar',
        value: 'usd'
      },
      {
        label: 'Vietnam Dong',
        value: 'vnd'
      },
      {
        label: 'Euro',
        value: 'eur'
      }
    ]
  }
];
export default function LandingHeader() {
  const { classes, cx } = useLandingHeaderStyle();
  const router = useRouter();

  const menu = (label: string, items: DropDownItem[]) => (
    <Menu>
      <Menu.Target>
        <Button p={5} radius={20} color="white">
          {label}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((item: DropDownItem) => (
          <Menu.Item key={item.label} onClick={() => router.push('authentication')}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <MantineHeader height={'auto'} p="xs" className={classes.header}>
      <Container size={'lg'}>
        <Group position="apart">
          <Link href="/">
            <a>
              <LogoHorizon height={100} style={{ cursor: 'pointer' }} width="auto" />
            </a>
          </Link>
          <Group className={classes.mainLinks}>
            <TransparentButton isLink={false} link={'/authentication'} label={'/authentication'}>
              <IconUser color="white" />
            </TransparentButton>
            <TransparentButton isLink={false} label={'English'}>
              <Menu>
                <Menu.Target>
                  <Text color="white">{'English'}</Text>
                </Menu.Target>
                <Menu.Dropdown>
                  {languages.map((item: DropDownItem) => (
                    <Menu.Item key={item.label} onClick={() => router.push('authentication')}>
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </TransparentButton>
            <TransparentButton isLink={false} label={'English'}>
              <Menu>
                <Menu.Target>
                  <Text color="white">{'VND'}</Text>
                </Menu.Target>
                <Menu.Dropdown>
                  {currency.map((item: DropDownItem) => (
                    <Menu.Item key={item.label} onClick={() => router.push('authentication')}>
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </TransparentButton>
            <TransparentButton isLink={true} link={'/about'} label={'List your property'}>
              <Text color="white">List your property</Text>
            </TransparentButton>
            <TransparentButton isLink={false} label={'/authentication'}>
              <IconMenu2 color="white" />
            </TransparentButton>
          </Group>
        </Group>
      </Container>
    </MantineHeader>
  );
}
