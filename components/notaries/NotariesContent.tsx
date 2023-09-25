import React, { FC, useState } from "react";
import { ValueOf } from "next/dist/shared/lib/constants";
import { useTranslations } from "next-intl";
import { Box, IconButton, Typography } from "@mui/material";
import NotariesList from "./NotariesList";
import useFetch from "@/hooks/useFetch";
import HeirNotFoundData from "../search-for-heirs/HeirNotFoundData";
import { useForm } from "react-hook-form";
import { INotariesSchema } from "@/validator-schemas/notaries";
import SearchBar from "@/components/ui/SearchBar";
import NotariesForm from "./NotariesForm";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";
import ClearIcon from "@mui/icons-material/Clear";

export interface INotariesQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[] | null;
  searchValue?: string | null;
  requestType?: string | null;
  filterData?: any;
}

interface INotariesContentProps {}

const isObject = (value: any) => {
  return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Function);
};

const NotariesContent: FC<INotariesContentProps> = (props) => {
  const t = useTranslations();

  const form = useForm<INotariesSchema>();
  const { reset, register, watch } = form;

  const [isCollapsed, setisCollapsed] = useState(true);
  const [notariesQueryParams, setNotariesQueryParams] = useState<INotariesQueryParams>({
    pageSize: 8,
    page: 1,
    sortBy: null,
    requestType: null,
    searchValue: null,
    filterData: null,
  });

  const { data: notaryData, loading } = useFetch("/api/notaries", "POST", { body: notariesQueryParams });

  const updateNotariesQueryParams = (key: keyof INotariesQueryParams, newValue: ValueOf<INotariesQueryParams>) => {
    setNotariesQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handlePageChange = (page: number) => {
    if (notariesQueryParams.page !== page) updateNotariesQueryParams("page", page);
  };

  const handleNotariesSortChange = (event: React.ChangeEvent<{ value: any }>) => {
    const value = event.target.value as any;
    if (value) {
      updateNotariesQueryParams("sortBy", [value]);
    } else {
      updateNotariesQueryParams("sortBy", null);
    }
  };

  const handleSearchSubmit = () => {
    const searchValue = form.getValues().keyWord;
    if (searchValue == null) return;
    updateNotariesQueryParams("searchValue", searchValue);
  };

  const handleSearchReset = () => {
    reset({ keyWord: "" });
    if (notariesQueryParams.searchValue) {
      updateNotariesQueryParams("searchValue", "");
    }
  };

  const handleFormReset = () => {
    reset();
    updateNotariesQueryParams("filterData", null);
  };

  const handleFormSubmit = (data: INotariesSchema) => {
    console.log(data);
    const filteredData: any = {};
    for (const key in data) {
      const item = data[key as keyof typeof data];
      if (data.hasOwnProperty(key)) {
        if (isObject(item)) filteredData[key] = (item as any)?.id ?? (item as any)?.value;
        if (!isObject(item)) filteredData[key] = item === "" ? null : item;
      }
    }

    updateNotariesQueryParams("filterData", filteredData);
  };

  const handleToggleCollapse = () => setisCollapsed(!isCollapsed);

  return (
    <Box component="section" py={10} display="flex" flexDirection="column" gap="60px" marginBottom="40px">
      <Typography
        component="h1"
        sx={{
          fontSize: "36px",
          fontWeight: 600,
        }}
      >
        {t("Register of Notaries of the Kyrgyz Republic")}
      </Typography>

      <Box display="flex" flexDirection="column" gap={{ xs: "25px", md: "40px" }}>
        <SearchBar
          register={register}
          onClick={handleSearchSubmit}
          name="keyWord"
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => watch("keyWord") && handleSearchReset()}
                sx={{ visibility: watch("keyWord") ? "visible" : "hidden" }}
              >
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        sx={{ gap: "20px", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "start", md: "center" } }}
      >
        <Button
          startIcon={<FilterAltOffOutlinedIcon />}
          onClick={handleToggleCollapse}
          buttonType="secondary"
          sx={{ width: { sx: "100%", md: "320px" }, padding: "10px 0" }}
        >
          {t("Collapse the filter")}
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "start", md: "center" },
            gap: "15px",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{t("Sort")}:</Typography>
          <Select
            register={register}
            name="notariesSort"
            data={[
              { value: "partner.rating", label: t("By ratings") },
              { value: "partner.name", label: t("Alphabetically") },
            ]}
            onChange={handleNotariesSortChange}
            selectType="success"
          />
        </Box>
      </Box>

      <Box maxHeight={isCollapsed ? "1000px" : 0} overflow="hidden" sx={{ transition: "max-height 0.3s ease-out" }}>
        <NotariesForm form={form} onFormSubmit={handleFormSubmit} onFormReset={handleFormReset} />
      </Box>

      {notaryData?.data && notaryData?.data?.length > 0 ? (
        <NotariesList
          handlePageChange={handlePageChange}
          loading={loading}
          data={notaryData}
          notariesQueryParams={notariesQueryParams}
        />
      ) : (
        <HeirNotFoundData />
      )}
    </Box>
  );
};

export default NotariesContent;
