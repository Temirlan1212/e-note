import { ChangeEvent, FC, useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { format, parse } from "date-fns";
import { Box, InputLabel, Typography } from "@mui/material";
import { FilterAltOffOutlined, Search } from "@mui/icons-material";

import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import Select from "../ui/Select";
import DatePicker from "../ui/DatePicker";

import ExcelIcon from "@/public/icons/excel.svg";
import EraserIcon from "@/public/icons/eraser.svg";
import useFetch from "@/hooks/useFetch";
import { Controller } from "react-hook-form";

interface IUserRegistryFiltrationProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSearchSubmit: () => void;
  loading?: boolean;
  handleSubmit: any;
  control: any;
  onFilterClear: any;
  onFilterSubmit: (val: any) => void;
}

const UserRegistryFiltration: FC<IUserRegistryFiltrationProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  loading,
  handleSubmit,
  control,
  onFilterClear,
  onFilterSubmit,
}) => {
  const [fileName, setFileName] = useState<string | null>("");
  const [excelReqBody, setExcelReqBody] = useState({
    roleValue: "OMSU official",
    filterValues: {},
  });

  const { data: rolesData } = useFetch("/api/user-registry/dictionaries/roles", "POST");
  const { data: createdByData } = useFetch("/api/user-registry/dictionaries/createdBy", "POST");
  const { update: downloadExcel } = useFetch("", "GET", {
    returnResponse: true,
  });
  const { data: exportExcel } = useFetch("/api/officials/export", "POST", {
    body: excelReqBody,
  });

  console.log(createdByData);

  const t = useTranslations();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const download = async () => {
    const response = await downloadExcel(`/api/officials/download/${fileName}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName || "exported-data.csv";
    document.body.appendChild(a);
    a.click();
  };

  useEffect(() => {
    if (exportExcel?.data) {
      setFileName(exportExcel.data.fileName);
    }
  }, [exportExcel?.data]);

  const filteredData = createdByData?.data.filter(
    (item: { "emailAddress.address": string }) => !!item?.["emailAddress.address"] && item?.["emailAddress.address"]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClick={onSearchSubmit}
          loading={loading}
          boxSx={{
            width: {
              xs: "100%",
              md: "80%",
            },
          }}
          placeholder={t("Search")}
        />
        <Button
          sx={{
            ":hover": {
              color: "#fff",
            },
            display: {
              md: "flex",
            },
            width: {
              xs: "100%",
              md: "20%",
            },
            padding: "13px 10px",
          }}
          color="success"
          variant="outlined"
          endIcon={<ExcelIcon />}
          onClick={download}
        >
          {t("Export to Excel")}
        </Button>
      </Box>
      <Box component="form" onSubmit={handleSubmit(onFilterSubmit)}>
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {t("Registration period")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <Controller
                name="createdOn"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <>
                    <DatePicker
                      sx={{
                        width: {
                          xs: "100%",
                          md: "150px",
                        },
                      }}
                      onChange={(date: Date) => field.onChange({ ...field.value, value: format(date, "yyyy-MM-dd") })}
                      placeholder="__/__/____"
                      value={field.value}
                    />
                    <Typography>{t("FromTo")}</Typography>
                    <DatePicker
                      sx={{
                        width: {
                          xs: "100%",
                          md: "150px",
                        },
                      }}
                      onChange={(date: Date) => field.onChange({ ...field.value, value2: format(date, "yyyy-MM-dd") })}
                      placeholder="__/__/____"
                      value={field.value}
                    />
                  </>
                )}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {t("User role")}
            </Typography>
            <Controller
              name="role"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  data={rolesData?.data}
                  value={field.value != null ? field.value : ""}
                  valueField="name"
                  labelField="name"
                  startAdornment={<Search />}
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                  }}
                  selectType="primary"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {t("Registered by whom")}
            </Typography>
            <Controller
              name="createdBy"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Select
                  data={filteredData}
                  value={field.value ? field.value : null}
                  labelField="emailAddress.address"
                  valueField="emailAddress.address"
                  startAdornment={<Search />}
                  selectType="primary"
                  onChange={(...event: any[]) => {
                    field.onChange(...event);
                  }}
                />
              )}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            mt: "40px",
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <Button
            startIcon={<FilterAltOffOutlined />}
            color="success"
            buttonType="primary"
            type="submit"
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

export default UserRegistryFiltration;
