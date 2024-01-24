import { CircularProgress } from "@mui/material";
import { GetStaticPropsContext } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

import SearchForm, { IHeir } from "@/components/search-for-heirs/filter-content/HeirSearchForm";
import HeirNotFoundData from "@/components/search-for-heirs/components/HeirNotFoundData";
import HeirFoundedData from "@/components/search-for-heirs/components/HeirFoundedData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { heirSchema } from "@/validator-schemas/heir";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";

type ISearchForHeirsProps = {};

const SearchForHeirs = (props: ISearchForHeirsProps) => {
  const t = useTranslations();

  const form = useForm<any>({
    resolver: yupResolver(heirSchema),
  });

  const {
    data: heirsInfo,
    loading: heirsInfoLoading,
    update: getHeirsInfo,
  } = useFetch<FetchResponseBody | null>("", "POST");

  const onSubmit = async (data: IHeir) => {
    const formattedDate = (date: Date | string) => {
      date ? new Date(data?.birthDate as string).toISOString().slice(0, 10) : null;
    };

    const requestData = {
      keyWord: data.keyWord,
      birthDate: data?.birthDate ? formattedDate(data?.birthDate) : null,
      deathDate: data?.deathDate ? formattedDate(data?.deathDate) : null,
    };

    await getHeirsInfo("/api/search-heirs", { requestData });
  };

  const searchFormNames = {
    keyWord: "keyWord",
    birthDate: "birthDate",
    deathDate: "deathDate",
  };

  return (
    <>
      <Head>
        <title>{t("Search for heirs")}</title>
      </Head>

      <SearchForm onSubmit={onSubmit} form={form} names={searchFormNames} />

      {heirsInfo ? (
        heirsInfoLoading ? (
          <CircularProgress />
        ) : (
          <HeirFoundedData foundedData={heirsInfo?.data} />
        )
      ) : (
        <HeirNotFoundData />
      )}
    </>
  );
};

export default SearchForHeirs;

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: {
        ...(await import(`locales/${context.locale}/common.json`)).default,
        ...(await import(`locales/${context.locale}/search-for-heirs.json`)).default,
        ...(await import(`locales/${context.locale}/404.json`)).default,
      },
    },
  };
}
