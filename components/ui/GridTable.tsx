import * as React from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColumnHeaderParams,
  GridColDef,
  DataGridProps,
  GridValidRowModel,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Box, MenuItem, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import Checkbox from "./Checkbox";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { useTranslations } from "next-intl";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Badge from "@mui/material/Badge";

export interface IGridTableFilterField {
  field: string;
  outputField: string;
}

export interface IFilterData {
  data: Record<string, Record<string, any>[]>;
  filterField: Record<string, IGridTableFilterField>;
}

export interface IFilterSubmitParams {
  value: (string | number)[];
  rowParams: GridColumnHeaderParams<GridValidRowModel, any, any>;
}

export interface IGridTableProps extends DataGridProps {
  filterData?: IFilterData;
  rows: GridRowsProp;
  columns: GridColDef[];
  onFilterSubmit?: (v: IFilterSubmitParams) => void;
  cellMaxHeight?: string | number;
  headerCellMaxHeight?: string | number;
}

export interface IGridTableHeaderProps {
  rowParams: GridColumnHeaderParams;
  filterData?: Record<string, any>[];
  filterField?: IGridTableFilterField;
  onFilterSubmit?: (v: IFilterSubmitParams) => void;
}

export const GridTable: React.FC<IGridTableProps> = ({
  columns,
  rows,
  filterData,
  cellMaxHeight,
  onFilterSubmit,
  headerCellMaxHeight,
  sx,
  ...rest
}) => {
  const t = useTranslations();
  const rootStyles = {
    ".MuiDataGrid-cell": {
      borderBottom: "none",
      color: "text.primary",
      fontWeight: "500",
    },
    ".MuiDataGrid-row": {
      border: "1px solid transparent",
      maxHeight: cellMaxHeight ? cellMaxHeight + " !important" : "fit-content !important",

      "&:hover": {
        backgroundColor: "#fff",
        border: "1px solid #CDCDCD",
      },
    },
    ".css-yrdy0g-MuiDataGrid-columnHeaderRow": {
      display: "flex",
      alignItems: "center",
    },
    ".MuiDataGrid-columnHeaders": {
      maxHeight: (headerCellMaxHeight ? headerCellMaxHeight : "fit-content") + "  !important",
      border: "1px solid #CDCDCD",

      ".MuiDataGrid-columnHeader": {
        height: "100% !important",
        ".MuiDataGrid-columnHeaderTitleContainer": {
          textWrap: "wrap !important",
        },

        "&:focus": {
          outline: "none",
        },
      },
    },

    ".MuiDataGrid-cell:focus": {
      outline: "none",
    },
    ".MuiDataGrid-row:not(.MuiDataGrid-row--dynamicHeight)>.MuiDataGrid-cell": {
      whiteSpace: "normal",
      maxHeight: "100% !important",
      padding: "10px",
      ".MuiDataGrid-cellContent": {
        overflow: "auto",
        height: "100%",
        display: "flex",
        alignItems: "center",
      },
    },

    border: "none",
    background: "transparent",
  };

  const mergedStyles = { ...rootStyles, ...sx };

  return (
    <DataGrid
      rows={rows}
      columns={columns?.map((col) => ({
        ...col,
        renderHeader: (rowParams: GridColumnHeaderParams) => {
          const specificFieldFilterData = filterData?.data?.[rowParams?.field];
          const filterField = filterData?.filterField?.[rowParams?.field];

          return (
            <GridTableHeader
              rowParams={rowParams}
              filterData={specificFieldFilterData}
              onFilterSubmit={onFilterSubmit}
              filterField={filterField}
            />
          );
        },
      }))}
      localeText={{
        toolbarExport: t("Export"),
        toolbarExportCSV: t("Download as CSV"),
        toolbarExportPrint: t("Print"),
        noRowsLabel: t("No data"),
      }}
      disableDensitySelector
      disableVirtualization
      hideFooterPagination
      disableColumnFilter
      disableColumnMenu
      showColumnVerticalBorder={false}
      showCellVerticalBorder={false}
      hideFooter
      rowSelection={false}
      density="comfortable"
      slots={{
        toolbar: () => (
          <Box padding="5px" display="flex" justifyContent="flex-end">
            <GridToolbarExport sx={{ color: "text.primary" }} />
          </Box>
        ),
      }}
      slotProps={{
        panel: {
          sx: {
            "& .MuiTypography-root": {
              color: "success.main",
            },
            "& .MuiDataGrid-filterForm": {
              bgcolor: "lightblue",
            },
          },
        },
        toolbar: {
          sx: {
            "& .MuiButtonBase-root": {
              color: "text.primary",
            },
          },
        },
      }}
      sx={mergedStyles}
      {...rest}
    />
  );
};

