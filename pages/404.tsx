import { Container } from '@mui/material';
import { GetStaticPropsContext } from 'next';

export default function Error404() {
  return (
    <Container>
      <h1>404</h1>
    </Container>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`locales/${context.locale}/common.json`)).default,
    },
  };
}
