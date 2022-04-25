import * as React from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react'
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Layout from '../components/Common/Layout';
import AuthProvider from '../components/Auth/AuthProvider';
import createEmotionCache from '../lib/helpers/createEmotionCache';
import lightThemeOptions from '../styles/theme/lightThemeOptions';
import '../styles/globals.css';

interface IAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

const App: React.FunctionComponent<IAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps: { session, ...pageProps } } = props;

  return (
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
            <SessionProvider session={session}>
                <Layout>
                  <AuthProvider>
                    <Component {...pageProps} />
                  </AuthProvider>
                </Layout>
            </SessionProvider>
        </ThemeProvider>
      </CacheProvider>
  );
};

export default App;