export const GridTableHeader: React.FC<IGridTableHeaderProps> = ({
  rowParams,
  filterData,
  onFilterSubmit,
  filterField,
}) => {
  const t = useTranslations();
  const [filterMenu, setFilterMenu] = React.useState<HTMLElement | null>(null);
  const [formValues, setFormValues] = React.useState<Record<string, any> | null>(null);
  const [isClearDisabled, setIsClearDisabled] = React.useState<boolean>(false);
  const [submitFormValues, setSubmitFormValues] = React.useState<Record<string, any> | null>(null);
  const open = !!filterMenu;

  const {
    watch,
    handleSubmit,
    register,
    resetField,
    setValue,
    formState: { isSubmitted },
  } = useForm();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setFilterMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setFilterMenu(null);

    if (formValues != null && !isSubmitted) {
      resetFields();
    }

    if (submitFormValues != null) {
      for (let field in submitFormValues) {
        setValue(field, submitFormValues[field]);
      }
    }
  };

  const resetFields = () => {
    for (let field in formValues) {
      resetField(field);
    }
  };

  const resetForm = () => {
    if (formValues != null) {
      resetFields();
      setSubmitFormValues(null);
      setFilterMenu(null);
      onFilterSubmit && onFilterSubmit({ value: [], rowParams: rowParams });
    }
  };

  const filterSelectionQuantity = (values: Record<string, any> | null): number => {
    if (values != null) return Object.values(values).filter((v) => v).length;
    return 0;
  };

  const onSubmit = async (data: Record<string, any>) => {
    setSubmitFormValues(data);
    setFormValues(data);
    setFilterMenu(null);
    const keysWithTrueValues = Object.keys(data).filter((key) => data[key] === true);
    onFilterSubmit && onFilterSubmit({ value: keysWithTrueValues, rowParams: rowParams });
  };

  React.useEffect(() => {
    const subscription = watch((value) => {
      setIsClearDisabled(Object.values(value).some((v) => v));
      setFormValues(value);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Box
      display="flex"
      width={rowParams?.colDef?.width ?? "100%"}
      height="100%"
      justifyContent="space-between"
      alignItems="center"
      py="10px"
      paddingRight="15px"
      gap="40px"
    >
      <Typography color="text.primary" fontWeight={600}>
        {rowParams?.colDef?.headerName}
      </Typography>
      {filterData && filterField && (
        <>
          <Box
            onClick={(e: any) => handleMenuOpen(e)}
            color="success.main"
            height="fit-content"
            display="flex"
            sx={{
              "&:hover": {
                opacity: "0.7",
              },
              cursor: "pointer",
            }}
          >
            {open || filterSelectionQuantity(submitFormValues) > 0 ? (
              <Badge
                badgeContent={filterSelectionQuantity(submitFormValues)}
                sx={{
                  "& .MuiBadge-badge": {
                    color: "success.main",
                    border: "1px solid",
                    background: "#fff",
                  },
                }}
                max={9}
              >
                <FilterAltIcon color="success" />
              </Badge>
            ) : (
              <FilterAltOutlinedIcon />
            )}
          </Box>

          <Menu
            anchorEl={filterMenu}
            open={open}
            onClose={handleMenuClose}
            sx={{ ".MuiList-padding": { padding: "0px" } }}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} paddingTop="10px" minWidth={250}>
              <Box
                maxHeight={190}
                overflow="auto"
                maxWidth={250}
                px="20px"
                sx={{
                  "::-webkit-scrollbar": { width: "4px" },
                  "::-webkit-scrollbar-thumb": {
                    background: "#E0E0E0",
                  },
                }}
              >
                {filterData.map((item, index) => (
                  <MenuItem key={index} sx={{ padding: 0, margin: "0 0 10px 0" }}>
                    <Checkbox
                      name={String(item[filterField.outputField])}
                      register={register}
                      label={item[filterField.field]}
                      checked={!!formValues?.[String(item[filterField.outputField])]}
                      width={"100%"}
                    />
                  </MenuItem>
                ))}

                {filterData.length < 1 && <Typography textAlign="center">{t("No data")}</Typography>}
              </Box>
              <Box display="flex" borderTop="1px solid #E0E0E0">
                <Button
                  type="submit"
                  sx={{
                    bgcolor: "transparent",
                    color: "success.main",
                    boxShadow: "none",
                    "&:hover": {
                      color: "white",
                      bgcolor: "success.main",
                    },
                  }}
                >
                  {t("Apply")}
                </Button>

                <Button
                  onClick={() => resetForm()}
                  disabled={!isClearDisabled}
                  sx={{
                    bgcolor: "transparent",
                    color: "success.main",
                    boxShadow: "none",
                    "&:hover": {
                      color: "white",
                      bgcolor: "error.main",
                    },
                  }}
                >
                  {t("Reset")}
                </Button>
              </Box>
            </Box>
          </Menu>
        </>
      )}
    </Box>
  );
};
