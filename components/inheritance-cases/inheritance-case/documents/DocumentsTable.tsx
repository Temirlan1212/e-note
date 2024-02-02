import React from "react";
import { format, isValid } from "date-fns";
import { useTranslations } from "next-intl";
import { GridValueGetterParams } from "@mui/x-data-grid";
import { GridTable, IGridColDef } from "@/components/ui/GridTable";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { TableActions } from "./components/TableActions";
import UploadIcon from "@mui/icons-material/Upload";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const InheritanceCasesTable = React.forwardRef<HTMLDivElement, any>(({ className, caseId, ...props }, ref) => {
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const t = useTranslations();

  const {
    data: documentsInfo,
    loading: documentsLoading,
    update: getDocuments,
  } = useFetch<FetchResponseBody | null>(caseId ? "/api/inheritance-cases/documents/" + caseId : "", "POST");

  const { loading: uploadLoading, update: uploadDocument } = useFetch("", "POST");

  const { update: attachmentsUpdate } = useFetch("", "PUT");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const elem = event.target;
    if (!elem.files) return;

    const formData = new FormData();
    formData.append("file", elem.files[0]);

    const res = await uploadDocument("/api/inheritance-cases/documents/upload", formData);
    if (res?.id == null && caseId == null) return;
    await attachmentsUpdate(`/api/inheritance-cases/documents/update?id=${caseId}`, {
      filesId: [{ id: res.id }],
    });
    getDocuments();
  };

  const columns: IGridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
    },
    {
      field: "fileName",
      headerName: "Name",
      width: 400,
    },
    {
      field: "createdOn",
      headerName: "Upload date",
      width: 200,
      valueGetter: (params: GridValueGetterParams) => {
        if (!params.value) return t("absent");
        const date = new Date(params.value);
        return isValid(date) ? format(date, "dd.MM.yyyy HH:mm") : t("absent");
      },
    },
    {
      field: "metaFile.sizeText",
      headerName: "Size",
      width: 200,
      sortable: false,
    },
    {
      field: "fileType",
      headerName: "Format",
      width: 200,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      headerClassName: "pinnable",
      width: isMobileMedia ? 250 : 120,
      sortable: false,
      type: isMobileMedia ? "actions" : "string",
      cellClassName: isMobileMedia ? "actions-pinnable" : "actions-on-hover",
      renderCell: (params) => <TableActions params={params} refreshData={getDocuments} />,
    },
  ];

  const rows = documentsInfo ? (Array.isArray(documentsInfo?.data) ? documentsInfo.data ?? [] : []) : [];

  return (
    <Box ref={ref}>
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
        {...props}
        loading={documentsLoading}
        rows={rows}
        columns={columns}
        cellMaxHeight="200px"
        rowHeight={65}
        autoHeight
        sx={{
          ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": {
            padding: "10px 16px",
            whiteSpace: "normal",
          },
          ".MuiDataGrid-columnHeader": { padding: "16px" },
          ...(props.sx || {}),
        }}
      />
    </Box>
  );
});

InheritanceCasesTable.displayName = "InheritanceCasesTable";
export default InheritanceCasesTable;
