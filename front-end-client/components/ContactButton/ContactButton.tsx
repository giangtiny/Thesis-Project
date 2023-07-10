import React, { useState } from 'react';
import { ActionIcon, Affix, Space, Transition } from '@mantine/core';
import { IconMessage } from '@tabler/icons';
import { IconFacebookRound, IconTelegramRound, IconYoutubeRound } from '@/icons/index';

const icons = [
  {
    icon: <IconFacebookRound size={50} />,
    duration: 400
  },
  {
    icon: <IconYoutubeRound size={50} />,
    duration: 300
  },
  {
    icon: <IconTelegramRound size={50} />,
    duration: 200
  }
];

export default function ContactButton() {
  const [opened, setOpened] = useState(false);

  const actionIconProps = {
    radius: 50,
    size: 50
  };

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      {icons.map((item, index: number) => (
        <Transition
          mounted={opened}
          transition="slide-up"
          duration={item.duration}
          timingFunction="ease"
          key={index}>
          {(styles) => (
            <div style={styles}>
              <ActionIcon variant="filled" {...actionIconProps}>
                {item.icon}
              </ActionIcon>
              <Space h={5} />
            </div>
          )}
        </Transition>
      ))}
      <Space h="xs" />
      <ActionIcon
        variant="filled"
        {...actionIconProps}
        onClick={() => setOpened(!opened)}
        color="teal"
        p={8}>
        <IconMessage size={50} />
      </ActionIcon>
    </Affix>
  );
}
