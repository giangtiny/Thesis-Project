import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Group, Image, NavLink, Box } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import {
  IconBuildingCommunity,
  IconUserCircle,
  IconClipboardList,
  IconSettings,
  IconBuilding,
  IconBuildingChurch,
  IconNews,
} from '@tabler/icons';
import { HOTEL, VILLA, TOWNHOUSE, ACCOUNTS, ORDERS, SETTING, NEWS } from '@/constants/routes';
import { useNavbarStyles } from './NavbarSimple.style';
//@ts-ignore
import { ReactComponent as Logo } from '../../../assets/logo.svg';

import { useAppDispatch } from '@/redux/store';
import { selectNavActive } from '@/redux/selectors';
import { navbarActions } from '@/redux/slices';

const data = [
  {
    link: '/',
    label: 'Quản lý chung',
    icon: IconBuildingCommunity,
    childs: [
      {
        link: `${HOTEL}`,
        label: 'Quản lý khách sạn',
        icon: IconBuilding,
      },
      {
        link: `${VILLA}`,
        label: 'Quản lý villa',
        icon: IconBuildingCommunity,
      },
      {
        link: `${TOWNHOUSE}`,
        label: 'Quản lý nhà phố',
        icon: IconBuildingChurch,
      },
    ],
  },
  {
    link: `${NEWS}`,
    label: "Quản lý tin tức",
    icon: IconNews,
    childs: [],
  },
  {
    link: `${ACCOUNTS}`,
    label: 'Quản lý tài khoản',
    icon: IconUserCircle,
    childs: [],
  },
  {
    link: `/`,
    label: 'Danh sách đặt hàng',
    icon: IconClipboardList,
    childs: [
      {
        link: `${ORDERS}${HOTEL}`,
        label: 'Hóa đơn khách sạn',
        icon: IconBuilding,
      },
      {
        link: `${ORDERS}${VILLA}`,
        label: 'Hóa đơn villa',
        icon: IconBuildingCommunity,
      },
      {
        link: `${ORDERS}${TOWNHOUSE}`,
        label: 'Hóa đơn nhà phố',
        icon: IconBuildingCommunity,
      },
    ],
  },
  { link: `${SETTING}`, label: 'Cài đặt', icon: IconSettings, childs: [] },
];

export default function NavbarSimple() {
  const { classes, cx } = useNavbarStyles();
  const dispatch = useAppDispatch();

  const { setNavActive } = navbarActions;
  const navLinkActive = useSelector(selectNavActive);

  const navigate = useNavigate();

  const location = useLocation();
  if (location.pathname.slice(-1) === '/') {
    location.pathname = location.pathname.slice(0, -1);
  }
  const listPath = [HOTEL, VILLA, TOWNHOUSE, ACCOUNTS, ORDERS, SETTING, `${ORDERS}${HOTEL}`, `${ORDERS}${VILLA}`, `${ORDERS}${TOWNHOUSE}`];

  useEffect(() => {
    console.log(location.pathname);

    if (location.pathname === '/') dispatch(setNavActive(HOTEL));
    else {
      for (let item of listPath) {
        if (location.pathname.includes(item)) {
          dispatch(setNavActive(item));
        }
      }
    }
  }, []);

  const links = data.map((item, index) => (
    <NavLink
      key={item.label}
      childrenOffset="md"
      className={cx(classes.link, { [classes.linkActive]: item.link === navLinkActive })}
      label={item.label}
      icon={<item.icon className={classes.linkIcon} stroke={1.5} />}
      defaultOpened={index === 0 || index === 2}
      onClick={(event: React.MouseEvent) => {
        if (item.childs.length === 0) {
          event.preventDefault();
          navigate(item.link);
          dispatch(setNavActive(item.link));
        }
      }}
    >
      {item.childs.length === 0 ? null : (
        <>
          {item.childs.map((child, index) => (
            <NavLink
              key={index}
              className={cx(classes.link, { [classes.linkActive]: child.link === navLinkActive })}
              label={child.label}
              icon={<child.icon className={classes.linkIcon} stroke={1.5} />}
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                navigate(child.link);
                dispatch(setNavActive(child.link));
              }}
            />
          ))}
        </>
      )}
    </NavLink>
  ));

  return (
    <Navbar style={{ width: '20vw', position: 'fixed' }} p="md">
      <Navbar.Section grow>
        <Group className={classes.header} position="center">
          <Logo style={{ width: 200, cursor: 'pointer' }}
            onClick={() => window.location.pathname = '/'}
          />
        </Group>
        <Box>{links}</Box>
      </Navbar.Section>
    </Navbar>
  );
}
