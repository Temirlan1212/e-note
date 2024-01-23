import { Box } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import Link from "@/components/ui/Link";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

export const InheritanceCasesTableActions = ({
  params,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
}) => {
  const t = useTranslations();
  return (
    <Box display="flex" alignItems="center">
      <Link href={`/inheritance-cases/${params.row.id}`}>
        <Button>{t("More detailed")}</Button>
      </Link>
    </Box>
  );
};
