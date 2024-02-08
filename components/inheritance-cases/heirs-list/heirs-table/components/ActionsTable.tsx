import { Box } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";

export const TableActions = ({ params }: { params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender> }) => {
  const t = useTranslations();

  const router = useRouter();
  const navigate = () => {
    router.push({
      pathname: `/inheritance-cases/heir/${params.row["requester.id"]}`,
      query: { parentId: router.query?.id },
    });
  };

  return (
    <Box display="flex" alignItems="center">
      <Button onClick={navigate}>{t("More detailed")}</Button>
    </Box>
  );
};
