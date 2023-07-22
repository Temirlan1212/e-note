import { Box, IconButton, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { GridColDef, GridRowId, GridSortModel } from "@mui/x-data-grid";
import { GridTable } from "../ui/GridTable";
import Pagination from "../ui/Pagination";
import useFetch from "@/hooks/useFetch";
import { useState } from "react";
import Button from "../ui/Button";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import useEffectOnce from "@/hooks/useEffectOnce";

function GridTableActionsCell({ row }: { row: any }) {
  const url = "/api/files/download?id=";
  const { data, update } = useFetch<Response>(url, "GET", {
    headers: { "Content-Type": "application/octet-stream" },
    useEffectOnce: false,
    returnResponse: true,
  });

  useEffectOnce(() => {
    const reader = data?.body?.getReader();
    console.log(reader);
    // download(await data?.blob());
  }, [data]);

  const download = (blob: Blob) => {
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.style.display = "none";
    // a.href = url;
    // // the filename you want
    // a.download = "test.txt";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);
  };

  const handleDownloadClick = () => {
    update(url + row.id);
  };

  const handleDeleteClick = () => {
    console.log(row.id);
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

const columns: GridColDef[] = [
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
    renderCell: ({ value }) => new Date(value).toLocaleDateString(useLocale()),
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
    renderCell: ({ row }) => <GridTableActionsCell row={row} />,
  },
];

export default function FilesList() {
  const t = useTranslations();

  const [pagination, setPagination] = useState<{ pageSize: number; page: number; sortBy: string[] }>({
    pageSize: 12,
    page: 1,
    sortBy: [],
  });
  const { data, loading } = useFetch(`/api/files/file-list`, "POST", {
    body: pagination,
  });

  const handleUploadClick = () => {
    // ToDo
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleSortChange = (sort: GridSortModel) => {
    const sortBy = sort.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    setPagination({
      ...pagination,
      sortBy,
    });
  };

  return (
    <Box pt={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" color="success.main">
          {t("Files")}
        </Typography>
        <Box>
          <Button startIcon={<UploadIcon />} onClick={handleUploadClick}>
            {t("Upload file")}
          </Button>
        </Box>
      </Box>

      <GridTable
        columns={columns}
        rows={data?.data ?? []}
        loading={loading}
        sortingMode="server"
        onSortModelChange={handleSortChange}
      ></GridTable>
      <Pagination
        totalPages={data?.total ? Math.ceil(data.total / pagination.pageSize) : 1}
        currentPage={pagination.page}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
