import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ActionIcon, Button, Group, Popover, Stack, Text } from '@mantine/core';
import { IconMinus, IconPlus, IconChevronDown, IconChevronRight, IconUser } from '@tabler/icons';

import { selectCountGuest, selectGuest } from '@redux/selectors';
import { useAppDispatch } from '@redux/store';
import { guestActions } from '@redux/slices';
import { GUEST_SELECT_INFO } from '@/constants/static-data';
import { useGuestSelectBoxStyle } from './GuestSelectBox.style';

interface GuestBoxInfoProps {
  type: number;
  title: string;
  content: string;
}

export default function GuestSelectBoxComponent() {
  const { classes } = useGuestSelectBoxStyle();
  const { elder, children } = useSelector(selectGuest);
  const guestCount = useSelector(selectCountGuest);
  const dispatch = useAppDispatch();
  const [openedGuestBox, setOpenedGuestBox] = useState<boolean>(false);

  const handleGuestActions = (action: string, type: number) => {
    switch (type) {
      case 1:
        action === 'add'
          ? dispatch(guestActions.addElderGuest())
          : dispatch(guestActions.removeElderGuest());
        break;
      case 2:
        action === 'add'
          ? dispatch(guestActions.addChildrenGuest())
          : dispatch(guestActions.removeChildrenGuest());
        break;
      default:
        break;
    }
  };

  const renderCount = (type: number): number | undefined => {
    switch (type) {
      case 1:
        return elder;
      case 2:
        return children;
      default:
        break;
    }
  };

  const renderMenuItem = (guestInfo: GuestBoxInfoProps) => {
    return (
      <Group position="apart" mt={5}>
        <Stack spacing={5}>
          <Text>{guestInfo.title}</Text>
          <Text color="dimmed" size="sm">
            {guestInfo.content}
          </Text>
        </Stack>
        <Group>
          <ActionIcon
            onClick={() => handleGuestActions('remove', guestInfo.type)}
            disabled={renderCount(guestInfo.type) === 0}
            variant="outline">
            <IconMinus />
          </ActionIcon>
          <Text>{renderCount(guestInfo.type)}</Text>
          <ActionIcon onClick={() => handleGuestActions('add', guestInfo.type)} variant="outline">
            <IconPlus />
          </ActionIcon>
        </Group>
      </Group>
    );
  };

  return (
    <Popover
      opened={openedGuestBox}
      onChange={setOpenedGuestBox}
      width="target"
      position="bottom"
      shadow="sm">
      <Popover.Target>
        <Button
          variant={openedGuestBox ? 'outline' : 'subtle'}
          fullWidth
          color="gray"
          onClick={() => setOpenedGuestBox((o) => !o)}
          leftIcon={<IconUser />}
          classNames={{
            label: classes.buttonLabel
          }}>
          <Group position="apart">
            <Text color="dimmed">{guestCount} Khách</Text>
            {openedGuestBox ? <IconChevronDown /> : <IconChevronRight />}
          </Group>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>{GUEST_SELECT_INFO.map((info) => renderMenuItem(info))}</Popover.Dropdown>
    </Popover>
  );
}
