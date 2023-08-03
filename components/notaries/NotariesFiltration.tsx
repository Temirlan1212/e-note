import React, { ChangeEvent, FC, useState } from "react";

import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Box, InputLabel, RadioGroup, Typography } from "@mui/material";
import FilterAltOffOutlinedIcon from "@mui/icons-material/FilterAltOffOutlined";

import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import Select from "../ui/Select";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import EraserIcon from "@/public/icons/eraser.svg";
import Radio from "../ui/Radio";
import useFetch from "@/hooks/useFetch";

interface INotariesFiltrationProps {
  setSearchQuery: (val: string) => void;
  searchQuery: string;
  onSearchSubmit: () => void;
  handleFilter: (val: any) => void;
  radioValue: any;
  setRadioValue: any;
  notariesSortOptions: any;
  handleNotariesSortChange: any;
  onFilterSubmit: (val: any) => void;
  loading?: boolean;
  filterCriteria?: any;
  inputRef?: any;
}

const NotariesFiltration: FC<INotariesFiltrationProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  handleFilter,
  radioValue,
  setRadioValue,
  notariesSortOptions,
  handleNotariesSortChange,
  onFilterSubmit,
  loading,
}) => {
  const t = useTranslations();

  const form = useForm();

  const {
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = form;

  // Search

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  // Filtration

  const { data: regionsData } = useFetch("/api/citizens-registry/dictionaries/regions", "POST");
  const { data: citiesData } = useFetch("/api/citizens-registry/dictionaries/cities", "POST");
  const { data: districtsData } = useFetch("/api/citizens-registry/dictionaries/districts", "POST");
  const { data: notaryAreaData } = useFetch("/api/citizens-registry/dictionaries/notary-area", "POST");

  const { data: workDaysAreaData } = useFetch("/api/citizens-registry/dictionaries/work-days", "GET");
  const { data: notaryTypesData } = useFetch("/api/citizens-registry/dictionaries/notary-types", "GET");

  const optionSelectData: any = [
    {
      id: 1,
      label: t("Region"),
      name: "region",
      fieldName: "address.region.id",
      operator: "=",
      type: "prime",
      options: regionsData?.data,
    },
    {
      id: 2,
      label: t("District"),
      name: "district",
      fieldName: "address.district.id",
      operator: "=",
      type: "prime",
      options: districtsData?.data,
    },
    {
      id: 3,
      label: t("City"),
      name: "city",
      fieldName: "address.city.id",
      operator: "=",
      type: "prime",
      options: citiesData?.data,
    },
    {
      id: 4,
      label: t("Type of notary"),
      name: "typeOfNotary",
      fieldName: "typeOfNotary",
      operator: "=",
      type: "second",
      options: notaryTypesData?.data,
    },
    {
      id: 5,
      label: t("Working days"),
      name: "workDays",
      fieldName: "workingDay.weekDayNumber",
      operator: "in",
      type: "second",
      options: workDaysAreaData?.data,
    },
    {
      id: 6,
      label: t("Notary district"),
      name: "notaryDistrict",
      fieldName: "notaryDistrict.id",
      operator: "=",
      type: "prime",
      options: notaryAreaData?.data,
    },
  ];

  // Show/Hide
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Sort
  const notariesSortOptionsData = [{ value: "partner.simpleFullName", label: "В алфавитном порядке" }];

  return (
    <Box
      display="flex"
      sx={{
        gap: {
          xs: "25px",
          md: "40px",
        },
      }}
      flexDirection="column"
    >
      <SearchBar value={searchQuery} onChange={handleSearchChange} onClick={onSearchSubmit} loading={loading} />
      <Box
        display="flex"
        justifyContent="space-between"
        sx={{
          gap: "20px",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: {
            xs: "start",
            md: "center",
          },
        }}
      >
        <Button
          startIcon={<FilterAltOffOutlinedIcon />}
          onClick={toggleVisibility}
          buttonType="secondary"
          sx={{
            width: {
              sx: "100%",
              md: "320px",
            },
            padding: "10px 0",
            ":hover": {
              backgroundColor: "#3F5984",
            },
          }}
        >
          {t("Collapse the filter")}
        </Button>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            alignItems: {
              xs: "start",
              md: "center",
            },
            gap: "15px",
          }}
        >
          <Typography
            sx={{
              color: "#24334B",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {t("Sort")}:
          </Typography>
          <Select
            data={notariesSortOptionsData}
            value={notariesSortOptions}
            onChange={handleNotariesSortChange}
            selectType="success"
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: {
            xs: "25px",
            md: "40px",
          },
          maxHeight: isVisible ? "1000px" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease-out",
        }}
        component="form"
        onSubmit={handleSubmit(onFilterSubmit)}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gridTemplateRows: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gridColumnGap: {
              xs: "20px",
              md: "40px",
            },
            gridRowGap: {
              xs: "20px",
              md: "30px",
            },
          }}
        >
          {optionSelectData.map((el: any) => {
            return (
              <Controller
                control={control}
                name={el.name}
                key={el.id}
                defaultValue={null}
                render={({ field, fieldState }) => (
                  <Box display="flex" flexDirection="column" width="100%">
                    <InputLabel
                      sx={{
                        fontSize: "14px",
                        marginBottom: "5px",
                        fontWeight: 500,
                        color: "#24334B",
                      }}
                    >
                      {el.label}
                    </InputLabel>
                    <Select
                      placeholder="select"
                      labelField={el.type === "second" ? "title" : "name"}
                      valueField={el.type === "second" ? "value" : "id"}
                      data={el.options}
                      selectType={fieldState.error?.message ? "danger" : "success"}
                      helperText={fieldState.error?.message ? t(fieldState.error?.message) : ""}
                      value={field.value != null ? field.value : ""}
                      onBlur={field.onBlur}
                      onChange={(...event: any[]) => {
                        field.onChange(...event);
                      }}
                    ></Select>
                  </Box>
                )}
              />
            );
          })}
        </Box>
        <RadioGroup
          sx={{ display: "flex", flexDirection: "row" }}
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
        >
          <Radio label={t("Around the clock")} value="roundClock" />
          <Radio label={t("Visiting")} value="checkOut" />
        </RadioGroup>
        <Box
          display="flex"
          gap="30px"
          sx={{
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Button
            startIcon={<FilterAltOutlinedIcon />}
            color="success"
            type="submit"
            buttonType="primary"
            sx={{
              width: {
                sx: "100%",
                md: "320px",
              },
              padding: "10px 0",
            }}
            // onClick={onFilterSubmit}
            loading={loading}
          >
            {t("Apply a filter")}
          </Button>
          <Button
            startIcon={<EraserIcon />}
            buttonType="secondary"
            sx={{
              width: {
                sx: "100%",
                md: "320px",
              },
              padding: "10px 0",
              ":hover": {
                backgroundColor: "#3F5984",
              },
            }}
            onClick={() => {
              reset();
              setRadioValue("roundClock");
            }}
            loading={loading}
          >
            {t("Clear the filter")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NotariesFiltration;
