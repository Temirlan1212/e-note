import { Html, Head, Main, NextScript } from "next/document";
import { DocumentProps } from "next/document";

export default function Document(props: DocumentProps) {
  return (
    <Html lang={props.locale}>
      <Head />
      <body>
        <Main />
        <NextScript />

        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
                ym(94733774, "init", {
                      clickmap:true,
                      trackLinks:true,
                      accurateTrackBounce:true
                });
              `,
          }}
        />
      </body>
    </Html>
  );
}
