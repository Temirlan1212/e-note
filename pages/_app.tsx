import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { ThemeProvider } from "@mui/material";
import theme from "@/theme/default";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <ThemeProvider theme={theme}>
        <PublicLayout>
          <Component {...pageProps} />
        </PublicLayout>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
