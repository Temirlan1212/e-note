import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";

import { Box, Typography, InputLabel } from "@mui/material";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Pagination from "../ui/Pagination";
import SearchBar from "../ui/SearchBar";
import { GridTable, IFilterSubmitParams, IGridColDef } from "../ui/GridTable";

interface IRowData {
  status?: number;
  offset?: number;
  total?: number;
  data?: Array<Record<string, any>>;
}

interface IRequestBody {
  searchType: string | null;
  values: {
    [key: string]: string | null;
  };
  operator: string | null;
}

function GridTableActionsCell({ row }: { row: Record<string, any> }) {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const t = useTranslations();

  const handleActionsPopupToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
  };

  const handleDeleteClick = async () => {};

  const handleEditClick = async () => {};

  return (
    <Grid sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
      <Typography fontSize={14} fontWeight={500}>
        {row["blockingReason.name"] ?? ""}
      </Typography>

      <IconButton sx={{ visibility: anchorEl ? "visible" : "hidden" }} onClick={handleActionsPopupToggle}>
        <MoreVertIcon color="info" />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleActionsPopupToggle}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            boxShadow: "none",
          },
        }}
      >
        <Grid sx={{ padding: "16px 32px", height: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Button
            sx={{
              background: "#3F5984",
              "&:hover": {
                backgroundColor: "#3F5984",
              },
            }}
            onClick={handleEditClick}
          >
            <Typography fontSize={14} fontWeight={600}>
              {t("Редактировать")}
            </Typography>
          </Button>

          <Button
            sx={{
              border: "1px dashed #CDCDCD",
              "&:hover": {
                backgroundColor: "inherit",
              },
            }}
            variant="text"
            onClick={handleDeleteClick}
          >
            <Typography color="success" fontSize={14} fontWeight={600}>
              {t("Удалить")}
            </Typography>
          </Button>
        </Grid>
      </Popover>
    </Grid>
  );
}

export default function BlackList() {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [keywordValue, setKeywordValue] = useState<string>("");
  const [reasonValue, setReasonValue] = useState<string>("");
  const [pinValue, setPinValue] = useState<string>("");
  const [fullNameValue, setFullNameValue] = useState<string>("");
  const [rowData, setRowData] = useState<IRowData | null>(null);
  const t = useTranslations();
  const locale = useLocale();

  const columns: IGridColDef[] = [
    {
      field: "partner.personalNumber",
      headerName: "Subject PIN",
      width: 200,
    },
    {
      field: "partner.fullName",
      headerName: "Subject full name",
      width: 320,
    },
    {
      field: "partner.birthDate",
      headerName: "Date of birth",
      width: 210,
    },
    {
      field: "createdOn",
      headerName: "Entry date",
      width: 180,
      renderCell: ({ value }) => new Date(value).toLocaleDateString(locale),
    },
    {
      field: "createdBy.fullName",
      headerName: "Who created",
      width: 320,
    },
    {
      field: "blockingReason.name",
      headerName: "Reason for blacklisting",
      type: "acitons",
      width: 340,
      sortable: false,
      filter: {
        type: "simple",
      },
      renderCell: ({ row }) => <GridTableActionsCell row={row} />,
    },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiDataGrid-row": { "&:hover": { "& .MuiIconButton-root": { visibility: "visible" } } },
    ".MuiBox-root": { backgroundColor: "#FFF" },
    ".MuiDataGrid-columnHeader": { padding: "16px" },
  };

  const [requestBody, setRequestBody] = useState<IRequestBody>({
    operator: null,
    searchType: null,
    values: {},
  });

  const { data: allData } = useFetch("/api/black-list/", "POST");
  const { data: filteredData } = useFetch("/api/black-list/", "POST", {
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

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReasonValue(event.target.value);
  };

  const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPinValue(event.target.value);
  };

  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullNameValue(event.target.value);
  };

  const handleKeywordSearch = async () => {
    setRequestBody((prev: any) => ({
      ...prev,
      operator: "or",
      searchType: "keyword",
      values: { keywordValue },
    }));

    setRowData(filteredData);
  };

  const handleCriteriaSearch = () => {
    setRequestBody((prev: any) => ({
      ...prev,
      searchType: "criteria",
      operator: "and",
      values: { reasonValue, pinValue, fullNameValue },
    }));

    setRowData(filteredData);
  };

  const onFilterSubmit = (value: IFilterSubmitParams) => {
    if (!Array.isArray(value.value)) {
      const field = value.rowParams.field;
      const searchedValue = value.value;

      if (field != null) {
        setRequestBody((prev: any) => {
          return {
            ...prev,
            operator: "or",
            searchType: "filter",
            fieldName: field,
            values: { searchedValue },
          };
        });
        setRowData(filteredData);
      }
    }
  };

  useEffect(() => {
    if (allData && reasonValue === "" && pinValue === "" && fullNameValue === "" && keywordValue === "") {
      setRowData(allData);
    }
  }, [allData, reasonValue, pinValue, fullNameValue, keywordValue]);

  return (
    <>
      <Typography typography="h4" color="primary">
        {t("Black list")}
      </Typography>
      <Grid
        container
        spacing={{ xs: 2.5, sm: 3.75, md: 3.75 }}
        justifyContent="space-between"
        sx={{
          display: { xs: "flex", sm: "flex" },
          flexDirection: { xs: "column-reverse", sm: "column", md: "unset" },
          alignItems: { xs: "unset", sm: "flex-end", md: "unset" },
        }}
      >
        <Grid item xs={12} sm={12} md={9} sx={{ alignSelf: "stretch" }}>
          <SearchBar onChange={handleKeywordChange} onClick={handleKeywordSearch} value={keywordValue} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="success"
            sx={{
              height: "auto",
              gap: "8px",
              padding: "9.5px 22px",
            }}
            fullWidth
            startIcon={<PostAddIcon />}
          >
            <Typography fontWeight={600}>{t("Enter subject")}</Typography>
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2.5, sm: 3.75, md: 3.75 }} sx={{ alignItems: "end" }}>
        <Grid item xs={12} sm={12} md={3}>
          <InputLabel htmlFor="input-reason" sx={{ fontSize: "14px", fontWeight: "500", color: "#24334B" }}>
            {t("Reason")}
          </InputLabel>
          <Input
            placeholder={t("Enter a reason")}
            variant="outlined"
            name="input-reason"
            onChange={handleReasonChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <InputLabel htmlFor="input-pin" sx={{ fontSize: "14px", fontWeight: "500", color: "#24334B" }}>
            {t("Subject PIN")}
          </InputLabel>
          <Input
            placeholder={t("Enter PIN")}
            variant="outlined"
            name="input-pin"
            onChange={handlePinChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <InputLabel htmlFor="input-full-name" sx={{ fontSize: "14px", fontWeight: "500", color: "#24334B" }}>
            {t("Subject full name")}
          </InputLabel>
          <Input
            placeholder={t("Enter full name")}
            variant="outlined"
            name="input-full-name"
            onChange={handleFullNameChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            color="success"
            sx={{
              height: "auto",
              gap: "8px",
              padding: "9.5px 22px",
            }}
            fullWidth
            startIcon={<ContentPasteSearchIcon />}
            onClick={handleCriteriaSearch}
          >
            <Typography fontWeight={600}>{t("Search by criteria")}</Typography>
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ height: "448px" }}>
        <GridTable rows={rowData?.data ?? []} columns={columns} sx={dataGridStyles} onFilterSubmit={onFilterSubmit} />
      </Box>

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </>
  );
}
