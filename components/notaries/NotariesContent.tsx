import React, { FC, useRef, useState } from "react";

import { ValueOf } from "next/dist/shared/lib/constants";

import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";

import NotariesFiltration from "./NotariesFiltration";
import NotariesList from "./NotariesList";
import useFetch from "@/hooks/useFetch";
import HeirNotFoundData from "../search-for-heirs/HeirNotFoundData";
import { useForm } from "react-hook-form";

interface IAppQueryParams {
  pageSize: number;
  page: number;
  sortBy: string[] | null;
  data?: {
    operator: string;
    criteria: Criteria[];
  };
  searchValue?: string | null;
  requestType?: string | null;
}

interface Criteria {
  value: any;
  fieldName: string;
  operator: string;
}

interface INotariesContentProps {}

interface INotaryFilterData {
  city: number | null;
  district: number | null;
  notaryDistrict: number | null;
  region: number | null;
  typeOfNotary: string | null;
  workDays: string | null;
}

const NotariesContent: FC<INotariesContentProps> = (props) => {
  const t = useTranslations();

  const form = useForm();

  const { handleSubmit, control, reset } = form;

  // Sort

  const [notariesSortOptions, setNotariesSortOptions] = useState("");

  const [radioValue, setRadioValue] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const [appQueryParams, setAppQueryParams] = useState<IAppQueryParams>({
    pageSize: 8,
    page: 1,
    sortBy: null,
    requestType: null,
    searchValue: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: notaryData, loading, update } = useFetch("/api/notaries", "POST", { body: appQueryParams });

  const updateAppQueryParams = (key: keyof IAppQueryParams, newValue: ValueOf<IAppQueryParams>) => {
    setAppQueryParams((prev) => {
      return { ...prev, [key]: newValue };
    });
  };

  const handlePageChange = (page: number) => {
    if (appQueryParams.page !== page) updateAppQueryParams("page", page);
  };

  const handleNotariesSortChange = (event: React.ChangeEvent<{ value: any }>) => {
    const value = event.target.value as any;
    setNotariesSortOptions(value);
    if (value) {
      updateAppQueryParams("sortBy", [value]);
    } else {
      updateAppQueryParams("sortBy", null);
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery) {
      return;
    }

    setAppQueryParams((prevParams) => ({
      ...prevParams,
      requestType: "keywordSearch",
      searchValue: searchQuery,
    }));
  };

  const onFilterClear = () => {
    reset();
    setRadioValue("");
    updateAppQueryParams("data", {
      operator: "and",
      criteria: [],
    });
  };

  // Filtration
  const buildFilterCriteria = (filterData: INotaryFilterData) => {
    const criteria: Criteria[] = [];

    if (filterData.city !== null) {
      criteria.push({
        fieldName: "address.city.id",
        operator: "=",
        value: filterData.city,
      });
    }

    if (filterData.district !== null) {
      criteria.push({
        fieldName: "address.district.id",
        operator: "=",
        value: filterData.district,
      });
    }

    if (filterData.notaryDistrict !== null) {
      criteria.push({
        fieldName: "notaryDistrict.id",
        operator: "=",
        value: filterData.notaryDistrict,
      });
    }

    if (filterData.region !== null) {
      criteria.push({
        fieldName: "address.region.id",
        operator: "=",
        value: filterData.region,
      });
    }

    if (filterData.workDays !== null) {
      criteria.push({
        fieldName: "workingDay.weekDayNumber",
        operator: "in",
        value: filterData.workDays.split(",").map(Number),
      });
    }

    if (filterData.typeOfNotary !== null) {
      criteria.push({
        fieldName: "typeOfNotary",
        operator: "=",
        value: filterData.typeOfNotary,
      });
    }

    return criteria;
  };

  const onFilterSubmit = (data: any) => {
    const newArr = buildFilterCriteria(data);
    const radioChecked = () => {
      if (radioValue === "roundClock") {
        return [
          {
            fieldName: "roundClock",
            operator: "=",
            value: true,
          },
          {
            fieldName: "checkOut",
            operator: "=",
            value: false,
          },
        ];
      } else if (radioValue === "checkOut") {
        return [
          {
            fieldName: "roundClock",
            operator: "=",
            value: false,
          },
          {
            fieldName: "checkOut",
            operator: "=",
            value: true,
          },
        ];
      } else {
        return [];
      }
    };

    const criteriaArr = newArr.concat(radioChecked());

    updateAppQueryParams("data", {
      criteria: criteriaArr,
      operator: "and",
    });
  };

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

      <NotariesFiltration
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        radioValue={radioValue}
        setRadioValue={setRadioValue}
        notariesSortOptions={notariesSortOptions}
        handleNotariesSortChange={handleNotariesSortChange}
        loading={loading}
        onFilterSubmit={onFilterSubmit}
        inputRef={inputRef}
        update={update}
        handleSubmit={handleSubmit}
        control={control}
        onFilterClear={onFilterClear}
      />
      {notaryData?.data && notaryData?.data?.length > 0 ? (
        <NotariesList
          handlePageChange={handlePageChange}
          loading={loading}
          data={notaryData}
          appQueryParams={appQueryParams}
        />
      ) : (
        <HeirNotFoundData />
      )}
    </Box>
  );
};

export default NotariesContent;
