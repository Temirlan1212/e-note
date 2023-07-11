import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import PublicLayout from '@/layouts/Public';
import PrivateLayout from '@/layouts/Private';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <PublicLayout>
        <Component {...pageProps} />
      </PublicLayout>
    </NextIntlClientProvider>
  );
}
