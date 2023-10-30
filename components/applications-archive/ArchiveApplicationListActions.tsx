import { Box, IconButton, Tooltip } from "@mui/material";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import Link from "@/components/ui/Link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslations } from "next-intl";

export const ArchiveApplicationListActions = ({
  params,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
}) => {
  const t = useTranslations();

  return (
    <Box display="flex" alignItems="center">
      <Link href={`/applications-archive/status/${params.row.id}`}>
        <Tooltip title={t("More detailed")} arrow>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Link>
    </Box>
  );
};
