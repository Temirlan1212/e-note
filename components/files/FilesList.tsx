import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useEffectOnce from "@/hooks/useEffectOnce";
import { useProfileStore } from "@/stores/profile";
import { GridTable } from "../ui/GridTable";
import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 500,
  },
  {
    field: "firstName",
    headerName: "First name",
    width: 500,
  },
];

const rows: readonly GridValidRowModel[] = [
  { id: 1, lastName: "Snow", firstName: "Jon" },
  { id: 2, lastName: "Lannister", firstName: "Cersei" },
];

export default function FilesList() {
  const t = useTranslations();
  const profile = useProfileStore((state) => state);

  const [fileList, setFileList] = useState<any[] | null>(null);

  useEffectOnce(() => {
    handleFileListLoad();
  });

  const handleFileListLoad = async () => {
    const response = await fetch("/api/files/file-list", {
      method: "POST",
      headers: { "Content-Type": "application/json", "server-cookie": profile.cookie ?? "" },
      body: null,
    });

    if (!response.ok) return;

    const responseData = await response.json();

    if (responseData.data != null) {
      setFileList(responseData.data);
    }
  };

  return (
    <Box>
      <GridTable columns={columns} rows={rows}></GridTable>
    </Box>
  );
}
