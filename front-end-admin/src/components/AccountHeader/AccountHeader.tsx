import {
  UnstyledButton,
  UnstyledButtonProps,
  Group,
  Avatar,
  Text,
  Menu,
  Flex,
  Button
} from '@mantine/core';
import { IconMail, IconBell } from '@tabler/icons';
import { useAccountHeaderStyles } from './AccountHeader.style';

interface AccountHeaderProps extends UnstyledButtonProps {
  image: string;
  name: string;
  role: string;
  icon?: React.ReactNode;
}

export default function AccountHeader({ image, name, role, icon, ...others }: AccountHeaderProps) {
  const { classes } = useAccountHeaderStyles();

  const logoutHandle = () => {
    localStorage.removeItem('jwtKeyTreBay');
    window.location.pathname = '/login';
  }

  return (
    <div className={classes.user} {...others}>
      <Group>
        <IconBell size={32} stroke={1.5} />
        <IconMail size={32} stroke={1.5} />
        <Menu>
          <Menu.Target>
            <Flex className={classes.account}>
              <Avatar src={image} radius="xl" />
              <div style={{ flex: 1, paddingRight: 8 }}>
                <Text size="sm" weight={500}>
                  {name}
                </Text>
                <Text color="dimmed" size="xs">
                  {role}
                </Text>
              </div>
            </Flex>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item p='0' pl='md' pr='md' onClick={logoutHandle}>
              Đăng xuất
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
}