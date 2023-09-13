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
import { useRouter } from "next/router";

interface IOptionData {
  regionsBody: {
    optionName: string | null;
    optionId: string | null;
  };
  districtsBody: {
    optionName: string | null;
    optionId: string | null;
  };
  citiesBody: {
    optionName: string | null;
    optionId: string | null;
  };
  notaryDistrictsBody: {
    cityId?: string | null;
    districtId?: string | null;
    regionId?: string | null;
    optionName?: string | null;
    optionId?: string | null;
  };
}

interface INotariesFiltrationProps {
  setSearchQuery: (val: string) => void;
  searchQuery: string;
  onSearchSubmit: () => void;
  radioValue: any;
  setRadioValue: any;
  notariesSortOptions: any;
  handleNotariesSortChange: any;
  onFilterSubmit: (val: any) => void;
  loading?: boolean;
  inputRef?: any;
  update: any;
  handleSubmit: any;
  control: any;
  onFilterClear: any;
}

const NotariesFiltration: FC<INotariesFiltrationProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  radioValue,
  setRadioValue,
  notariesSortOptions,
  handleNotariesSortChange,
  onFilterSubmit,
  loading,
  handleSubmit,
  control,
  onFilterClear,
}) => {
  const t = useTranslations();
  const { locale } = useRouter();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const [optionData, setOptionData] = useState<IOptionData>({
    citiesBody: {
      optionName: null,
      optionId: null,
    },
    districtsBody: {
      optionName: null,
      optionId: null,
    },
    notaryDistrictsBody: {
      optionName: null,
      optionId: null,
    },
    regionsBody: {
      optionName: null,
      optionId: null,
    },
  });

  const { citiesBody, districtsBody, notaryDistrictsBody, regionsBody } = optionData;

  const { data: regionsData } = useFetch("/api/notaries/dictionaries/regions", "POST", { body: regionsBody });
  const { data: citiesData } = useFetch("/api/notaries/dictionaries/cities", "POST", { body: citiesBody });
  const { data: districtsData } = useFetch("/api/notaries/dictionaries/districts", "POST", { body: districtsBody });
  const { data: notaryAreaData } = useFetch("/api/notaries/dictionaries/notary-area", "POST", {
    body: notaryDistrictsBody,
  });

  const { data: workDaysAreaData } = useFetch("/api/notaries/dictionaries/work-days", "GET");
  const { data: notaryTypesData } = useFetch("/api/notaries/dictionaries/notary-types", "GET");

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

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const notariesSortOptionsData = [{ value: "partner.simpleFullName", label: "В алфавитном порядке" }];

  const onChangeSelect = (optionId: string | null, optionName: string) => {
    if (optionName === "region") {
      setOptionData((prevData: IOptionData) => ({
        ...prevData,
        regionsBody: {
          optionName: optionName,
          optionId: optionId,
        },
        districtsBody: {
          optionName: optionName,
          optionId: optionId,
        },
      }));
    }
    if (optionName === "district") {
      setOptionData((prevData: IOptionData) => ({
        ...prevData,
        citiesBody: {
          optionName: optionName,
          optionId: optionId,
        },
      }));
    }
    if (optionName === "city") {
      setOptionData((prevData: IOptionData) => ({
        ...prevData,
        notaryDistrictsBody: {
          cityId: optionId,
          districtId: prevData.districtsBody.optionId,
          regionId: prevData.regionsBody.optionId,
        },
      }));
    }
  };

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
                render={({ field }) => (
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
                      selectType="success"
                      labelField={
                        el.type === "second" ? (locale === "ru" || locale === "kg" ? "title_ru" : "title") : "name"
                      }
                      valueField={el.type === "second" ? "value" : "id"}
                      data={el.options}
                      value={field.value != null ? field.value : ""}
                      onBlur={field.onBlur}
                      onChange={(...event: any[]) => {
                        field.onChange(...event);
                        const optionId = event[0].target?.value?.toString();
                        const optionName = el.name;
                        onChangeSelect(optionId, optionName);
                      }}
                    ></Select>
                  </Box>
                )}
              />
            );
          })}
        </Box>
        <Radio
          labelField="name"
          valueField="id"
          row
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
          data={[
            {
              name: t("Around the clock"),
              id: "roundClock",
            },
            {
              name: t("Visiting"),
              id: "checkOut",
            },
          ]}
        />
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
            onClick={onFilterClear}
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
