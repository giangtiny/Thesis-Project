import { createStyles } from '@mantine/core';

export const useAccountHeaderStyles = createStyles((theme) => ({
  user: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // width: '50%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },
  account: {
    cursor: 'pointer',
  }
}))