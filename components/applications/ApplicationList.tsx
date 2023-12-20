import React, { ChangeEvent, useEffect, useState } from "react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useRouter } from "next/router";
import { useLocale, useTranslations } from "next-intl";
import { IActionType } from "@/models/action-type";
import { IStatus } from "@/models/application-status";
import { useProfileStore } from "@/stores/profile";
import useFetch, { FetchResponseBody } from "@/hooks/useFetch";
import { Alert, Box, Collapse, IconButton, Typography, useMediaQuery } from "@mui/material";
import { GridSortModel, GridValueGetterParams } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Button from "@/components/ui/Button";
import { GridTable, IFilterSubmitParams } from "@/components/ui/GridTable";
import Pagination from "@/components/ui/Pagination";
import Link from "@/components/ui/Link";
import { ApplicationListActions } from "./ApplicationListActions";
import { ApplicationListQRMenu } from "./ApplicationListQRMenu";
import SearchBar from "@/components/ui/SearchBar";
import ClearIcon from "@mui/icons-material/Clear";
import { IApplication } from "@/models/application";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IKeywordSchema, keywordSchema } from "@/validator-schemas/keyword";
import { format } from "date-fns";
import useEffectOnce from "@/hooks/useEffectOnce";

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[];
  filterValues: Record<string, (string | number)[]>;
}

interface ISearchParams {
  searchValue: string | null;
  pageSize: number;
  page: number;
}

interface ISearchedDataItem {
  SaleOrder: Partial<IApplication>;
  content: string;
  editUrl: string;
  id: number;
  title: string;
  url: string;
}

