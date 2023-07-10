import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { AppProps } from 'next/app';

import '../styles/globals.css';
import '../styles/news/news.css';
import { wrapper } from '@redux/store';
import RouterTransition from '@/components/RouterTransition';
import { NextPage } from 'next';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (appProps: AppPropsWithLayout) => {
  const { Component, ...rest } = appProps;
  const getLayout = Component.getLayout || ((page) => page);
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <link rel="icon" href="/favicon.ico" />

      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <RouterTransition />
          {getLayout(<Component {...props.pageProps} />)}
        </ModalsProvider>
      </MantineProvider>
    </Provider>
  );
};

export default MyApp;
