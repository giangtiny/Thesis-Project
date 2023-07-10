import React, { useState } from 'react';
import { ActionIcon, Group, Transition } from '@mantine/core';
import { useFocusTrap, useWindowScroll } from '@mantine/hooks';
import { IconSearch, IconBuildingArch, IconBuildingSkyscraper, IconHome2 } from '@tabler/icons';

import HomeTabButtonComponent from '@/components/HomeTabButton';
import SearchBar from '../Searchbar';

export default function HomeTabSelectComponent() {
  const [scroll] = useWindowScroll();
  const focusTrapRef = useFocusTrap();
  const [opened, setOpened] = useState(false);

  return (
    <Group spacing={5}>
      <HomeTabButtonComponent url="/" Icon={IconBuildingArch} title="Villa" />
      <HomeTabButtonComponent url="/hotel" Icon={IconBuildingSkyscraper} title="Khách sạn" />
      <HomeTabButtonComponent url="/town-house" Icon={IconHome2} title="Nhà phố" />
    </Group>
  );
}
