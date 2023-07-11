import { Html, Head, Main, NextScript } from 'next/document';
import { DocumentProps} from 'next/document';

export default function Document(props: DocumentProps) {
  return (
    <Html lang={props.locale}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
