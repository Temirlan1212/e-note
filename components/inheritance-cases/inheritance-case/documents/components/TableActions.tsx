import { Box, IconButton } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";

export const TableActions = ({ params }: { params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender> }) => {
  const { data: downloadData, update: downloadUpdate } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });

  useEffectOnce(async () => {
    if (downloadData == null || downloadData.body == null || downloadData.blob == null) return;

    const blob = await downloadData.blob();

    if (blob != null) {
      download(blob, params.row.fileName);
    }
  }, [downloadData]);

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

  const handleDownloadClick = async () => {
    await downloadUpdate(params?.row?.id ? "/api/inheritance-cases/documents/download/" + params.row.id : "");
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleDownloadClick}>
        <CloudDownloadIcon />
      </IconButton>
    </Box>
  );
};
