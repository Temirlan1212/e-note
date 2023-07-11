import Head from 'next/head';
import { Container } from '@mui/material';
import { useTranslations } from 'next-intl';
import { GetStaticPropsContext } from 'next';

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>{t('E-notariat')}</title>
        <meta name="keywords" content="e-notariat, E-notariat, E-Notariat" />
        <meta name="description" content="E-notariat" />
      </Head>

      <Container>
        <h1>{t('E-notariat')}</h1>
      </Container>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`locales/${context.locale}/common.json`)).default,
    },
  };
}
