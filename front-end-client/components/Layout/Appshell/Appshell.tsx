//Appshell component
import { ReactNode } from 'react';
import {
  AppShell as MantineAppShell,
  MantineNumberSize,
  AppShellProps as MantineAppShellProps,
  Space,
  Divider
} from '@mantine/core';
import Header from '../Header';
import Footer from '../Footer';
import { footerData } from '@/constants/static-data';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/styles';
import { HEADER_HEIGHT } from '@/constants/theme';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/Searchbar';
import { useRouter } from 'next/router';

interface AppShellProps extends MantineAppShellProps {
  children: ReactNode;
  headerSize?: MantineNumberSize;
  isHomePage?: boolean;
}

const DynamicHeader = dynamic(() => import('../Header'));

export default function AppShell({ children, headerSize, isHomePage, ...props }: AppShellProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const router = useRouter();
  return (
    <MantineAppShell
      header={<DynamicHeader size={headerSize || 'xl'} />}
      footer={<Footer data={footerData} />}
      {...props}
      styles={{
        main: {
          padding:
            isMobile || isHomePage
              ? `${HEADER_HEIGHT}px 0px 0px 0px !important`
              : `6% 0px 0px 0px !important`
        }
      }}>
      {router.pathname === '/products' || router.pathname === '/' ? (
        <>
          <SearchBar />
          <Divider m={'5%'}></Divider>
        </>
      ) : (
        <Space w="50%"></Space>
      )}

      {children}
    </MantineAppShell>
  );
}
