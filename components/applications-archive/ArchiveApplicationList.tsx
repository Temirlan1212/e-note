import React, { ChangeEvent, useEffect, useState } from "react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import useFetch from "@/hooks/useFetch";
import { Box, IconButton, Typography } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import Pagination from "@/components/ui/Pagination";
import { ArchiveApplicationListActions } from "@/components/applications-archive/ArchiveApplicationListActions";
import SearchBar from "@/components/ui/SearchBar";
import ClearIcon from "@mui/icons-material/Clear";
import { IApplication } from "@/models/application";
import { useProfileStore } from "@/stores/profile";

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues?: Record<string, (string | number)[]>;
  searchValue?: string;
  currentUser?: string;
}

export default function ArchiveApplicationList() {
  const t = useTranslations();
  const { locale } = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data: actionTypeData } = useFetch("/api/dictionaries/action-type", "POST");
  const { data: executorData } = useFetch(
    "/api/dictionaries/selection/notary.filter.saleorder.by.performer.type.select",
    "POST"
  );

  const profile = useProfileStore((state) => state);
  const currentUser = profile.getUserData()?.partner?.fullName;

  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: ["-createdDate"],
    currentUser: currentUser,
    filterValues: {},
    searchValue: "",
  });

  const { data, loading, update } = useFetch("/api/applications-archive", "POST", {
    body: appQueryParams,
  });

  useEffect(() => {
    setFilteredData(data?.data);
  }, [data?.data]);

  const updateAppQueryParams = (key: keyof IAppQueryParams, newValue: ValueOf<IAppQueryParams>) => {
    setAppQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    if (value.value.length > 0) updateAppQueryParams("page", 1);
  };

  const handlePageChange = (page: number) => {
    if (appQueryParams.page !== page) updateAppQueryParams("page", page);
  };

  const handleUpdateFilterValues = (value: IFilterSubmitParams) => {
    const type = value.rowParams.colDef.filter?.type;
    if (type === "dictionary") {
      const field = value.rowParams.colDef.filter?.field;
      const prevValue = appQueryParams.filterValues;

      if (field && Array.isArray(value.value)) {
        if (value.value.length > 0) {
          updateAppQueryParams("filterValues", {
            ...prevValue,
            [field]: value.value,
          });
        } else {
          const updatedFilterValues = { ...prevValue };
          delete updatedFilterValues[field];
          updateAppQueryParams("filterValues", updatedFilterValues);
        }
      }
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setAppQueryParams((prevParams) => ({
        ...prevParams,
        searchValue: "",
      }));
    }
    setSearchValue(value);
  };

  const handleSearchSubmit = () => {
    if (searchValue == null) return;
    setAppQueryParams((prevParams) => ({
      ...prevParams,
      searchValue: searchValue,
    }));
  };

  const handleReset = () => {
    setSearchValue("");
    setAppQueryParams((prevParams) => ({
      ...prevParams,
      searchValue: "",
    }));
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateAppQueryParams("sortBy", sortBy);
  };

  return (
    <Box height={{ xs: "600px", md: "700px" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="primary">
          {t("Archive of notarial actions")}
        </Typography>
      </Box>

      <Box
        sx={{
          marginBottom: "20px",
          width: { xs: "100%", md: "70%" },
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          onClick={handleSearchSubmit}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleReset} sx={{ visibility: searchValue === "" ? "hidden" : "visible" }}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      <GridTable
        columns={[
          {
            field: "applicant1",
            headerName: "Member-1",
            width: 300,
            sortable: true,
          },
          {
            field: "applicant2",
            headerName: "Member-2",
            width: 200,
            sortable: true,
          },
          {
            field: "documentAction",
            headerName: "Type of action",
            width: 300,
            editable: false,
            sortable: false,
            filter: {
              data: actionTypeData?.data ?? [],
              labelField: "title_" + locale,
              valueField: "value",
              type: "dictionary",
              field: "documentAction",
            },
          },
          {
            field: "createdDate",
            headerName: "Date",
            width: 170,
            sortable: true,
          },
          {
            field: "company",
            headerName: "Executor",
            width: 200,
            sortable: false,
            filter: {
              data: executorData?.data ?? [],
              labelField: locale === "ru" || locale === "kg" ? "title_ru" : "title",
              valueField: "value",
              type: "dictionary",
              field: "company",
            },
            cellClassName: "executorColumn",
          },
          {
            field: "actions",
            headerName: "",
            width: 200,
            sortable: false,
            type: "actions",
            cellClassName: "actions-pinnable",
            renderCell: (params) => <ArchiveApplicationListActions params={params} />,
          },
        ]}
        rows={filteredData ?? []}
        onFilterSubmit={handleFilterSubmit}
        onSortModelChange={handleSortByDate}
        cellMaxHeight="200px"
        loading={loading}
        sx={{
          height: "100%",
          ".executorColumn": {
            color: "success.main",
          },
        }}
        rowHeight={65}
      />

      <Pagination
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
        currentPage={appQueryParams.page}
        totalPages={data?.total ? Math.ceil(data.total / appQueryParams.pageSize) : 1}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
