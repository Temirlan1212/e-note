import { Box, IconButton } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/Delete";

export const TableActions = ({
  params,
  refreshData,
}: {
  params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>;
  refreshData: Function;
}) => {
  const { data: downloadedData, update: downloadUpdate } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });

  const { data: deletedData, update: deleteUpdate } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

  const handleDownloadClick = async () => {
    await downloadUpdate(params?.row?.id ? "/api/inheritance-cases/documents/download/" + params.row.id : "");
  };

  const handleDeleteClick = () => {
    deleteUpdate("/api/inheritance-cases/documents/delete/" + params.row.id, {
      id: params.row.id,
      version: params.row.version,
    });
  };

  useEffectOnce(async () => {
    if (downloadedData == null || downloadedData.body == null || downloadedData.blob == null) return;

    const blob = await downloadedData.blob();

    if (blob != null) {
      download(blob, params.row.fileName);
    }
  }, [downloadedData]);

  const download = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffectOnce(() => {
    if (deletedData == null || deletedData.body == null) return;
    refreshData();
  }, [deletedData]);

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleDownloadClick}>
        <CloudDownloadIcon />
      </IconButton>
      <IconButton onClick={handleDeleteClick}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
