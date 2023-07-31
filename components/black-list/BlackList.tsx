import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
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
import { GridTable } from "../ui/GridTable";

export default function BlackList() {
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const [keywordValue, setKeywordValue] = useState<string>("");
  const [reasonValue, setReasonValue] = useState<string>("");
  const [pinValue, setPinValue] = useState<string>("");
  const [fullNameValue, setFullNameValue] = useState<string>("");
  const [rowData, setRowData] = useState<any>({});
  const t = useTranslations();

  const initStateFilterFields = [
    { fieldName: "blockingReason.name", operator: "like", value: reasonValue ? `%${reasonValue}%` : null },
    { fieldName: "partner.fullName", operator: "like", value: fullNameValue ? `%${fullNameValue}%` : null },
    { fieldName: "partner.personalNumber", operator: "like", value: pinValue ? `%${pinValue}%` : null },
  ];

  const initStateKeywordFilterFields = [
    { fieldName: "blockingReason.name", operator: "like", value: keywordValue ? `%${keywordValue}%` : null },
    { fieldName: "partner.fullName", operator: "like", value: keywordValue ? `%${keywordValue}%` : null },
    { fieldName: "createdBy.fullName", operator: "like", value: keywordValue ? `%${keywordValue}%` : null },
    { fieldName: "partner.personalNumber", operator: "like", value: keywordValue ? `%${keywordValue}%` : null },
  ];

  const dataGridStyles = {
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": { padding: "10px 16px" },
    ".MuiBox-root": { backgroundColor: "#FFF" },
    ".MuiDataGrid-columnHeader": { padding: "16px" },
  };

  const [requestBody, setRequestBody] = useState<any>({
    filterFields: null,
    operator: null,
  });

  const { data: allData } = useFetch("/api/black-list/all-data", "POST");
  const { data: filteredData } = useFetch("/api/black-list/filtered-data", "POST", {
    body: requestBody,
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(allData?.data.length / itemsPerPage);

  const onPageChange = (page: number) => {
    setSelectedPage(page);
  };

  const handleActionsPopupToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(anchorEl == null ? event.currentTarget : null);
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

  const handleFilterSearch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const filteredFields = initStateFilterFields.filter((field) => field.value !== null && field.value !== "");
    setRequestBody((prev: any) => {
      return { ...prev, filterFields: filteredFields, operator: "and" };
    });
    setRowData(filteredData);
  };

  const handleKeywordSearch = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const filteredFields = initStateKeywordFilterFields.filter((field) => field.value !== null && field.value !== "");
    setRequestBody((prev: any) => {
      return { ...prev, filterFields: filteredFields, operator: "or" };
    });
    setRowData(filteredData);
  };

  useEffect(() => {
    if (allData && reasonValue === "" && pinValue === "" && fullNameValue === "") {
      setRowData(allData);
    }
  }, [allData, reasonValue, pinValue, fullNameValue]);

  const columns = [
    { field: "partner.personalNumber", headerName: "Subject PIN", width: 200 },
    { field: "partner.fullName", headerName: "Subject full name", width: 320 },
    { field: "partner.birthDate", headerName: "Date of birth", width: 210 },
    {
      field: "createdOn",
      headerName: "Entry date",
      width: 180,
      valueGetter: (params: any) => {
        const createdOn = new Date(params.value);
        const day = createdOn.getDate();
        const month = createdOn.getMonth() + 1;
        const year = createdOn.getFullYear();
        const formattedCreatedOn = `${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}.${year}`;
        return formattedCreatedOn;
      },
    },
    { field: "createdBy.fullName", headerName: "Who created", width: 320 },
    {
      field: "blockingReason.name",
      headerName: "Reason for blacklisting",
      type: "acitons",
      sortable: false,
      width: 340,
      filter: {
        type: "simple",
      },
      renderCell: (params: any) => (
        <Grid sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <Typography fontSize={14} fontWeight={500}>
            {params.row["blockingReason.name"] ?? ""}
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
              <Button sx={{ background: "#3F5984", padding: "13px 29px", "&:hover": { backgroundColor: "#3F5984" } }}>
                <Typography fontSize={14} fontWeight={600}>
                  {t("Редактировать")}
                </Typography>
              </Button>

              <Button sx={{ border: "1px dashed #CDCDCD", "&:hover": { backgroundColor: "inherit" } }} variant="text">
                <Typography color="success" fontSize={14} fontWeight={600}>
                  {t("Удалить")}
                </Typography>
              </Button>
            </Grid>
          </Popover>
        </Grid>
      ),
    },
  ];

  return (
    <>
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
              height: "56px",
              gap: "8px",
              padding: "13px 22px",
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
          <InputLabel htmlFor="input-reason" sx={{ fontSize: "14px", fontWeight: "500" }}>
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
          <InputLabel htmlFor="input-pin" sx={{ fontSize: "14px", fontWeight: "500" }}>
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
          <InputLabel htmlFor="input-full-name" sx={{ fontSize: "14px", fontWeight: "500" }}>
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
              height: "56px",
              gap: "8px",
              padding: "13px 22px",
            }}
            fullWidth
            startIcon={<ContentPasteSearchIcon />}
            onClick={handleFilterSearch}
          >
            <Typography fontWeight={600}>{t("Поиск по критериям")}</Typography>
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ height: "448px" }}>
        <GridTable
          rows={rowData?.data ?? []}
          columns={columns}
          filterData={{
            data: {
              rows: [rowData?.data],
            },
            filterField: { field: "id" },
          }}
          sx={dataGridStyles}
        />
      </Box>

      <Box alignSelf="center">
        <Pagination currentPage={selectedPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </>
  );
}
