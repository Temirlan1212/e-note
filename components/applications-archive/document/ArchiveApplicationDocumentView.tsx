import { FC } from "react";

import { useTranslations } from "next-intl";
import { Box, CircularProgress } from "@mui/material";

import { FetchResponseBody } from "@/hooks/useFetch";

interface IArchiveApplicationDocumentViewProps {
  data: FetchResponseBody | null;
  loading: boolean;
}

const ArchiveApplicationDocumentView: FC<IArchiveApplicationDocumentViewProps> = (props) => {
  const t = useTranslations();

  const { data, loading } = props;

  const createHtml = (data: any) => {
    return { __html: data };
  };

  return (
    <Box display="flex" flexDirection="column" gap="25px">
      {!loading ? (
        <Box dangerouslySetInnerHTML={createHtml(data?.data?.[0]?.reportContent)} />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress color="success" />
        </Box>
      )}
    </Box>
  );
};

export default ArchiveApplicationDocumentView;
