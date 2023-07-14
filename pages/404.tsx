import { Container } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Error404() {
  const t = useTranslations();

  return (
    <Container>
      <div className="error__container">
        <Image src="/icons/notFound.svg" alt="Not found" width={500} height={323} className="error__img" />
        <p className="error__status">404</p>
        <p className="error__title">{t("The page is not available")}</p>
        <p className="error__subtitle">{t("Unfortunately, we cannot find the requested page")}</p>
        <Link href="/" className="error__return__button">
          {t("Go back to the main page")}
        </Link>
      </div>
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
