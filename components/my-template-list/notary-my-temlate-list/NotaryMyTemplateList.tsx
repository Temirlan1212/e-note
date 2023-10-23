import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";

import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams, IGridColDef } from "@/components/ui/GridTable";

import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditNoteIcon from "@mui/icons-material/EditNote";

interface IRequestBody {
  criteria: Array<{
    fieldName: string;
    operator: string;
    value: string;
  }> | null;
  operator: string | null;
}

interface IRowData {
  status: number;
  offset: number;
  total: number;
  data: Array<Record<string, any>>;
}

function GridTableActionsCell({ row }: { row: Record<string, any> }) {
  const t = useTranslations();

  const handleNewApplicationClick = async () => {};

  const handleNewApplicationEdit = async () => {};

  const handleNewApplicationDelete = async () => {};

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <IconButton
        aria-label="post-add"
        sx={{
          width: "44px",
          height: "44px",
        }}
        onClick={handleNewApplicationClick}
      >
        <PostAddIcon color="success" />
      </IconButton>

      <IconButton
        sx={{
          width: "44px",
          height: "44px",
        }}
        onClick={handleNewApplicationEdit}
      >
        <EditNoteIcon sx={{ color: "#24334B" }} />
      </IconButton>

      <IconButton
        sx={{
          width: "44px",
          height: "44px",
        }}
        onClick={handleNewApplicationDelete}
      >
        <DeleteOutlineIcon sx={{ color: "#24334B" }} />
      </IconButton>
    </Box>
  );
}

export default function NotaryMyTemplateList() {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [keywordValue, setKeywordValue] = useState<string>("");
  const [rowData, setRowData] = useState<IRowData | null>(null);
  const t = useTranslations();

  const columns: IGridColDef[] = [
    {
      field: "id",
      headerName: "Template ID",
      width: 180,
    },
    {
      field: "name",
      headerName: "Template name",
      width: 340,
    },
    {
      field: "actionType",
      headerName: "Action type",
      width: 320,
      sortable: false,
      filter: {
        type: "simple",
      },
    },
    {
      field: "documentType",
      headerName: "Document type",
      width: 640,
      sortable: false,
      filter: {
        type: "simple",
      },
    },
    {
      field: "object",
      headerName: "Object",
      width: 320,
      sortable: false,
      filter: {
        type: "simple",
      },
    },
    {
      field: "objectType",
      headerName: "Object type",
      width: 320,
      sortable: false,
      filter: {
        type: "simple",
      },
    },
    {
      field: "actions",
      headerName: "Select action",
      type: "actions",
      sortable: false,
      width: 160,
      cellClassName: "actions-pinnable",
      renderCell: ({ row }) => <GridTableActionsCell row={row} />,
    },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiDataGrid-columnHeader": { padding: "16px" },
  };

  const [requestBody, setRequestBody] = useState<IRequestBody>({
    criteria: null,
    operator: null,
  });

  const { data: allData } = useFetch("/api/templates/", "POST");

  const { data: filteredData } = useFetch("/api/templates/", "POST", {
    body: requestBody,
  });

  const itemsPerPage = 6;
  const totalPages = allData != null && Array.isArray(allData.data) ? Math.ceil(allData.data.length / itemsPerPage) : 1;

  const onPageChange = (page: number) => {
    setSelectedPage(page);
  };

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordValue(event.target.value);
  };

  const handleKeywordSearch = () => {
    const filterData = allData?.data.filter((field: any) => field.name?.includes(keywordValue));
    const resultObject: IRowData = {
      status: 0,
      offset: 0,
      total: filterData.length,
      data: filterData,
    };
    setRowData(resultObject);
  };

  const onFilterSubmit = (value: IFilterSubmitParams) => {
    if (!Array.isArray(value.value)) {
      const field = value.rowParams.field;

      if (field != null) {
        setRequestBody((prev: any) => {
          return {
            ...prev,
            criteria: [
              {
                fieldName: field,
                operator: "like",
                value: `%${value.value}%`,
              },
            ],
            operator: "or",
          };
        });
        setRowData(filteredData);
      }
    }
  };

  useEffect(() => {
    if (allData && keywordValue === "") {
      setRowData(allData);
    }
  }, [allData, keywordValue]);

  const handleCreateTemplate = async () => {};

  return (
    <>
      <SearchBar onChange={handleKeywordChange} onClick={handleKeywordSearch} value={keywordValue} />

      <Box sx={{ height: "448px" }}>
        <GridTable rows={rowData?.data ?? []} columns={columns} sx={dataGridStyles} onFilterSubmit={onFilterSubmit} />
      </Box>

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={{ xs: "unset", md: "center" }}
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: "20px", md: 0 }}
      >
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>{t("Hand templates")}</Typography>
        <Button sx={{ width: "auto", padding: "14px 59px" }} onClick={handleCreateTemplate}>
          {t("Create new template")}
        </Button>
      </Box>

      <Box sx={{ height: "448px" }}>
        <GridTable rows={rowData?.data ?? []} columns={columns} sx={dataGridStyles} onFilterSubmit={onFilterSubmit} />
      </Box>

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </>
  );
}
