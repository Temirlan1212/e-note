import { FC } from "react";

import { useTranslations } from "next-intl";
import { Box, CircularProgress } from "@mui/material";

import { FetchResponseBody } from "@/hooks/useFetch";

interface IArchiveApplicationDocumentViewProps {
  data: FetchResponseBody | null;
}

const ArchiveApplicationDocumentView: FC<IArchiveApplicationDocumentViewProps> = (props) => {
  const t = useTranslations();

  const { data } = props;

  const createHtml = (data: any) => {
    return { __html: data };
  };

  return <Box dangerouslySetInnerHTML={createHtml(data?.data?.[0]?.reportContent)} />;
};

export default ArchiveApplicationDocumentView;
