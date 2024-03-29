import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import useEffectOnce from "@/hooks/useEffectOnce";
import { useProfileStore } from "@/stores/profile";
import { Box, IconButton, Input, Typography, useMediaQuery } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@/components/ui/Button";
import { GridTable } from "@/components/ui/GridTable";
import Pagination from "@/components/ui/Pagination";

function GridTableActionsCell({ row, onDelete }: { row: Record<string, any>; onDelete: Function }) {
  const { data: downloadData, update: downloadUpdate } = useFetch<Response>("", "GET", {
    returnResponse: true,
  });
  const { data: deletedData, update: deleteUpdate } = useFetch<Response>("", "POST", {
    returnResponse: true,
  });

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
    downloadUpdate("/api/files/download/" + row.id);
  };

  const handleDeleteClick = () => {
    deleteUpdate("/api/files/delete/" + row.id, {
      id: row.id,
      version: row.version,
    });
  };

  useEffectOnce(() => {
    if (deletedData == null || deletedData.body == null) return;
    onDelete();
  }, [deletedData]);

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
  const isMobileMedia = useMediaQuery("(max-width:800px)");
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

  const { update: attachmentsUpdate } = useFetch("", "PUT");
  const { data, loading, update } = useFetch(requestBody.filters["createdBy.id"] != null ? `/api/files` : "", "POST", {
    body: requestBody,
  });

  const { loading: uploadLoading, update: uploadUpdate } = useFetch("", "POST");

  useEffectOnce(() => {
    setRequestBody((prev) => ({ ...prev, filters: { "createdBy.id": profile.userData?.id } }));
  }, [profile.userData]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const elem = event.target;
    if (!elem.files) return;

    const formData = new FormData();
    formData.append("file", elem.files[0]);

    const res = await uploadUpdate("/api/files/upload", formData);
    if (res?.id == null && profile.userData?.id == null) return;
    await attachmentsUpdate(
      `/api/files/attachments/update?model=com.axelor.apps.base.db.Partner&id=${profile.userData?.id}`,
      { filesId: [{ id: res.id }] }
    );
    update();
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
    <Box>
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
      <Box sx={{ height: { xs: "760px", sm: "710px" } }}>
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
              field: "createdOn",
              headerName: "Upload date",
              width: 200,
              renderCell: ({ value }) => new Date(value).toLocaleDateString(locale),
            },
            {
              field: "sizeText",
              headerName: "Size",
              width: 100,
              sortable: false,
            },
            {
              field: "fileType",
              headerName: "Format",
              width: 200,
              sortable: false,
            },
            {
              field: "Actions",
              headerName: "Actions",
              width: 120,
              sortable: false,
              headerClassName: "pinnable",
              type: isMobileMedia ? "actions" : "string",
              cellClassName: isMobileMedia ? "actions-pinnable" : "actions-on-hover",
              renderCell: ({ row }) => <GridTableActionsCell row={row} onDelete={update} />,
            },
          ]}
          sx={{
            height: "100%",
          }}
          rows={data?.data ?? []}
          loading={loading}
          sortingMode="server"
          onSortModelChange={handleSortChange}
          rowHeight={65}
          autoHeight
        ></GridTable>
      </Box>

      <Pagination
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        totalPages={data?.total ? Math.ceil(data.total / requestBody.pageSize) : 1}
        currentPage={requestBody.page}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
