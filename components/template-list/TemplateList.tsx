import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";

import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams, IGridColDef } from "@/components/ui/GridTable";

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

  const handleInMyTemplatesClick = async () => {};

  return (
    <Box sx={{ display: "flex", gap: "16px" }}>
      <Button variant="contained" sx={{ width: "132px", padding: "13px 29px" }} onClick={handleNewApplicationClick}>
        <Typography fontSize={14} fontWeight={600}>
          {t("New application")}
        </Typography>
      </Button>

      <Button
        variant="text"
        sx={{
          width: "132px",
          border: "1px dashed #CDCDCD",
          padding: "13px 29px",
          overflow: "hidden",
          "&:hover": { backgroundColor: "inherit" },
        }}
        onClick={handleInMyTemplatesClick}
      >
        <Typography fontSize={14} fontWeight={600}>
          {t("In my templates")}
        </Typography>
      </Button>
    </Box>
  );
}

export default function TemplateList() {
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
      sortable: false,
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
      headerName: "Actions",
      type: "acitons",
      sortable: false,
      width: 320,
      renderCell: ({ row }) => <GridTableActionsCell row={row} />,
    },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiBox-root": { backgroundColor: "#FFF" },
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
    const filterData = allData?.data.filter((field: any) => field.name.includes(keywordValue));
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

  return (
    <>
      <SearchBar onChange={handleKeywordChange} onClick={handleKeywordSearch} value={keywordValue} />

      <Box sx={{ height: "448px" }}>
        <GridTable rows={rowData?.data ?? []} columns={columns} sx={dataGridStyles} onFilterSubmit={onFilterSubmit} />
      </Box>

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </>
  );
}
