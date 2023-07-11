import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import PublicLayout from "@/layouts/Public";
import PrivateLayout from "@/layouts/Private";
import { ThemeProvider } from "@mui/material";
import theme from "./globalTheme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <NextIntlClientProvider messages={pageProps.messages}>
        <PublicLayout>
          <Component {...pageProps} />
        </PublicLayout>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
