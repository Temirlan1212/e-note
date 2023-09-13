import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { useProfileStore } from "@/stores/profile";
import { Box, IconButton, Input, Typography } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "../ui/Button";
import { GridTable } from "../ui/GridTable";
import Pagination from "../ui/Pagination";

function GridTableActionsCell({ row, onDelete }: { row: Record<string, any>; onDelete: Function }) {
  const { data: downloadData, update: downloadUpdate } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });
  const { update: deleteUpdate } = useFetch<Response>("", "DELETE");

  useEffectOnce(async () => {
    if (downloadData == null || downloadData.body == null || downloadData.blob == null) return;

    const blob = await downloadData.blob();

    if (blob != null) {
      download(blob, row.fileName);
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

  const handleDownloadClick = () => {
    downloadUpdate(`/api/files/download/${row.id}`);
  };

  const handleDeleteClick = async () => {
    await deleteUpdate(`/api/files/delete/${row.id}`);
    onDelete();
  };

  return (
    <Box>
      <IconButton onClick={handleDownloadClick}>
        <DownloadIcon />
      </IconButton>
      <IconButton onClick={handleDeleteClick}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}

export default function FileList() {
  const t = useTranslations();
  const locale = useLocale();
  const profile = useProfileStore((state) => state);

  const [requestBody, setRequestBody] = useState<{
    pageSize: number;
    page: number;
    sortBy: string[];
    filters: Record<string, any>;
  }>({
    pageSize: 12,
    page: 1,
    sortBy: ["-createdOn"],
    filters: { "createdBy.id": null },
  });

  const { data, loading, update } = useFetch(requestBody.filters["createdBy.id"] != null ? `/api/files` : "", "POST", {
    body: requestBody,
  });

  const { loading: uploadLoading, update: uploadUpdate } = useFetch("", "POST");

  useEffectOnce(() => {
    setRequestBody((prev) => ({ ...prev, filters: { "createdBy.id": profile.userData?.id } }));
  }, [profile.userData]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const elem = event.target;

    if (elem.files != null) {
      const formData = new FormData();
      formData.append("file", elem.files[0]);
      await uploadUpdate("/api/files/upload", formData);
      update();
    }
  };

  const handlePageChange = (page: number) => {
    setRequestBody((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleSortChange = (sort: GridSortModel) => {
    const sortBy = sort.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    setRequestBody((prev) => ({
      ...prev,
      sortBy,
    }));
  };

  return (
    <Box height={{ xs: "600px", md: "700px" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="primary">
          {t("Files")}
        </Typography>
        <Box>
          <Button component="label" startIcon={<UploadIcon />} loading={uploadLoading}>
            {t("Upload file")}
            <Input type="file" sx={{ display: "none" }} onChange={handleFileChange} />
          </Button>
        </Box>
      </Box>

      <GridTable
        columns={[
          {
            field: "id",
            headerName: "ID",
            width: 70,
          },
          {
            field: "fileName",
            headerName: "Name",
            width: 500,
          },
          {
            field: "metaFile.createdOn",
            headerName: "Upload date",
            width: 200,
            renderCell: ({ value }) => new Date(value).toLocaleDateString(locale),
          },
          {
            field: "metaFile.sizeText",
            headerName: "Size",
            width: 100,
            sortable: false,
          },
          {
            field: "metaFile.fileType",
            headerName: "Format",
            width: 200,
            sortable: false,
          },
          {
            field: "Actions",
            type: "actions",
            headerName: "",
            width: 100,
            sortable: false,
            renderCell: ({ row }) => <GridTableActionsCell row={row} onDelete={update} />,
          },
        ]}
        rows={data?.data ?? []}
        loading={loading}
        sortingMode="server"
        onSortModelChange={handleSortChange}
      ></GridTable>

      <Pagination
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        totalPages={data?.total ? Math.ceil(data.total / requestBody.pageSize) : 1}
        currentPage={requestBody.page}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