export default function ApplicationList() {
  const isMobileMedia = useMediaQuery("(max-width:800px)");
  const userData = useProfileStore((state) => state.userData);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchedData, setIsSearchedData] = useState(false);
  const { data: actionTypeData } = useFetch("/api/dictionaries/action-type", "POST");
  const { data: documentTypeData } = useFetch("/api/dictionaries/document-type", "POST");
  const { data: statusData } = useFetch("/api/dictionaries/application-status", "POST");
  const { data: executorData } = useFetch(
    "/api/dictionaries/selection/notary.filter.saleorder.by.performer.type.select",
    "POST"
  );
  const { data: licenseInfoData, update: getLicenseInfo, loading: licenseInfoLoading } = useFetch("", "POST");

  const form = useForm<IKeywordSchema>({
    resolver: yupResolver<IKeywordSchema>(keywordSchema),
  });

  const {
    formState: { errors },
    resetField,
    handleSubmit,
    register,
  } = form;

  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 7,
    page: 1,
    sortBy: ["-creationDate"],
    filterValues: {},
  });

  const [searchParams, setSearchParams] = useState<ISearchParams>({
    pageSize: 7,
    page: 1,
    searchValue: null,
  });

  const { update: getProduct } = useFetch("", "POST");

  const { data, loading, update } = useFetch<FetchResponseBody | null>("/api/applications", "POST", {
    body: appQueryParams,
  });

  useEffect(() => {
    setFilteredData(data?.data);
  }, [data?.data]);

  useEffectOnce(async () => {
    if (data?.data && data.data.length > 0) {
      const promises = data.data.map(async (item: { id: string }) => {
        const res = await getProduct("/api/applications/product/" + item?.id);
        if (res?.data?.length > 0) {
          const product = res.data[0].product;
          return { ...item, productName: product };
        }
        return item;
      });

      const updatedFilteredData = await Promise.all(promises);
      setFilteredData(updatedFilteredData as []);
    }
  }, [data]);

  const {
    data: searchedData,
    update: search,
    loading: searchLoading,
  } = useFetch<FetchResponseBody | null>("/api/applications/search", "POST", {
    body: searchParams,
  });

  useEffect(() => {
    if (searchedData?.total === 0) {
      setFilteredData([]);
      setIsSearchedData(true);
    }
    if (searchedData?.total) {
      const searchedDataArray = searchedData?.data?.map((item: ISearchedDataItem) => item?.SaleOrder) || [];

      if (searchedDataArray.length > 0) {
        setFilteredData(searchedDataArray);
        setIsSearchedData(true);
      }
    }
  }, [searchedData]);

  const updateAppQueryParams = (key: keyof IAppQueryParams, newValue: ValueOf<IAppQueryParams>) => {
    setAppQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const updateSearchParams = (key: keyof ISearchParams, newValue: ValueOf<ISearchParams>) => {
    setSearchParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handleFilterSubmit = async (value: IFilterSubmitParams) => {
    handleUpdateFilterValues(value);
    if (value.value.length > 0) updateAppQueryParams("page", 1);
  };

  const handlePageChange = (page: number) => {
    if (isSearchedData) {
      if (searchParams.page !== page) {
        return updateSearchParams("page", page);
      }
    }
    if (appQueryParams.page !== page) {
      updateAppQueryParams("page", page);
    }
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
      resetField("keyword");
      setFilteredData([]);
      setIsSearchedData(false);
      setAppQueryParams((prevParams) => ({
        ...prevParams,
      }));
    }
    setSearchValue(value);
  };

  const handleSearchSubmit = async () => {
    if (searchValue == null || searchValue === "") return;
    setSearchParams((prevParams) => ({
      ...prevParams,
      searchValue: searchValue,
    }));
  };

  const handleReset = () => {
    setSearchValue("");
    resetField("keyword");
    setFilteredData([]);
    setIsSearchedData(false);
    setAppQueryParams((prevParams) => ({
      ...prevParams,
    }));
  };

  const handleSortByDate = async (model: GridSortModel) => {
    const sortBy = model.map((s) => (s.sort === "asc" ? s.field : `-${s.field}`));
    updateAppQueryParams("sortBy", sortBy);
  };

  const handleDelete = async () => {
    const res = await update();
    if (res?.total) {
      const pageQuantity = Math.ceil(res.total / appQueryParams.pageSize);
      const page = appQueryParams.page;
      if (pageQuantity >= page) {
        isSearchedData ? updateSearchParams("page", page) : updateAppQueryParams("page", page);
      } else {
        isSearchedData ? updateSearchParams("page", pageQuantity) : updateAppQueryParams("page", pageQuantity);
      }
    }
  };

  const handleCreate = async () => {
    if (userData?.group?.name === "Notary") {
      const license = await handleCheckLicenseDate();
      if (license === true) {
        router.push("/applications/create");
      } else {
        setAlertOpen(true);
      }
    } else {
      router.push("/applications/create");
    }
  };

  const handleCheckLicenseDate = async () => {
    const res = await getLicenseInfo(userData?.id != null ? "/api/applications/license-info/" + userData?.id : "");

    const licenseTermUntil = new Date(res?.data?.[0]?.activeCompany?.licenseTermUntil);
    const currentDate = new Date();

    return licenseTermUntil > currentDate;
  };

  const calculateTotalPages = () => {
    const sourceData = isSearchedData ? searchedData : data;
    return Math.ceil((sourceData?.total || 1) / appQueryParams.pageSize);
  };

  return (
    <Box height={{ xs: "600px", md: "700px" }}>
      <Collapse in={alertOpen} sx={{ marginBottom: "10px", display: alertOpen ? "block" : "none" }}>
        <Alert severity="warning" onClose={() => setAlertOpen(false)}>
          {t("License has expired or is invalid")}
        </Alert>
      </Collapse>
      <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" color="primary">
          {t("Notarial actions")}
        </Typography>
        <Box>
          <Button
            onClick={handleCreate}
            loading={licenseInfoLoading}
            sx={{ py: "10px", px: "20px" }}
            component="label"
            startIcon={<PostAddIcon />}
          >
            {t("Create")}
          </Button>
        </Box>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(handleSearchSubmit)}
        sx={{
          marginBottom: "20px",
          width: { xs: "100%", md: "70%" },
        }}
      >
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleReset} sx={{ visibility: searchValue === "" ? "hidden" : "visible" }}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          name="keyword"
          error={!!errors.keyword?.message ?? false}
          helperText={errors.keyword?.message ? t(errors.keyword?.message, { min: 2, max: 30 }) : ""}
          register={register}
        />
      </Box>

      <GridTable
        columns={[
          {
            field: "actions",
            headerName: "Actions",
            width: isMobileMedia ? 50 : 290,
            sortable: false,
            type: isMobileMedia ? "actions" : "string",
            cellClassName: isMobileMedia ? "actions-pinnable" : "",
            renderCell: (params) => <ApplicationListActions params={params} onDelete={handleDelete} />,
          },
          {
            field: "QR",
            headerName: "QR",
            width: 70,
            sortable: false,
            renderCell: (params: any) => <ApplicationListQRMenu params={params} />,
          },
          {
            field: "notaryUniqNumber",
            headerName: "Unique number",
            width: 200,
            sortable: isSearchedData ? false : true,
            valueGetter: (params: GridValueGetterParams) => {
              return params.row?.notaryUniqNumber || t("not assigned");
            },
          },
          {
            field: "requester",
            headerName: "Side-1",
            width: 200,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              const requesters =
                params.value.length > 1
                  ? `${params.value[0]?.fullName} + ${params.value.length - 1} ${t("member shrinked")}.`
                  : params.value[0]?.fullName;
              return isSearchedData ? params.row?.requester?.[0]?.fullName : requesters || t("not assigned");
            },
          },
          {
            field: "members",
            headerName: "Side-2",
            width: 200,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => {
              const members =
                params.value.length > 1
                  ? `${params.value[0]?.fullName} + ${params.value.length - 1} ${t("member shrinked")}.`
                  : params.value[0]?.fullName;
              return isSearchedData ? params.row?.members?.[0]?.fullName : members || t("not assigned");
            },
          },
          // {
          //   field: "typeNotarialAction",
          //   headerName: "Type of action",
          //   width: 200,
          //   editable: false,
          //   sortable: false,
          //   filter: isSearchedData
          //     ? undefined
          //     : {
          //         data: actionTypeData?.data ?? [],
          //         labelField: "title_" + locale,
          //         valueField: "value",
          //         type: "dictionary",
          //         field: "typeNotarialAction",
          //       },
          //   valueGetter: (params: GridValueGetterParams) => {
          //     if (actionTypeData?.data != null) {
          //       const matchedItem = actionTypeData?.data.find(
          //         (item: IActionType) => item.value == (isSearchedData ? params.row.typeNotarialAction : params.value)
          //       );
          //       const translatedTitle = matchedItem?.[("title_" + locale) as keyof IActionType];
          //       return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof IActionType] ?? "";
          //     }
          //     return params.value;
          //   },
          // },
          {
            field: "productName",
            headerName: "Type of document",
            width: 250,
            editable: false,
            sortable: false,
            filter: isSearchedData
              ? undefined
              : {
                  data: documentTypeData?.data.filter((item: any) => item.isSystem === true) ?? [],
                  labelField: locale !== "en" ? "$t:name" : "name",
                  valueField: "id",
                  type: "dictionary",
                  field: "product.id",
                },
            valueGetter: (params: GridValueGetterParams) => {
              const nameKey = locale !== "en" ? "$t:name" : "name";
              const fullNameKey = locale !== "en" ? "$t:fullName" : "fullName";
              return isSearchedData
                ? params.row?.product?.[fullNameKey]
                : params.value?.[nameKey] || params.value?.["name"] || t("not assigned");
            },
          },
          {
            field: "statusSelect",
            headerName: "Status",
            description: "statusSelect",
            width: 200,
            editable: false,
            sortable: false,
            filter: isSearchedData
              ? undefined
              : {
                  data: statusData?.data ?? [],
                  labelField: "title_" + locale,
                  valueField: "value",
                  type: "dictionary",
                  field: "statusSelect",
                },
            valueGetter: (params: GridValueGetterParams) => {
              if (statusData != null) {
                const matchedItem = statusData?.data?.find((item: IStatus) => item.value == String(params.value));
                const translatedTitle = matchedItem?.[("title_" + locale) as keyof IActionType];
                return !!translatedTitle ? translatedTitle : matchedItem?.["title" as keyof IActionType] ?? "";
              }
              return params.value;
            },
          },
          {
            field: "createdOn",
            headerName: "Date",
            width: 170,
            sortable: isSearchedData ? false : true,
            valueGetter: (params: GridValueGetterParams) => {
              return format(new Date(params.value), "dd.MM.yyyy HH:mm");
            },
          },
        ]}
        rows={filteredData ?? []}
        onFilterSubmit={handleFilterSubmit}
        onSortModelChange={handleSortByDate}
        cellMaxHeight="200px"
        loading={loading || searchLoading}
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
        currentPage={isSearchedData ? searchParams.page : appQueryParams.page}
        totalPages={calculateTotalPages()}
        onPageChange={handlePageChange}
      />
    </Box>
  );
}
