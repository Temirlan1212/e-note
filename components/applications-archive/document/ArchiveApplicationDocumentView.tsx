import { FC } from "react";

import { useTranslations } from "next-intl";
import { Box } from "@mui/material";

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

  const content = data?.data?.[0]?.reportContent;
  const contentIsNotEmpty = content != null && content !== '<p><br data-mce-bogus="1"></p>';

  return contentIsNotEmpty ? <Box dangerouslySetInnerHTML={createHtml(content)} /> : t("No data");
};

export default ArchiveApplicationDocumentView;
